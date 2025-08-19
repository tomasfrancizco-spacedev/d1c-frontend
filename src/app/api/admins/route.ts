import { BACKEND_API_BASE_URL } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/user/admins`, {
      method: "GET",
      headers: request.headers,
    });

    if (response.headers.get("content-length") === "0") {
      return NextResponse.json({ success: false, data: null }, { status: 404 });
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }

}