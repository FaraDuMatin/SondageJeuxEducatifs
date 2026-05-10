"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, getAdminPassword } from "@/lib/auth";

export async function adminLoginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "").trim();
  const redirectTo = String(formData.get("redirectTo") ?? "/admin/questions");
  const expected = getAdminPassword();

  if (expected && password === expected) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, password, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  }

  redirect(redirectTo || "/admin/questions");
}

export async function adminLogoutAction(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect(redirectTo || "/");
}
