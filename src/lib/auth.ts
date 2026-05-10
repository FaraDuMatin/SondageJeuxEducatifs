import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_auth";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

export async function isAdmin(): Promise<boolean> {
  const password = getAdminPassword();
  if (!password) {
    return false;
  }

  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === password;
}
