import test from "node:test";
import assert from "node:assert/strict";
import { createAttachmentStore } from "../src/features/attachments/attachmentStore.ts";
const pdf = (name = "sample.pdf") =>
  new File(["%PDF-1.7\nfixture"], name, { lastModified: 123 });
function pausedPdf() {
  const file = pdf("delayed.pdf");
  let release, started;
  const reading = new Promise((resolve) => {
    started = resolve;
  });
  const header = new Promise((resolve) => {
    release = () => resolve(new TextEncoder().encode("%PDF-1.7").buffer);
  });
  file.slice = () => ({
    arrayBuffer: () => {
      started();
      return header;
    },
  });
  return { file, reading, release };
}
test("attachments publish stable immutable snapshots and preserve originals", async () => {
  const store = createAttachmentStore();
  try {
    const empty = store.getSnapshot();
    const original = pdf();
    const result = await store.add([original]);
    assert.deepEqual(result.errors, []);
    assert.equal(empty.length, 0);
    assert.equal(store.getSnapshot()[0].file, original);
    assert.equal(store.getSnapshot()[0].id, result.firstAddedId);
    assert.equal(store.getSnapshot(), store.getSnapshot());
  } finally {
    store.dispose();
  }
});
test("metadata and PDF header failures never enter the store", async () => {
  const store = createAttachmentStore();
  try {
    const result = await store.add([
      new File(["x"], "x.html"),
      new File(["not a pdf"], "x.pdf"),
      new File([], "empty.pdf"),
    ]);
    assert.deepEqual(
      result.errors.map((e) => e.code),
      ["badFormat", "badPdf", "readError"],
    );
    assert.equal(store.getSnapshot().length, 0);
  } finally {
    store.dispose();
  }
});
test("queued uploads reject duplicates and enforce the shared file limit", async () => {
  const store = createAttachmentStore();
  try {
    const original = pdf();
    const [first, second] = await Promise.all([
      store.add([original]),
      store.add([original]),
    ]);
    assert.equal(first.errors.length, 0);
    assert.equal(second.errors[0].code, "duplicate");
    const result = await store.add(
      Array.from({ length: 10 }, (_, i) => pdf(`${i}.pdf`)),
    );
    assert.equal(store.getSnapshot().length, 10);
    assert.equal(result.errors.at(-1).code, "limit");
  } finally {
    store.dispose();
  }
});
test("removing a file during another header read cannot resurrect it", async () => {
  const store = createAttachmentStore();
  const delayed = pausedPdf();
  try {
    await store.add([pdf()]);
    const id = store.getSnapshot()[0].id;
    const pending = store.add([delayed.file]);
    await delayed.reading;
    store.remove(id);
    delayed.release();
    await pending;
    assert.deepEqual(
      store.getSnapshot().map((a) => a.file.name),
      ["delayed.pdf"],
    );
  } finally {
    delayed.release();
    store.dispose();
  }
});
test("dispose cancels pending and queued uploads without leaking object URLs", async (t) => {
  const store = createAttachmentStore();
  const revoked = [];
  const revoke = URL.revokeObjectURL.bind(URL);
  t.mock.method(URL, "revokeObjectURL", (url) => {
    revoked.push(url);
    revoke(url);
  });
  const delayed = pausedPdf();
  await store.add([pdf()]);
  const url = store.getSnapshot()[0].url;
  const pending = store.add([delayed.file]);
  const queued = store.add([pdf("queued.pdf")]);
  await delayed.reading;
  store.dispose();
  delayed.release();
  await Promise.all([pending, queued]);
  assert.deepEqual(store.getSnapshot(), []);
  assert.deepEqual(revoked, [url]);
  // Reusable after effect cleanup/setup, including React StrictMode.
  await store.add([pdf("new.pdf")]);
  assert.equal(store.getSnapshot().length, 1);
  store.dispose();
});
test("removal revokes the URL and unsubscribing detaches the listener", async (t) => {
  const store = createAttachmentStore();
  const revoked = [];
  const revoke = URL.revokeObjectURL.bind(URL);
  t.mock.method(URL, "revokeObjectURL", (url) => {
    revoked.push(url);
    revoke(url);
  });
  let notifications = 0;
  const unsubscribe = store.subscribe(() => notifications++);
  await store.add([pdf()]);
  const item = store.getSnapshot()[0];
  unsubscribe();
  store.remove(item.id);
  store.remove(item.id);
  assert.equal(notifications, 1);
  assert.deepEqual(revoked, [item.url]);
  store.dispose();
});
