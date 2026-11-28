// Real navigation: URL-driven views, back/forward support, deep links and a
// single place where route guards will live once auth is wired in.
// Hash-based on purpose: the app is hosted statically with base "./".

export type ViewName =
  | "homepage"
  | "workspace"
  | "how"
  | "plans"
  | "privacy"
  | "terms"
  | "why-private";

const PATH_TO_VIEW: Record<string, ViewName> = {
  "": "homepage",
  "/": "homepage",
  "/workspace": "workspace",
  "/how": "how",
  "/plans": "plans",
  "/privacy": "privacy",
  "/terms": "terms",
  "/why-private": "why-private",
};

const VIEW_TO_PATH: Record<ViewName, string> = {
  homepage: "/",
  workspace: "/workspace",
  how: "/how",
  plans: "/plans",
  privacy: "/privacy",
  terms: "/terms",
  "why-private": "/why-private",
};

// Routes that require a signed-in user. Auth is not implemented yet, so
// `requireAuth` stays empty; the guard structure is already in place.
const REQUIRE_AUTH: ReadonlySet<ViewName> = new Set([]);

export function viewFromLocation(): ViewName {
  const raw = window.location.hash.replace(/^#/, "");
  const path = raw.split("?")[0] ?? "";
  return PATH_TO_VIEW[path] ?? "homepage";
}

export type Router = {
  current: () => ViewName;
  navigate: (view: ViewName, options?: { replace?: boolean }) => void;
  subscribe: (listener: (view: ViewName) => void) => () => void;
  allowed: (view: ViewName) => boolean;
};

export function createRouter(): Router {
  let current = viewFromLocation();
  const listeners = new Set<(view: ViewName) => void>();

  const emit = (view: ViewName) => {
    current = view;
    for (const listener of listeners) listener(view);
  };

  window.addEventListener("hashchange", () => emit(viewFromLocation()));

  return {
    current: () => current,
    navigate: (view, options) => {
      const path = `#${VIEW_TO_PATH[view]}`;
      if (window.location.hash === path) {
        emit(view);
        return;
      }
      if (options?.replace) window.history.replaceState(null, "", path);
      else window.location.hash = path;
      emit(view);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    allowed: (view) => !REQUIRE_AUTH.has(view),
  };
}
