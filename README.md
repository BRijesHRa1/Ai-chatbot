# AI Chatbot

A Node.js chat application that uses Ollama API. Built for learning purposes.

## Requirements

- Node.js (v14+)
- npm
- Ollama (local or network)

## Setup

1. Clone repo
2. Install stuff:
   ```
   npm install
   ```
3. Edit .env if needed:
   ```
   PORT=3000
   OLLAMA_API_URL=http://localhost:11434/api
   DEFAULT_MODEL=llama3
   ```

## Run

```
npm start
```

## What it does

- Chat interface
- Works with Ollama models
- Shows typing animation
- Auto-resizes input
- Supports markdown
- Remembers chat history
- Can clear chat

## API Stuff

### Chat
```
POST /api/chat
{
  "message": "hi",
  "model": "llama3"  // optional
}
```

### Clear Chat
```
POST /api/clear-session
```

### Get Models
```
GET /api/models
```

### Check if alive
```
GET /health
```

## Try it

```bash
# Start chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hello"}'

# Clear chat
curl -X POST http://localhost:3000/api/clear-session

# See models
curl http://localhost:3000/api/models
```

## Notes

- Need Ollama running
- Default model is llama3
- Pull models in Ollama first
- Markdown works in chat 