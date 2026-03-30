import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { Booking } from '@/models/Booking';

const defaultSlots = [
  "09:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 01:00 PM",
  "03:00 PM - 04:00 PM", "04:00 PM - 05:00 PM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM"
];
const MAX_CAPACITY = 5;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

    await connectToDatabase();

    const bookings = await Booking.find({ date });

    const slotAvailability = defaultSlots.map(slotName => {
      const bookedCount = bookings.filter(b => b.timeSlot === slotName).length;
      return {
        timeSlot: slotName,
        booked: bookedCount,
        maxCapacity: MAX_CAPACITY,
        isFull: bookedCount >= MAX_CAPACITY
      };
    });

    return NextResponse.json({ success: true, slots: slotAvailability });
  } catch (error) {
    console.error("API Error (slots fetch):", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
