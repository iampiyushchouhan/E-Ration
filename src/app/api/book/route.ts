import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { Booking } from '@/models/Booking';
import crypto from 'crypto';

const MAX_CAPACITY = 5;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, memberName, date, timeSlot } = body;

    if (!customerId || !memberName || !date || !timeSlot) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await connectToDatabase();

    // 1. Enforce 1 slot per ID per date
    const existing = await Booking.findOne({ customerId, date });
    if (existing) {
      return NextResponse.json({ error: "This Customer ID has already booked a slot for the selected date." }, { status: 400 });
    }

    // 2. Check capacity
    const slotCount = await Booking.countDocuments({ date, timeSlot });
    if (slotCount >= MAX_CAPACITY) {
      return NextResponse.json({ error: "Selected time slot is full." }, { status: 400 });
    }

    // 3. Generate references
    // Simple 6 char hex + random letters to match the example 'RJ58001' style loosely
    const randNum = Math.floor(10000 + Math.random() * 90000);
    const referenceNumber = `RJ${randNum}`;
    
    // Create a deterministic but unique QR token
    const qrToken = crypto.createHash('sha256').update(`${customerId}-${date}-${referenceNumber}`).digest('hex');

    // 4. Save to DB
    const newBooking = new Booking({
      customerId,
      memberName,
      date,
      timeSlot,
      referenceNumber,
      qrToken
    });

    await newBooking.save();

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "This Customer ID has already booked a slot for the selected date." }, { status: 400 });
    }
    console.error("API Error (booking):", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
