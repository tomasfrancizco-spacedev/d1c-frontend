import { BACKEND_API_BASE_URL } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userAddress = searchParams.get("userAddress");

  if (!userAddress) {
    return NextResponse.json({ error: "User address is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/user/wallet/${userAddress}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    console.log("user data", {data});

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
  
}