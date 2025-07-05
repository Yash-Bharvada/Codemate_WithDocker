# Codemate

Codemate is a fullstack AI-powered code assistant that helps you write, analyze, and understand code faster. It features AI code generation, Copilot-style ghost suggestions, complexity analysis, and a beautiful light/dark mode UI.

## Features

- ✨ **AI Code Generation**: Generate, optimize, explain, and test code with natural language prompts.
- 👻 **Ghost Suggestions**: Inline Copilot-style code completions as you type (ghost text).
- 📊 **Complexity Analysis**: Visualize time and space complexity with clear explanations and graphs.
- 🌗 **Light & Dark Mode**: Modern, theme-aware UI for any environment.
- 🖥️ **Multi-language Support**: Python, Java, C++ (easily extendable).
- 🧑‍💻 **Beautiful Monaco Editor**: Syntax highlighting, inline suggestions, and more.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Monaco Editor
- **Backend**: Node.js, Express
- **AI Model**: Groq Llama3 (can be swapped for OpenAI, Gemini, etc.)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Bun (for frontend, optional)
- A Groq API key (or your preferred LLM provider)

### Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/codemate.git
   cd codemate-proto
   ```
2. **Install dependencies:**
   - Frontend:
     ```bash
     cd fe
     npm install # or bun install
     ```
   - Backend:
     ```bash
     cd ../server
     npm install
     ```
3. **Configure environment:**
   - Copy `.env.example` to `.env` in the `server/` directory and add your `GROQ_API_KEY`.

4. **Run the app:**
   - Start backend:
     ```bash
     cd server
     npm start
     ```
   - Start frontend:
     ```bash
     cd ../fe
     npm run dev # or bun dev
     ```

5. **Open in browser:**
   - Visit [http://localhost:8080](http://localhost:8080)

## Usage
- Write or paste code in the Monaco editor.
- Use the AI sidebar to generate, optimize, explain, test, or analyze code.
- Enjoy ghost suggestions as you type.
- Toggle between light and dark mode using the header button.

## Contributing

Contributions are welcome! To get started:
1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

Please open issues for bugs, feature requests, or questions.

## License

MIT 
