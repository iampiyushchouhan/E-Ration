import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { Customer } from '@/models/Customer';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const customer = await Customer.findOne({ customerId: id });
    
    if (!customer) {
      return NextResponse.json({ error: "Customer not found. Please check the ID." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error("API Error (customer fetch):", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
