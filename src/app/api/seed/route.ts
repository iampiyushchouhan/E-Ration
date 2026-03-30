import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import { Customer } from '@/models/Customer';

const dummyData = [
  {
    customerId: "12001",
    members: [
      { name: "Rahul Sharma", age: 45 },
      { name: "Priya Sharma", age: 40 },
      { name: "Amit Sharma", age: 18 }
    ]
  },
  {
    customerId: "12002",
    members: [
      { name: "Rajesh Kumar", age: 50 },
      { name: "Sunita Devi", age: 46 }
    ]
  },
  {
    customerId: "12003",
    members: [
      { name: "Anil Verma", age: 35 },
      { name: "Pooja Verma", age: 32 },
      { name: "Kavita Verma", age: 8 }
    ]
  },
  {
    customerId: "12004",
    members: [
      { name: "Suresh Singh", age: 60 },
      { name: "Ramesh Singh", age: 30 }
    ]
  },
  {
    customerId: "12005",
    members: [
      { name: "Vikram Mehta", age: 42 },
      { name: "Neha Mehta", age: 38 },
      { name: "Rahul Mehta", age: 15 },
      { name: "Riya Mehta", age: 12 }
    ]
  },
  {
    customerId: "12006",
    members: [
      { name: "Mohan Das", age: 55 },
      { name: "Geeta Das", age: 50 }
    ]
  },
  {
    customerId: "12007",
    members: [
      { name: "Karan Johar", age: 28 }, // Random mock names
      { name: "Arjun Johar", age: 25 }
    ]
  },
  {
    customerId: "12008",
    members: [
      { name: "Vijay Patil", age: 65 },
      { name: "Anita Patil", age: 60 },
      { name: "Sumit Patil", age: 35 }
    ]
  },
  {
    customerId: "12009",
    members: [
      { name: "Ajay Dev", age: 48 },
      { name: "Kajol Dev", age: 45 }
    ]
  },
  {
    customerId: "12010",
    members: [
      { name: "Deepak Chopra", age: 39 },
      { name: "Meera Chopra", age: 35 },
      { name: "Aryan Chopra", age: 10 }
    ]
  }
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Clear existing customers for a fresh seed
    await Customer.deleteMany({});
    
    // Insert dummy data
    await Customer.insertMany(dummyData);
    
    return NextResponse.json({ message: "Dummy data seeded successfully", count: dummyData.length });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed data" }, { status: 500 });
  }
}
