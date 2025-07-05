// index.js

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = 8000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

app.use(cors());
app.use(bodyParser.json());

const TEMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR);

app.post("/run", async (req, res) => {
  const { code, language, input = "" } = req.body;
  const id = Date.now();
  let filename, command;

  try {
    const inputFile = `${TEMP_DIR}/input-${id}.txt`;
    fs.writeFileSync(inputFile, input);

    if (language === "python") {
      filename = `${TEMP_DIR}/code-${id}.py`;
      fs.writeFileSync(filename, code);
      command = `python3 ${filename} < ${inputFile}`;
    } else if (language === "cpp") {
      filename = `${TEMP_DIR}/code-${id}.cpp`;
      const execFile = `${TEMP_DIR}/code-${id}.out`;
      fs.writeFileSync(filename, code);
      command = `g++ ${filename} -o ${execFile} && ${execFile} < ${inputFile}`;
    } else if (language === "c") {
      filename = `${TEMP_DIR}/code-${id}.c`;
      const execFile = `${TEMP_DIR}/code-${id}.out`;
      fs.writeFileSync(filename, code);
      command = `gcc ${filename} -o ${execFile} && ${execFile} < ${inputFile}`;
    } else if (language === "java") {
      const match = code.match(/public\s+class\s+(\w+)/);
      const className = match ? match[1] : `Main${id}`;
      filename = `${TEMP_DIR}/${className}.java`;
      fs.writeFileSync(filename, code);
      command = `javac ${filename} && java -cp ${TEMP_DIR} ${className} < ${inputFile}`;
    } else {
      return res.status(400).json({ error: "Unsupported language" });
    }

    exec(command, { timeout: 5000 }, async (err, stdout, stderr) => {
      const output = err ? (stderr || err.message) : stdout;

      // 🔍 AI Analysis
      let time = "N/A", space = "N/A", summary = "";
      try {
        const analysisPrompt = `Analyze this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\nRespond:\nTime: O(...)\nSpace: O(...)`;
        const analysisRes = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [{ role: "user", content: analysisPrompt }],
            temperature: 0.3,
            max_tokens: 100
          }),
        });
        const analysisText = (await analysisRes.json()).choices?.[0]?.message?.content || "";
        const timeMatch = analysisText.match(/Time:\s*O\(([^)]+)\)/i);
        const spaceMatch = analysisText.match(/Space:\s*O\(([^)]+)\)/i);
        if (timeMatch) time = `O(${timeMatch[1]})`;
        if (spaceMatch) space = `O(${spaceMatch[1]})`;

        const summaryPrompt = `Explain in 1 line the time and space complexity of the following ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``;
        const summaryRes = await fetch(GROQ_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama3-70b-8192",
            messages: [{ role: "user", content: summaryPrompt }],
            temperature: 0.3,
            max_tokens: 60
          }),
        });
        summary = (await summaryRes.json()).choices?.[0]?.message?.content || "";
      } catch (err) {
        console.error("AI Analysis Failed:", err.message);
      }

      res.json({
        output: output.trim(),
        time,
        space,
        summary: summary.trim(),
      });
    });

  } catch (err) {
    res.status(500).json({ error: "Execution failed", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
