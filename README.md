# AI Chatbot

A modern Node.js application that uses the Ollama API to create an advanced AI chatbot with a beautiful UI.

## Prerequisites

- Node.js (v14 or later)
- npm
- Ollama installed and running locally (or accessible via network)

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure the .env file (optional, defaults are provided):
   ```
   PORT=3000
   OLLAMA_API_URL=http://localhost:11434/api
   DEFAULT_MODEL=llama3
   ```

## Running the Server

```
npm start
```

The server will start on the port specified in the .env file (default: 3000).

## Features

- Modern, responsive UI
- Real-time chat interface
- Markdown support (code blocks, links, etc.)
- Typing indicators
- Auto-resizing input field
- Keyboard shortcuts
- Clear chat functionality
- Model selection
- Message caching
- Session management for context-aware conversations

## API Endpoints

### 1. Chat

**Endpoint:** `POST /api/chat`

**Request Body:**
```json
{
  "message": "Your message here",
  "model": "llama3",  // Optional, defaults to DEFAULT_MODEL in .env
  "sessionId": "default"  // Optional, for maintaining chat context
}
```

**Response:**
```json
{
  "message": "The AI's response",
  "model": "llama3",
  "sessionId": "default"
}
```

### 2. Clear Chat Session

**Endpoint:** `POST /api/clear-session`

**Request Body:**
```json
{
  "sessionId": "default"  // Optional, defaults to "default"
}
```

**Response:**
```json
{
  "status": "ok",
  "message": "Chat session cleared"
}
```

### 3. List Available Models

**Endpoint:** `GET /api/models`

**Response:**
```json
{
  "models": [
    {
      "name": "llama3",
      "modified_at": "2023-06-01T12:00:00Z"
    },
    // ...more models
  ]
}
```

### 4. Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok"
}
```

## Example Usage with curl

### Start a chat:
```
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

### Clear chat session:
```
curl -X POST http://localhost:3000/api/clear-session
```

### List available models:
```
curl http://localhost:3000/api/models
```

## Notes

- This application requires Ollama to be running locally or accessible via network
- Default model is set to llama3, but can be changed in the .env file or specified in the request
- Make sure you have the appropriate models downloaded in Ollama
- The UI supports markdown formatting for code blocks, links, and other formatting 