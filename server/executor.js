const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const TEMP_DIR = path.join(__dirname, "temp");

function getPublicClassName(code) {
  const match = code.match(/public\s+class\s+(\w+)/);
  return match ? match[1] : null;
}

function runDockerCode(code, lang, callback) {
  let filename = "";
  const folder = path.join(TEMP_DIR, lang);
  fs.mkdirSync(folder, { recursive: true });

  if (lang === "java") {
    const className = getPublicClassName(code);
    if (!className) return callback("❌ Java code must contain a `public class`.");
    filename = `${className}.java`;
  } else if (lang === "cpp") {
    filename = "main.cpp";
  } else if (lang === "c") {
    filename = "main.c";
  } else if (lang === "python") {
    filename = "main.py";
  } else {
    return callback("❌ Unsupported language.");
  }

  const filePath = path.join(folder, filename);
  fs.writeFileSync(filePath, code);

  const imageMap = {
    java: "java-runner",
    cpp: "cpp-runner",
    c: "c-runner",
    python: "python-runner",
  };

  const dockerCommand =
    lang === "java"
      ? `docker run --rm -v ${folder}:/app -e JAVA_FILE=${filename} ${imageMap[lang]}`
      : `docker run --rm -v ${folder}:/app ${imageMap[lang]}`;

  exec(dockerCommand, { timeout: 10000 }, (err, stdout, stderr) => {
    if (err) return callback(stderr || err.message);
    callback(null, stdout);
  });
}

module.exports = { runDockerCode };
