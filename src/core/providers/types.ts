// Boundaries every outside party sits behind: auth, storage, AI and billing.
// Implementations are added one at a time; the rest of the app only knows these shapes.

export type Session = {
  userId: string;
  email?: string;
  accessToken?: string;
  expiresAt?: number;
};

export type AuthProvider = {
  id: string;
  signUp(input: { email: string; password: string }): Promise<{ session: Session | null; needsConfirmation: boolean }>;
  signIn(input: { email: string; password: string }): Promise<Session>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
  onSessionChange(listener: (session: Session | null) => void): () => void;
};

export type DocumentRef = {
  id: string;
  name: string;
  bytes: number;
  createdAt: number;
  accountId: string | null;
};

export type StorageProvider = {
  id: string;
  local: boolean;
  put(accountId: string, file: File): Promise<DocumentRef>;
  get(accountId: string, id: string): Promise<File | null>;
  list(accountId: string): Promise<DocumentRef[]>;
  remove(accountId: string, id: string): Promise<void>;
};

export type AiTask =
  | "chat"
  | "summarize"
  | "contract-risks"
  | "forgery-signals"
  | "compare-contracts"
  | "invoice-rows"
  | "fill-form"
  | "translate"
  | "tailor-cv"
  | "plan";

export type AiRequest = {
  task: AiTask;
  locale: string;
  prompt: string;
  text?: string;
  schema?: unknown;
  signal?: AbortSignal;
};

export type AiResponse = {
  text: string;
  usage?: { input: number; output: number };
  model?: string;
};

export type AiProvider = {
  id: string;
  runsOnDevice: boolean;
  complete(request: AiRequest): Promise<AiResponse>;
};

export type PlanId = "free" | "pro";

export type SubscriptionState = "trialing" | "active" | "past_due" | "canceled";

export type Subscription = {
  providerId: string;
  contractRef?: string;
  planId: PlanId;
  state: SubscriptionState;
  currentPeriodEnd?: number;
  cancelAtPeriodEnd?: boolean;
};

export type BillingEvent =
  | { type: "subscription.started"; subscription: Subscription }
  | { type: "subscription.updated"; subscription: Subscription }
  | { type: "subscription.canceled"; subscription: Subscription }
  | { type: "payment.failed"; subscription: Subscription };

export type BillingPartner = {
  id: string;
  displayName: string;
  contractRef: string;
  checkoutUrl: string | null;
};

export type BillingProvider = {
  id: string;
  partner: BillingPartner;
  startCheckout(input: { accountId: string; planId: PlanId; returnUrl: string }): Promise<{ url: string }>;
  openPortal(accountId: string): Promise<{ url: string }>;
  verifyWebhook(input: { headers: Record<string, string>; body: string }): Promise<BillingEvent | null>;
};

export type Entitlements = {
  planId: PlanId;
  subscription: SubscriptionState | null;
  aiRequestsPerDay: number;
  proCapabilities: boolean;
};

export function entitlementsFor(subscription: Subscription | null): Entitlements {
  const paid = subscription !== null && (subscription.state === "active" || subscription.state === "trialing");
  return {
    planId: paid ? subscription.planId : "free",
    subscription: subscription?.state ?? null,
    aiRequestsPerDay: paid ? 200 : 2,
    proCapabilities: paid,
  };
}
