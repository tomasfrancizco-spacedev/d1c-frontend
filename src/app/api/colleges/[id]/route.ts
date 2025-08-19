import { NextResponse } from 'next/server';
import { BACKEND_API_BASE_URL } from '@/lib/api';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
)   {
  try {
    const { id } = await context.params;
    
    // Get authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    
    // Validate that we have at least one field to update
    const hasUpdates = body.name !== undefined || body.nickname !== undefined || body.walletAddress !== undefined;
    if (!hasUpdates) {
      return NextResponse.json(
        { error: 'At least one field (name, nickname, walletAddress) must be provided' },
        { status: 400 }
      );
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/college/update/${id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': authHeader,
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Failed to update college: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Failed to update college:', error);
    return NextResponse.json(
      { error: 'Failed to update college' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Get authorization header from the request
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      );
    }

    // Make request to backend API
    const response = await fetch(`${BACKEND_API_BASE_URL}/v1/college/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend API error:', response.status, errorText);
      return NextResponse.json(
        { error: `Failed to delete college: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Failed to delete college:', error);
    return NextResponse.json(
      { error: 'Failed to delete college' },
      { status: 500 }
    );
  }
}
