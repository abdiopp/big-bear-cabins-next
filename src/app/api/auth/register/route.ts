import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  BCRYPT_SALT_ROUNDS,
  isValidEmail,
  isStrongPassword,
  isValidName,
  sanitizeInput,
  getSafeErrorMessage,
} from "@/lib/auth-utils";

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { email, name, password } = body;

    // Validate required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "Email, name, and password are required",
        },
        { status: 400 },
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedName = sanitizeInput(name);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        {
          error: "Invalid email format",
          details: "Please provide a valid email address",
        },
        { status: 400 },
      );
    }

    // Validate name
    const nameValidation = isValidName(sanitizedName);
    if (!nameValidation.valid) {
      return NextResponse.json(
        {
          error: "Invalid name",
          details: nameValidation.message,
        },
        { status: 400 },
      );
    }

    // Validate password strength
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: "Weak password",
          details: passwordValidation.message,
        },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "User already exists",
          details: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        name: sanitizedName,
        password: hashedPassword,
        role: "user", // Default role
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        // Don't return password
      },
    });

    console.log("✅ User registered successfully:", newUser.email);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("❌ Registration error:", error);

    // Handle Prisma errors
    if (error instanceof Error) {
      // Prisma unique constraint violation
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json(
          {
            error: "User already exists",
            details: "An account with this email already exists",
          },
          { status: 409 },
        );
      }
    }

    // Generic error response (don't expose internal details)
    return NextResponse.json(
      {
        error: "Registration failed",
        details: getSafeErrorMessage(error),
      },
      { status: 500 },
    );
  }
}
