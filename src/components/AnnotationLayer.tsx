import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import {
  annotationBounds,
  drawAnnotation,
  hitAnnotation,
  moveAnnotation,
} from "../lib/annotations";
import type {
  Annotation,
  EditController,
  EditTool,
  MarkStyle,
  Point,
} from "../lib/annotations";
export type EditingProps = {
  editor: EditController;
  tool: EditTool;
  style: MarkStyle;
  selectedId: string | null;
  onSelect: (mark: Annotation | null) => void;
  onHint: () => void;
  label: string;
};
export function AnnotationLayer({
  width,
  height,
  page,
  pageWidth,
  editing,
  visible,
}: {
  width: number;
  height: number;
  page: number;
  pageWidth: number;
  editing: EditingProps;
  visible: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const drag = useRef<{
    start: Point;
    mark?: Annotation;
    erase: Set<string>;
    moved: boolean;
  } | null>(null);
  const [draft, setDraft] = useState<Annotation | null>(null);
  const [erased, setErased] = useState<Set<string>>(new Set());
  const { editor, tool, style, selectedId, onSelect, onHint } = editing;
  const marks = editor.annotations.filter((a) => a.page === page);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!visible) {
      canvas.width = 0;
      canvas.height = 0;
      return;
    }
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    for (const mark of marks)
      if (!erased.has(mark.id))
        drawAnnotation(
          ctx,
          draft?.id === mark.id ? draft : mark,
          width,
          height,
        );
    if (draft && !marks.some((a) => a.id === draft.id))
      drawAnnotation(ctx, draft, width, height);
    const selected = draft || marks.find((a) => a.id === selectedId);
    if (selected && tool === "select") {
      const b = annotationBounds(ctx, selected, width, height);
      ctx.save();
      ctx.strokeStyle = "#7050b7";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 4]);
      ctx.strokeRect(
        b.x * width - 4,
        b.y * height - 4,
        b.width * width + 8,
        b.height * height + 8,
      );
      ctx.restore();
    }
  }, [marks, draft, erased, selectedId, tool, width, height, visible]);
  function point(e: PointerEvent<HTMLCanvasElement>): Point {
    const b = e.currentTarget.getBoundingClientRect();
    return {
      x: Math.max(0.005, Math.min(0.995, (e.clientX - b.left) / b.width)),
      y: Math.max(0.005, Math.min(0.995, (e.clientY - b.top) / b.height)),
    };
  }
  function make(type: Annotation["type"], p: Point): Annotation {
    return {
      ...style,
      id: crypto.randomUUID(),
      page,
      type,
      points: [p],
      pageWidth,
      pageHeight: (pageWidth * height) / width,
      textWidth: 0.65,
    };
  }
  function down(e: PointerEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.focus();
    const p = point(e),
      ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const hit = hitAnnotation(ctx, marks, p, width, height);
    if (tool === "text") {
      if (!style.text.trim()) {
        onHint();
        return;
      }
      const a = make("text", p),
        b = annotationBounds(ctx, a, width, height);
      if (b.height > 0.98) {
        onHint();
        return;
      }
      const next = moveAnnotation(ctx, a, { x: 0, y: 0 }, width, height);
      editor.commit([...editor.annotations, next]);
      onSelect(next);
      return;
    }
    if (tool === "select") {
      onSelect(hit || null);
      drag.current = { start: p, mark: hit, erase: new Set(), moved: false };
    } else if (tool === "eraser") {
      const ids = new Set(hit ? [hit.id] : []);
      drag.current = { start: p, erase: ids, moved: false };
      setErased(new Set(ids));
    } else {
      const mark = make(tool, p);
      if (tool !== "pen") mark.points.push(p);
      drag.current = { start: p, mark, erase: new Set(), moved: false };
      setDraft(mark);
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent<HTMLCanvasElement>) {
    const state = drag.current;
    if (!state) return;
    const p = point(e),
      ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    if (
      Math.hypot(
        (p.x - state.start.x) * width,
        (p.y - state.start.y) * height,
      ) > 2
    )
      state.moved = true;
    if (tool === "eraser") {
      const hit = hitAnnotation(
        ctx,
        marks.filter((a) => !state.erase.has(a.id)),
        p,
        width,
        height,
      );
      if (hit) {
        state.erase.add(hit.id);
        setErased(new Set(state.erase));
      }
      return;
    }
    if (!state.mark) return;
    if (tool === "select") {
      setDraft(
        moveAnnotation(
          ctx,
          state.mark,
          { x: p.x - state.start.x, y: p.y - state.start.y },
          width,
          height,
        ),
      );
      return;
    }
    if (tool === "pen") {
      const last = state.mark.points[state.mark.points.length - 1];
      if (Math.hypot((last.x - p.x) * width, (last.y - p.y) * height) < 1)
        return;
      state.mark = { ...state.mark, points: [...state.mark.points, p] };
    } else state.mark = { ...state.mark, points: [state.start, p] };
    setDraft(state.mark);
  }
  function up(e: PointerEvent<HTMLCanvasElement>) {
    const state = drag.current;
    if (!state) return;
    if (tool === "eraser" && state.erase.size) {
      editor.commit(editor.annotations.filter((a) => !state.erase.has(a.id)));
      onSelect(null);
    } else if (tool === "select" && state.mark && draft && state.moved) {
      editor.commit(
        editor.annotations.map((a) => (a.id === draft.id ? draft : a)),
      );
      onSelect(draft);
    } else if (
      !["select", "eraser"].includes(tool) &&
      state.mark &&
      (state.moved || tool === "pen")
    ) {
      editor.commit([...editor.annotations, state.mark]);
      onSelect(state.mark);
    }
    drag.current = null;
    setDraft(null);
    setErased(new Set());
    if (e.currentTarget.hasPointerCapture(e.pointerId))
      e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function cancel() {
    drag.current = null;
    setDraft(null);
    setErased(new Set());
  }
  return (
    <canvas
      ref={ref}
      className={`annotation-layer tool-${tool} ${selectedId ? "has-selection" : ""}`}
      style={{ width, height }}
      tabIndex={0}
      role="application"
      aria-label={`${editing.label} · ${page}`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={cancel}
    />
  );
}
