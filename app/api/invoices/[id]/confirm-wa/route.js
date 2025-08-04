import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Update invoice status using ID
    const updated = await prisma.invoice.update({
      where: { id: parseInt(id) },
      data: {
        status: 'SENT'
      }
    });

    return NextResponse.json({ success: true, invoice: updated });
  } catch (error) {
    console.error('Error confirming invoice via WA:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
