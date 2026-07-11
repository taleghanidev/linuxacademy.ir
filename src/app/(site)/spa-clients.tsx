"use client";
// Client-side loaders for the SPA pages. Route page.tsx files stay server
// components (so generateMetadata + JSON-LD render server-side) and import from here.
import dynamic from "next/dynamic";

const loading = () => <div className="min-h-screen" />;

export const HomeClient = dynamic(() => import("@/spa/pages/Index"), { ssr: false, loading });
export const BookClient = dynamic(() => import("@/spa/pages/BookRedirect"), {
  ssr: false,
  loading,
});
export const CartClient = dynamic(() => import("@/spa/pages/Cart"), { ssr: false, loading });
export const ContactClient = dynamic(() => import("@/spa/pages/Contact"), { ssr: false, loading });
export const OrderThankYouClient = dynamic(() => import("@/spa/pages/OrderThankYou"), {
  ssr: false,
  loading,
});
export const PaymentErrorClient = dynamic(() => import("@/spa/pages/PaymentError"), {
  ssr: false,
  loading,
});
export const PrivacyPolicyClient = dynamic(() => import("@/spa/pages/PrivacyPolicy"), {
  ssr: false,
  loading,
});
export const ScheduleClient = dynamic(() => import("@/spa/pages/Schedule"), {
  ssr: false,
  loading,
});
export const ServicesArchitectClient = dynamic(() => import("@/spa/pages/ServicesArchitect"), {
  ssr: false,
  loading,
});
export const ServicesConsultClient = dynamic(() => import("@/spa/pages/ServicesConsult"), {
  ssr: false,
  loading,
});
export const ServicesImplementClient = dynamic(() => import("@/spa/pages/ServicesImplement"), {
  ssr: false,
  loading,
});
export const SponsorshipClient = dynamic(() => import("@/spa/pages/Sponsorship"), {
  ssr: false,
  loading,
});
export const TermsOfServiceClient = dynamic(() => import("@/spa/pages/TermsOfService"), {
  ssr: false,
  loading,
});
