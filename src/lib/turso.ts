import { createClient, type Client } from "@libsql/client";

let cachedClient: Client | null = null;

function resolveDatabaseUrl(): string {
  return (
    process.env.TURSO_DATABASE_URL ||
    process.env.VITE_TURSO_URL ||
    ""
  );
}

function resolveAuthToken(): string {
  return (
    process.env.TURSO_AUTH_TOKEN ||
    process.env.VITE_TURSO_TOKEN ||
    ""
  );
}

export function getTursoClient(): Client {
  if (cachedClient) {
    return cachedClient;
  }

  const url = resolveDatabaseUrl();
  if (!url) {
    throw new Error(
      "Missing Turso database URL. Set TURSO_DATABASE_URL or VITE_TURSO_URL."
    );
  }

  const authToken = resolveAuthToken();
  const config: { url: string; authToken?: string } = { url };
  if (authToken) {
    config.authToken = authToken;
  }

  cachedClient = createClient(config);
  return cachedClient;
}

export async function ensureSchema(): Promise<void> {
  const db = getTursoClient();

  await db.execute("PRAGMA foreign_keys = ON");
  await db.execute(
    "CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY, type TEXT NOT NULL, prompt TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')))"
  );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS question_options (id TEXT PRIMARY KEY, question_id TEXT NOT NULL, label TEXT NOT NULL, value TEXT NOT NULL, is_other INTEGER NOT NULL DEFAULT 0, position INTEGER NOT NULL, FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE)"
  );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS answers (id TEXT PRIMARY KEY, question_id TEXT NOT NULL, answer_text TEXT, answer_option TEXT, created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')), FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE)"
  );
}
