// 纯密码哈希函数，无服务端依赖，可被客户端和服务端共同引用
const encoder = new TextEncoder();

export async function hashPassword(password: string): Promise<string> {
  const salt = "lumora-static-salt";
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(
  password: string,
  hashed: string
): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hashed;
}
