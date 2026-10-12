// Slice'taki BASE_URL ile aynı adres kullanılır (route'lar /api öneki olmadan kökte: /register, /login ...)
// userSlice.js içinde `const BASE_URL` → `export const BASE_URL` yapmayı unutmayın
import { BASE_URL } from "../redux/userSlice";

const post = async (path, body) => {

  const res = await fetch(`${BASE_URL}${path}`, {

    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {

    const err = new Error(data.message || "Bir sorun oluştu, lütfen tekrar deneyin.");
    err.code = data.code;
    throw err;
  }

  return data;
};

export const registerRequest = (payload) => post("/register", payload);
export const resendVerificationRequest = (email) => post("/resend-verification", { email });
export const verifyEmailRequest = (token) => post(`/verify-email/${encodeURIComponent(token)}`);
