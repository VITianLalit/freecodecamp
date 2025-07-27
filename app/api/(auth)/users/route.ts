import connectDB from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

const ObjectId = require('mongoose').Types.ObjectId;

export const GET = async () => {
    try {
        connectDB();
        const users = await User.find();
        return new NextResponse(JSON.stringify(users), { status: 200 });
    } catch (error: any) {
        return new NextResponse("Failed to fetch users: " + error.message, { status: 500 });
    }
}

export const POST = async (request: Request) => {
    try {
        const body = await request.json();
        await connectDB();
        const newUser = new User(body);
        await newUser.save();
        return new NextResponse(JSON.stringify({ message: "User created successfully", user: newUser }), { status: 201 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to create user: " + error.message }), { status: 500 });
    }
}

export const PATCH = async (request: Request) => {
    try {
        const body = await request.json();
        const { userId, newUsername } = body;
        await connectDB();

        if (!userId || !newUsername) {
            return new NextResponse(JSON.stringify({ message: "User ID and new username are required" }), { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: new ObjectId(userId) },
            { username: newUsername },
            { new: true }
        );

        if (!updatedUser) {
            return new NextResponse(JSON.stringify({ message: "User not found in the database" }), { status: 400 });
        }

        return new NextResponse(JSON.stringify({ message: "User updated successfully", user: updatedUser }), { status: 200 });

    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to update user: " + error.message }), { status: 500 });
    }
}

export const DELETE = async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
    
        if (!userId) {
            return new NextResponse(JSON.stringify({ message: "User ID not found" }), { status: 400 });
        }

        if (!Types.ObjectId.isValid(userId)) {
            return new NextResponse(JSON.stringify({ message: "Invalid user ID" }), { status: 400 });
        }

        await connectDB();
        const deleteUser = await User.findByIdAndDelete(
            new Types.ObjectId(userId)
        );

        if (!deleteUser) {
            return new NextResponse(JSON.stringify({ message: "User not found", user: deleteUser }), { status: 404 });
        }

        return new NextResponse(JSON.stringify({ message: "User deleted successfully" }), { status: 200 });
    } catch (error: any) {
        return new NextResponse(JSON.stringify({ error: "Failed to update user: " + error.message }), { status: 500 });
    }
}