import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
  try {
    const { invoiceNumber } = params;
    const { status, confirmedAt } = await request.json();

    // Update invoice status and confirmation date
    const updated = await prisma.invoice.update({
      where: { invoiceNumber },
      data: {
        status: 'CONFIRMED_WA',
        confirmedAt: confirmedAt ? new Date(confirmedAt) : new Date()
      }
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error) {
    console.error('Error confirming invoice via WA:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
