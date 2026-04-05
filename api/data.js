const { getRedis } = require("./_redis");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const redis = getRedis();

    const count = (await redis.scard("emails")) || 0;

    const rawIssues = (await redis.lrange("issues", 0, 49)) || [];
    const issues = rawIssues.map((item) => JSON.parse(item));

    return res.status(200).json({ count, issues });
  } catch (err) {
    console.error("Data error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
};
