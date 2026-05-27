"use client";

import { useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { Button } from "@repo/ui";
import { Badge } from "@repo/ui";
import { Skeleton } from "@repo/ui";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@repo/ui";
import { usePaymentConfig, usePaymentHistory, useInitiatePayment, useVerifyPayment } from "@/domains/payments";
import { useAuth } from "@/hooks/useAuth";
import { useStageInfo } from "@/domains/student";
import { toast } from "sonner";
import {
  CreditCard, AlertCircle, RefreshCw, Banknote, CheckCircle2,
  XCircle, Clock, Ban, Inbox
} from "lucide-react";

const statusStyles: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  PENDING: "secondary",
  SUCCESS: "default",
  FAILED: "destructive",
  REFUNDED: "outline",
  MANUALLY_APPROVED: "outline",
};

const statusIcons: Record<string, typeof Clock> = {
  PENDING: Clock,
  SUCCESS: CheckCircle2,
  FAILED: XCircle,
  REFUNDED: Ban,
  MANUALLY_APPROVED: CheckCircle2,
};

function PayNowForm({
  stage,
  amount,
  onSuccess,
}: {
  stage: number;
  amount: number;
  onSuccess: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { user } = useAuth();
  const initiatePayment = useInitiatePayment();
  const verifyPayment = useVerifyPayment();
  const { data: stageInfo } = useStageInfo();
  const isPaid = stageInfo?.payments?.some((p) => p.stage === stage && p.status === "SUCCESS");
  const isLocked = (stageInfo?.currentStage ?? 1) < stage;

  const handlePay = useCallback(async () => {
    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    try {
      const hashData = await initiatePayment.mutateAsync({
        applicationId: "",
        stage,
        firstName: user.name ?? "Student",
        email: user.email,
        phone: "",
      });

      if (!formRef.current) return;

      const form = formRef.current;
      form.action = hashData.surl;
      form.method = "POST";

      const fields: Record<string, string> = {
        hash: hashData.hash,
        key: hashData.key,
        txnid: hashData.txnid,
        amount: hashData.amount,
        productinfo: hashData.productinfo,
        firstname: hashData.firstname,
        email: hashData.email,
        phone: hashData.phone,
        surl: hashData.surl,
        furl: hashData.furl,
        service_provider: hashData.service_provider,
        udf1: hashData.udf1 ?? "",
        udf2: hashData.udf2 ?? "",
        udf3: hashData.udf3 ?? "",
        udf4: hashData.udf4 ?? "",
        udf5: hashData.udf5 ?? "",
      };

      Object.entries(fields).forEach(([name, value]) => {
        let input = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
        if (!input) {
          input = document.createElement("input");
          input.type = "hidden";
          input.name = name;
          form.appendChild(input);
        }
        input.value = value;
      });

      form.submit();
    } catch {
      toast.error("Failed to initiate payment. Please try again.");
    }
  }, [user, stage, initiatePayment]);

  if (isPaid) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1">
        <CheckCircle2 className="size-3" />
        Paid
      </Badge>
    );
  }

  return (
    <>
      <Button
        size="sm"
        onClick={handlePay}
        disabled={isLocked || initiatePayment.isPending}
        className="gap-1.5"
      >
        {initiatePayment.isPending ? (
          <>Processing...</>
        ) : (
          <>
            <Banknote className="size-3.5" />
            Pay Now
          </>
        )}
      </Button>
      {isLocked && (
        <p className="text-xs text-gray-400 mt-1">Complete previous stages first</p>
      )}
      <form ref={formRef} style={{ display: "none" }} />
    </>
  );
}

export default function PaymentsPage() {
  const { data: config, isLoading: configLoading, isError: configError, refetch: refetchConfig } = usePaymentConfig();
  const { data: history, isLoading: historyLoading } = usePaymentHistory();

  const allLoading = configLoading && historyLoading;

  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="size-12 text-red-400 mb-4" />
        <h2 className="text-lg font-semibold text-[#2D2154]">Failed to load payments</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">Something went wrong. Please try again.</p>
        <Button onClick={() => refetchConfig()} variant="outline" className="gap-2">
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#2D2154]">Payments</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your admission and exam fees</p>
      </div>

      {/* Payment Config Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {configLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : config && config.length > 0 ? (
          config.map((item) => (
            <Card key={item.stage} size="sm">
              <CardContent className="py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="size-4 text-[#4B2D8E]" />
                      <h3 className="font-semibold text-sm text-[#2D2154]">{item.label}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    <p className="text-lg font-bold text-[#4B2D8E] mt-2">₹{item.amount?.toLocaleString("en-IN")}</p>
                  </div>
                  <PayNowForm stage={item.stage} amount={item.amount} onSuccess={() => refetchConfig()} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card size="sm" className="md:col-span-2">
            <CardContent className="py-8 text-center">
              <p className="text-sm text-gray-500">No payment stages configured</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payment History */}
      <Card size="xl">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : !history || history.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <Inbox className="size-12 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">No payments yet</p>
              <p className="text-xs text-gray-400 mt-1">Your payment history will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stage</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((payment) => {
                    const StatusIcon = statusIcons[payment.status] ?? Clock;
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="text-sm">Stage {payment.stage}</TableCell>
                        <TableCell className="font-medium">
                          ₹{payment.amount?.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusStyles[payment.status] ?? "secondary"} className="gap-1 text-xs">
                            <StatusIcon className="size-3" />
                            {payment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {payment.paymentMethod ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {payment.paidAt
                            ? new Date(payment.paidAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : payment.createdAt
                              ? new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

