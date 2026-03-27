export type LoggedUser = {
  email: string;
  password: string;
};

export const LOGGED_USER_KEY = "loggedUser";

const LOGGED_USER_COOKIE = "loggedUser";

export function hasLoggedUser(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LOGGED_USER_KEY) != null;
}

export function getLoggedUser(): LoggedUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(LOGGED_USER_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;

    const record = parsed as Record<string, unknown>;
    const email = record.email;
    const password = record.password;
    if (typeof email !== "string" || typeof password !== "string") return null;

    return { email, password };
  } catch {
    return null;
  }
}

export function setLoggedUser(user: LoggedUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(user));
  document.cookie = `${LOGGED_USER_COOKIE}=1; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function clearLoggedUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOGGED_USER_KEY);
  document.cookie = `${LOGGED_USER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
