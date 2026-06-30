export const ADMIN_COOKIE = "blender_fx_admin";

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function getAdminSessionValue() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return "";
  }

  return sha256(password);
}

export async function isValidAdminSession(value?: string) {
  const expected = await getAdminSessionValue();
  return Boolean(expected && value && expected === value);
}
