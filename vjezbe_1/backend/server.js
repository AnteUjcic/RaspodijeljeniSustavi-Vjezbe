const path = require("path");
const express = require("express");
const cors = require("cors");
const { malts, quiz } = require("./data");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

app.use(cors());
app.use(express.json());

// Health check (Render can use this as the health check path)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// GET /api/malts?category=base|specialty|roasted
app.get("/api/malts", (req, res) => {
  const { category } = req.query;
  const list = category && category !== "all"
    ? malts.filter((m) => m.category === category)
    : malts;
  res.json(list);
});

app.get("/api/malts/:id", (req, res) => {
  const malt = malts.find((m) => m.id === Number(req.params.id));
  if (!malt) return res.status(404).json({ error: "Malt not found" });
  res.json(malt);
});

// Questions are sent without the correct answer
app.get("/api/quiz", (req, res) => {
  res.json(quiz.map(({ answer, ...question }) => question));
});

// POST /api/quiz/:id/answer  body: { "choice": <option index> }
app.post("/api/quiz/:id/answer", (req, res) => {
  const question = quiz.find((q) => q.id === Number(req.params.id));
  if (!question) return res.status(404).json({ error: "Question not found" });

  const { choice } = req.body;
  if (!Number.isInteger(choice) || choice < 0 || choice >= question.options.length) {
    return res.status(400).json({ error: "choice must be a valid option index" });
  }

  res.json({ correct: choice === question.answer, answer: question.answer });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Serve the Vue frontend from the same service
app.use(express.static(FRONTEND_DIR));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
