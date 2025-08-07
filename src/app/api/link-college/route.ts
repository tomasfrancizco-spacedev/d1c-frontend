import { NextRequest, NextResponse } from "next/server";
import { BACKEND_API_BASE_URL } from "@/lib/api";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const collegeId = searchParams.get("collegeId");

  if (!userId || !collegeId) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/user/update/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentLinkedCollege: collegeId }),
    });

    if (!response.ok) {
      return NextResponse.json({ success: false, error: "Failed to link college" }, { status: 500 });
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ success: false, error: "Failed to link college" }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error("Error linking college:", error);
    return NextResponse.json({ error: "Failed to link college" }, { status: 500 });
  }
}