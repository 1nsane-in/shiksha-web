import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params = new URLSearchParams();

  formData.forEach((value, key) => {
    params.set(key, value.toString());
  });

  const redirectUrl = new URL("/payments/success/verify", request.url);
  redirectUrl.search = params.toString();

  return NextResponse.redirect(redirectUrl, 303);
}

export async function GET() {
  return NextResponse.redirect(
    new URL(
      "/student/payments",
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    ),
  );
}
