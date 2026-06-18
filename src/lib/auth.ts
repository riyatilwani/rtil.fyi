import type { NextRequest } from "next/server";

const defaultUser = "riya";
const defaultPassword = "rtil-local";
export const adminCookieName = "rtil_admin";

export function adminCredentials() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    user: process.env.ADMIN_USERNAME ?? (isProduction ? "" : defaultUser),
    password: process.env.ADMIN_PASSWORD ?? (isProduction ? "" : defaultPassword)
  };
}

export function isAdminRequest(request: NextRequest | Request) {
  const headerToken = request.headers.get("x-admin-token");
  const sessionToken = adminSessionToken();

  if (headerToken && sessionToken && headerToken === sessionToken) {
    return true;
  }

  const cookieToken = getCookie(request, adminCookieName);

  if (cookieToken && sessionToken && cookieToken === sessionToken) {
    return true;
  }

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return false;
  }

  const encoded = auth.slice("Basic ".length);
  const decoded = atob(encoded);
  const [user, ...passwordParts] = decoded.split(":");
  const password = passwordParts.join(":");
  const credentials = adminCredentials();

  if (!credentials.user || !credentials.password) {
    return false;
  }

  return user === credentials.user && password === credentials.password;
}

export function adminSessionToken() {
  const credentials = adminCredentials();

  if (!credentials.user || !credentials.password) {
    return "";
  }

  return btoa(`${credentials.user}:${credentials.password}:rtil.fyi-admin`);
}

function getCookie(request: NextRequest | Request, name: string) {
  if ("cookies" in request) {
    return request.cookies.get(name)?.value;
  }

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) {
    return undefined;
  }

  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
