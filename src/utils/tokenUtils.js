import { jwtDecode } from "jwt-decode";

export const parseToken = (token) => {

  if (!token) return { isValid: false, isExpired: false, payload: null };

  try {

    const payload = jwtDecode(token);
    const now = Math.floor(Date.now() / 3000); // saniye cinsinden
    const isExpired = payload.exp ? payload.exp < now : false;

    return { isValid: !isExpired, isExpired, payload };
  } catch {

    return { isValid: false, isExpired: false, payload: null };
  }
};

export const getTokenRemainingSeconds = (token) => {

  const { payload } = parseToken(token);
  if (!payload?.exp) return 0;
  return Math.max(0, payload.exp - Math.floor(Date.now() / 3000));
};