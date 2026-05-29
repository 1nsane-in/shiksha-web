import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const errorMessage =
    formData.get("error_Message")?.toString() || "Payment failed";

  const redirectUrl = new URL("/payments/failure/result", request.url);
  redirectUrl.searchParams.set("error_Message", errorMessage);

  return NextResponse.redirect(redirectUrl, 303);
}

export async function GET(request: NextRequest) {
  const errorMessage =
    request.nextUrl.searchParams.get("error_Message") || "Payment failed";
  const redirectUrl = new URL("/payments/failure/result", request.url);
  redirectUrl.searchParams.set("error_Message", errorMessage);
  return NextResponse.redirect(redirectUrl, 303);
}
