import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const count = await kv.scard("emails") || 0;

  // Get the 50 most recent issues
  const rawIssues = await kv.lrange("issues", 0, 49) || [];
  const issues = rawIssues.map((item) => {
    if (typeof item === "string") return JSON.parse(item);
    return item;
  });

  return res.status(200).json({ count, issues });
}
