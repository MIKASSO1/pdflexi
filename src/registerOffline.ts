/** Production-only. No document data is sent to, or cached by, the service worker. */
export function registerOffline() {
  if (
    !import.meta.env.PROD ||
    !window.isSecureContext ||
    !("serviceWorker" in navigator)
  )
    return;
  window.addEventListener(
    "load",
    () => {
      void navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}sw.js`, {
          scope: import.meta.env.BASE_URL,
        })
        .catch(() => {
          /* Online editing remains available when caching is denied. */
        });
    },
    { once: true },
  );
}
