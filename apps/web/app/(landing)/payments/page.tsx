import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CreditCard,
  FileCheck2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { contactInfo } from "@/lib/brand-data";

export const metadata: Metadata = {
  title: "Online Payment | Shiksha International",
  description:
    "Pay your medical admission fees securely through Shiksha International's online payment portal. Track stage-wise payments and receipts in your student dashboard.",
};

const steps = [
  {
    title: "Log in to your account",
    description:
      "Use your registered student credentials to access your admission dashboard.",
  },
  {
    title: "Open the payments section",
    description:
      "See your unlocked payment stages, amounts due, and payment history.",
  },
  {
    title: "Pay through the secure gateway",
    description:
      "Choose your preferred method and complete the payment on the encrypted gateway.",
  },
  {
    title: "Track your receipt",
    description:
      "Your dashboard updates after gateway confirmation. Keep the receipt for your records.",
  },
];

const payableItems = [
  {
    icon: FileCheck2,
    title: "Application & stage fees",
    description:
      "Pay the fees linked to each unlocked stage of your admission application.",
  },
  {
    icon: Building2,
    title: "University & admission fees",
    description:
      "Settle university-related payments directly from your student account.",
  },
  {
    icon: CreditCard,
    title: "Other approved charges",
    description:
      "Any additional service or support charges will appear in your dashboard.",
  },
];

const methods = [
  { icon: CreditCard, label: "Debit & credit cards" },
  { icon: Smartphone, label: "UPI" },
  { icon: Building2, label: "Net banking" },
];

export default function PaymentsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-24 pt-36">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 0%, rgba(201,164,92,0.24), transparent 42%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.08), transparent 38%)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
            style={{ background: brand.goldLight, color: brand.gold }}
          >
            <ShieldCheck className="size-3.5" />
            Secure online payment
          </p>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pay your admission fees,{" "}
            <span style={{ color: brand.gold }}>securely.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-300">
            Stage-wise fee payments for your medical admission journey. Log in
            to view your due payments, pay through the secure gateway, and track
            receipts in one place.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/student/payments"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{
                background: brand.gold,
                color: brand.ink,
                borderRadius: brand.btnRadius,
              }}
            >
              Go to payment dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login?redirect=%2Fstudent%2Fpayments"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              style={{
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: brand.btnRadius,
              }}
            >
              Student login
            </Link>
          </div>

          <div className="mx-auto mt-9 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole className="size-3.5" />
              Encrypted payment gateway
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CreditCard className="size-3.5" />
              Card details never stored
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              Receipt in your dashboard
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p
            className="text-xs font-semibold uppercase tracking-[0.14em]"
            style={{ color: brand.gold }}
          >
            How it works
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: brand.ink }}
          >
            Four steps to a confirmed payment
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: brand.inkMuted }}>
            Payments are tied to your application. Only pay from the dashboard
            so your records stay updated.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border bg-white p-6 shadow-sm"
              style={{ borderColor: brand.hairline }}
            >
              <span
                className="inline-flex size-9 items-center justify-center rounded-full text-sm font-bold"
                style={{ background: brand.goldLight, color: brand.gold }}
              >
                {index + 1}
              </span>
              <h3
                className="mt-4 text-base font-semibold"
                style={{ color: brand.ink }}
              >
                {step.title}
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: brand.inkMuted }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <h2
              className="text-2xl font-bold tracking-tight sm:text-3xl"
              style={{ color: brand.ink }}
            >
              What you can pay for
            </h2>
            <p className="mt-2 text-sm" style={{ color: brand.inkMuted }}>
              Your dashboard shows the exact amount and stage before you pay.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {payableItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border bg-white p-5"
                  style={{ borderColor: brand.hairline }}
                >
                  <item.icon className="size-5" style={{ color: brand.gold }} />
                  <h3
                    className="mt-3 text-sm font-semibold"
                    style={{ color: brand.ink }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-1.5 text-xs leading-relaxed"
                    style={{ color: brand.inkMuted }}
                  >
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="mt-6 rounded-2xl border p-5"
              style={{
                borderColor: brand.goldBorder,
                background: brand.goldLight,
              }}
            >
              <div className="flex items-start gap-3">
                <ShieldCheck
                  className="mt-0.5 size-5 shrink-0"
                  style={{ color: brand.gold }}
                />
                <div>
                  <h3
                    className="text-sm font-semibold"
                    style={{ color: brand.ink }}
                  >
                    Payment confirmation
                  </h3>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: brand.inkMuted }}
                  >
                    A payment is confirmed only after the payment gateway
                    verifies it. If your bank account is debited but the
                    dashboard still shows pending, contact support with your
                    transaction ID before retrying.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div
              className="rounded-2xl border bg-white p-6"
              style={{ borderColor: brand.hairline }}
            >
              <h2 className="text-lg font-semibold" style={{ color: brand.ink }}>
                Accepted methods
              </h2>
              <ul className="mt-4 space-y-3">
                {methods.map((method) => (
                  <li
                    key={method.label}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: brand.inkMuted }}
                  >
                    <method.icon
                      className="size-4 shrink-0"
                      style={{ color: brand.gold }}
                    />
                    {method.label}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="rounded-2xl border bg-white p-6"
              style={{ borderColor: brand.hairline }}
            >
              <h2 className="text-lg font-semibold" style={{ color: brand.ink }}>
                Need help?
              </h2>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: brand.inkMuted }}
              >
                For payment issues, share your registered email and transaction
                ID with our team.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  style={{ color: brand.ink }}
                >
                  <Mail className="size-4" style={{ color: brand.gold }} />
                  {contactInfo.email}
                </a>
                <Link
                  href="/contact-us"
                  className="inline-flex items-center gap-1.5 pt-2 text-sm font-semibold"
                  style={{ color: brand.gold }}
                >
                  Contact support
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
