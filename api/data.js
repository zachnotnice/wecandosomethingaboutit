const { kv } = require("@vercel/kv");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const count = (await kv.scard("emails")) || 0;

    const rawIssues = (await kv.lrange("issues", 0, 49)) || [];
    const issues = rawIssues.map((item) => {
      if (typeof item === "string") return JSON.parse(item);
      return item;
    });

    return res.status(200).json({ count, issues });
  } catch (err) {
    console.error("Data error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
};
