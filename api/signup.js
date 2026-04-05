const { kv } = require("@vercel/kv");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, issue } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const alreadyExists = await kv.sismember("emails", email.toLowerCase());
    if (alreadyExists) {
      return res.status(409).json({ error: "This email has already been registered." });
    }

    await kv.sadd("emails", email.toLowerCase());

    if (issue && typeof issue === "string" && issue.trim().length > 0) {
      const trimmed = issue.trim().slice(0, 150);
      await kv.lpush("issues", JSON.stringify({ text: trimmed, date: new Date().toISOString() }));
    }

    const count = await kv.scard("emails");
    return res.status(200).json({ success: true, count });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
};
