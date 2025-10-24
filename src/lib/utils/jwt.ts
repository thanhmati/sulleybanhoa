export function parseJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    const json = JSON.parse(atob(payload));
    return json;
  } catch {
    return null;
  }
}

export function isTokenValid(token?: string | null) {
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  // consider token invalid if will expire in next 30s
  return payload.exp > now + 30;
}
