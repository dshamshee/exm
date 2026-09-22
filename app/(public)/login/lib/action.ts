"use server";

import { cookies } from "next/headers";

export async function loginAction(username: string, password: string) {
  try {
    if (!username?.trim() || !password?.trim()) {
      return { success: false as const, message: "Username and password are required" };
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (username !== adminUsername || password !== adminPassword) {
      return { success: false as const, message: "Invalid username or password" };
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true as const, data: null };
  } catch (error) {
    console.error("loginAction error", error);
    return { success: false as const, message: "Login failed. Please try again." };
  }
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true as const, data: null };
  } catch (error) {
    console.error("logoutAction error", error);
    return { success: false as const, message: "Logout failed" };
  }
}
