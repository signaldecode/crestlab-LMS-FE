/**
 * 결제 승인 프록시 Route Handler
 * - 프론트에서 받은 paymentKey/orderId/amount를
 *   백엔드로 전달하여 토스페이먼츠 최종 승인을 수행한다
 * - 시크릿 키는 백엔드에서만 사용한다 (프론트 노출 금지)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/cookies';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: 'AUTH_REQUIRED' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || amount == null) {
      return NextResponse.json(
        { error: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_BASE}/api/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const data = await res.text();

    return new NextResponse(data, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'PAYMENT_CONFIRM_ERROR' },
      { status: 502 }
    );
  }
}
