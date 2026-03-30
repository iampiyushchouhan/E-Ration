import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { Booking } from '@/models/Booking';

export async function GET(request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  try {
    const { customerId } = await params;
    await connectToDatabase();
    
    // Sort by createdAt descending to get the most recent booking
    const bookings = await Booking.find({ customerId }).sort({ createdAt: -1 });
    
    if (!bookings || bookings.length === 0) {
      return NextResponse.json({ error: "No bookings found for this Customer ID." }, { status: 404 });
    }
    
    // Return the latest booking for the status screen
    return NextResponse.json({ success: true, booking: bookings[0] });
  } catch (error) {
    console.error("API Error (booking fetch):", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ customerId: string }> }) {
  try {
    const { customerId } = await params;
    await connectToDatabase();
    
    // Delete the most recent booking for this customer
    const result = await Booking.findOneAndDelete({ customerId }, { sort: { createdAt: -1 } });
    
    if (!result) {
      return NextResponse.json({ error: "No booking found to delete." }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("API Error (booking delete):", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
