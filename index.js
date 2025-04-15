import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'llama3';

// In-memory cache for faster responses
const responseCache = new Map();

// Chat sessions storage
const chatSessions = new Map();

// Route to chat with AI
app.post('/api/chat', async (req, res) => {
    try {
        const { message, model = DEFAULT_MODEL, sessionId = 'default' } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        
        // Get or create chat session
        if (!chatSessions.has(sessionId)) {
            chatSessions.set(sessionId, []);
        }
        
        const session = chatSessions.get(sessionId);
        
        // Add user message to session
        session.push({ role: 'user', content: message });
        
        // Create chat context from session
        const messages = session.map(msg => ({
            role: msg.role,
            content: msg.content
        }));
        
        // Check cache for response
        const cacheKey = `${model}:${sessionId}:${message}`;
        if (responseCache.has(cacheKey)) {
            console.log('Cache hit for:', cacheKey);
            const cachedResponse = responseCache.get(cacheKey);
            return res.json(cachedResponse);
        }

        // Call Ollama API for chat completion
        const response = await fetch(`${OLLAMA_API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: false
            }),
        });
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Ollama API error:', error);
            return res.status(response.status).json({ 
                error: 'Failed to get response from Ollama API',
                details: error
            });
        }
        
        const data = await response.json();
        
        // Add assistant response to session
        session.push({ role: 'assistant', content: data.message.content });
        
        // Limit session size to prevent memory issues (last 20 messages)
        if (session.length > 20) {
            chatSessions.set(sessionId, session.slice(-20));
        }
        
        const responseData = { 
            message: data.message.content,
            model: model,
            sessionId: sessionId
        };
        
        // Cache the response
        responseCache.set(cacheKey, responseData);
        
        // Clean cache if it gets too large
        if (responseCache.size > 1000) {
            const oldestKey = responseCache.keys().next().value;
            responseCache.delete(oldestKey);
        }
        
        return res.json(responseData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route for single question (legacy support)
app.post('/api/ask', async (req, res) => {
    try {
        const { question, model = DEFAULT_MODEL } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }
        
        // Create a random session ID for single questions
        const sessionId = `single-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
        
        // Forward to chat endpoint
        req.body.message = question;
        req.body.sessionId = sessionId;
        
        return app.handle(req, res);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to clear a chat session
app.post('/api/clear-session', (req, res) => {
    const { sessionId = 'default' } = req.body;
    chatSessions.set(sessionId, []);
    res.json({ status: 'ok', message: 'Chat session cleared' });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// List available models
app.get('/api/models', async (req, res) => {
    try {
        const response = await fetch(`${OLLAMA_API_URL}/tags`);
        
        if (!response.ok) {
            const error = await response.text();
            console.error('Ollama API error:', error);
            return res.status(response.status).json({ 
                error: 'Failed to get models from Ollama API',
                details: error
            });
        }
        
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve index.html for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Using Ollama API URL: ${OLLAMA_API_URL}`);
    console.log(`Default model: ${DEFAULT_MODEL}`);
    console.log(`Open your browser at http://localhost:${PORT} to access the UI`);
}); 