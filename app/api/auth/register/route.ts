/**
 * Ki Pahare DigiGuide - Registration API
 * Handles user registration
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseDb } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, adminCode } = await request.json();

    // Validate input
    if (!username || !email || !password || !adminCode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate admin registration code
    const validAdminCode = process.env.ADMIN_REGISTRATION_CODE;
    if (adminCode !== validAdminCode) {
      return NextResponse.json(
        { error: 'Invalid admin registration code' },
        { status: 403 }
      );
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await supabaseDb.getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await supabaseDb.getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user in Supabase
    const user = await supabaseDb.createUser({
      username,
      password_hash: hashedPassword,
      email,
    });

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
