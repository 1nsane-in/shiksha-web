"use client";

import { CreditCard } from "lucide-react";
import { formatLedgerDate } from "@/components/admin/shared/format-ledger-date";

interface Payment {
  id: string;
  stage: number;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId?: string;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  manuallyApproved?: boolean;
}

interface Props {
  payments: Payment[];
}

const PAYMENT_STATUS = {
  SUCCESS: "bg-emerald-50 border-emerald-200 text-emerald-700",
  MANUALLY_APPROVED: "bg-emerald-50 border-emerald-200 text-emerald-700",
  FAILED: "bg-red-50 border-red-200 text-red-700",
  REFUNDED: "bg-red-50 border-red-200 text-red-700",
};

export function PaymentLedger({ payments }: Props) {
  return (
    <div className="rounded-xl border border-[#d3cec6] bg-white transition-all overflow-hidden">
      <div className="p-6 md:p-8 pb-4">
        <div className="mb-6 flex items-center border-b border-[#ebe7e1] pb-4">
          <div className="rounded-lg bg-zinc-100 p-2 text-[#111111] mr-3">
            <CreditCard className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#111111] tracking-tight">Payment Ledger</h2>
            <p className="text-[11px] text-[#626260] mt-0.5">Transaction history and financial status</p>
          </div>
        </div>

        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#ebe7e1]">
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#626260] font-sans w-1/3">Transaction</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#626260] font-sans w-1/3">Date & Time</th>
                  <th className="pb-3 text-[10px] font-semibold uppercase tracking-wider text-[#626260] font-sans text-right">Amount & Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {payments.map((p: Payment) => (
                  <tr key={p.id} className="group">
                    <td className="py-4 align-top">
                      <p className="font-medium text-[#111111]">Stage {p.stage} Admission Fee</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono text-[#626260] bg-zinc-50 px-1.5 py-0.5 rounded border border-[#ebe7e1]">
                          {p.razorpayOrderId || p.id.split("-")[0].toUpperCase()}
                        </span>
                        {p.paymentMethod && <span className="text-[10px] text-[#626260]">{p.paymentMethod}</span>}
                      </div>
                    </td>
                    <td className="py-4 align-top">
                      <p className="text-xs text-[#111111]">{formatLedgerDate(p.paidAt || p.createdAt)}</p>
                      {p.manuallyApproved && <p className="text-[10px] text-[#626260] mt-1 italic">Manually Approved</p>}
                    </td>
                    <td className="py-4 align-top text-right">
                      <p className="font-semibold text-[#111111] mb-1">
                        {p.currency === "INR" ? "₹" : p.currency} {p.amount.toLocaleString("en-IN")}
                      </p>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold border ${PAYMENT_STATUS[p.status as keyof typeof PAYMENT_STATUS] || "bg-amber-50 border-amber-200 text-amber-700"}`}>
                        {p.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center bg-zinc-50 rounded-lg border border-dashed border-[#d3cec6] mt-4">
            <p className="text-xs text-[#626260]">No payment records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
