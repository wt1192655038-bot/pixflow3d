import crypto from "crypto";

export const ADMIN_COOKIE = "blender_fx_admin";

export function getAdminSessionValue() {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return "";
  }

  return crypto.createHash("sha256").update(password).digest("hex");
}

export function isValidAdminSession(value?: string) {
  const expected = getAdminSessionValue();

  if (!expected || !value) {
    return false;
  }

  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(valueBuffer, expectedBuffer);
}
