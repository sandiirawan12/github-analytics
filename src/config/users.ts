import { readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";

export async function loadUsers(
  cwd = process.cwd(),
  fallbackOwner?: string,
): Promise<string[]> {
  const users = new Set<string>();

  try {
    const raw = await readFile(path.join(cwd, "users.yml"), "utf8");
    const parsed = parseYaml(raw) as { users?: unknown };
    if (Array.isArray(parsed.users)) {
      for (const item of parsed.users) {
        const login = String(item ?? "")
          .trim()
          .replace(/^@/, "");
        if (login) users.add(login.toLowerCase());
      }
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== "ENOENT") throw error;
  }

  const fromEnv = process.env.GITHUB_USERNAME?.trim().replace(/^@/, "");
  if (fromEnv) users.add(fromEnv.toLowerCase());

  const owner = (fallbackOwner || process.env.GITHUB_REPOSITORY_OWNER || "").trim().replace(/^@/, "");
  if (owner) users.add(owner.toLowerCase());

  if (users.size === 0) {
    throw new Error(
      "No users to generate. Add logins to users.yml or set GITHUB_USERNAME / GITHUB_REPOSITORY_OWNER.",
    );
  }

  return [...users].sort((a, b) => a.localeCompare(b));
}
