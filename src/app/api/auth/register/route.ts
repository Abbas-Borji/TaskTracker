import { NextRequest, NextResponse } from "next/server";
import signUpSchema from "./schema";
import z from "zod";
import prisma from "prisma/client";
import bcrypt from "bcrypt";
import { stat } from "fs";

interface User {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const user: User = await request.json();
    // Validate the user data
    signUpSchema.parse(user);

    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      // If a user with the same email already exists, return a response with a status code of 400 and an error message
      return new NextResponse(
        JSON.stringify({ message: "A user with this email already exists." }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Create the user in the database with the hashed password
    const createdUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });

    // Return the created user
    return new NextResponse(JSON.stringify(createdUser), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If the error is a ZodError, return a response with a status code of 400 and the error messages
      return new NextResponse(
        JSON.stringify({ body: error.errors.map((err) => err.message) }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } else {
      // If the error is not a ZodError, rethrow it
      throw error;
    }
  }
}
