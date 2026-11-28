import React from "react";
import "../../styles/mobile-workspace.css";

export const PRICING = {
  pro: { monthly: 12, yearlyMonthly: 9 },
  teams: { tiers: { 1000: 20, 2500: 45, 5000: 80, 10000: 150 } as Record<number, number> },
  enterprise: { tiers: { 20000: 280, 50000: 600, 100000: 1000 } as Record<number, number> },
  yearlyDiscount: 0.2,
};

export const usd = (amount: number) => `$${amount.toLocaleString("en-US")}`;
export const perYear = (monthly: number) => Math.round(monthly * (1 - PRICING.yearlyDiscount));
export const tierExamples = (tiers: Record<number, number>) =>
  Object.entries(tiers)
    .map(([credits, monthly]) => `${Number(credits).toLocaleString("en-US")} credits is ${usd(monthly)} / month, or ${usd(perYear(monthly))} / month billed ${usd(perYear(monthly) * 12)} / year`)
    .join("; ");

export interface StaticPageProps {
  view: 'homepage' | 'workspace' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private';
  isSun: boolean;
  outerBg: string;
  middleBg: string;
  middleText: string;
  middleMuted: string;
  middleCard: string;
  middleCardBorder: string;
  sideBg: string;
  header: React.ReactNode;
  sidebarContent: React.ReactNode;
  rightBar: React.ReactNode;
  userMenu: React.ReactNode;
  leftSidebarStyle: React.CSSProperties;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  navTo: (v: 'homepage' | 'how' | 'plans' | 'privacy' | 'terms' | 'why-private') => void;
  setRightActive: (v: string | null) => void;
  setShowHelpPopup: (v: boolean) => void;
}
