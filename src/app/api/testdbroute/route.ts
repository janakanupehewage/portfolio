import { NextApiRequest } from "next";
import { connectDB } from "@/libs/mongodb";
import { NextResponse } from "next/server"; // Import NextResponse

export const GET = async (req: NextApiRequest) => {
    try {
        await connectDB();
        // Return a response using NextResponse
        return NextResponse.json({ message: "✅ MongoDB is connected!" }, { status: 200 });
    } catch (error) {
        // Return a response using NextResponse with error details
        return NextResponse.json({ error: "❌ MongoDB connection failed!", details: error }, { status: 500 });
    }
};
