// --- Counter animation ---
function animateCounter(target) {
  const el = document.getElementById("counter");
  const current = parseInt(el.textContent.replace(/,/g, "")) || 0;
  const duration = 800;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(current + (target - current) * eased).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

// --- Render issues ---
function renderIssues(issues) {
  const section = document.getElementById("issues-section");
  const list = document.getElementById("issues-list");

  if (!issues || issues.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  list.innerHTML = "";

  issues.forEach((issue) => {
    const card = document.createElement("div");
    card.className = "issue-card";
    card.textContent = issue.text;
    list.appendChild(card);
  });
}

// --- Load initial data ---
async function loadData() {
  try {
    const res = await fetch("/api/data");
    const data = await res.json();
    animateCounter(data.count);
    renderIssues(data.issues);
  } catch (err) {
    console.error("Failed to load data:", err);
  }
}

// --- Character counter ---
const issueInput = document.getElementById("issue");
const charCount = document.getElementById("char-count");

issueInput.addEventListener("input", () => {
  charCount.textContent = issueInput.value.length;
});

// --- Form submit ---
const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const issue = issueInput.value.trim();
  const submitBtn = form.querySelector(".btn-submit");

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, issue }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Something went wrong. Please try again.");
      submitBtn.disabled = false;
      submitBtn.textContent = "I'm In";
      return;
    }

    // Hide form, show success
    form.classList.add("hidden");
    document.getElementById("success-message").classList.remove("hidden");

    // Update counter
    animateCounter(result.count);

    // Reload issues
    const dataRes = await fetch("/api/data");
    const data = await dataRes.json();
    renderIssues(data.issues);
  } catch (err) {
    alert("Network error. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "I'm In";
  }
});

// --- Init ---
loadData();
