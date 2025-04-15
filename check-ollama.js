import fetch from 'node-fetch';

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';

async function checkOllamaStatus() {
    try {
        console.log('Checking if Ollama is running...');
        const response = await fetch(`${OLLAMA_API_URL}/tags`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Ollama is running!');
            console.log('Available models:');
            
            if (data.models && data.models.length > 0) {
                data.models.forEach(model => {
                    console.log(`- ${model.name}`);
                });
            } else {
                console.log('No models found. You may need to pull a model.');
                console.log('Try running: ollama pull llama3');
            }
        } else {
            console.error('❌ Ollama API responded with an error:');
            console.error(`Status: ${response.status}`);
            const errorText = await response.text();
            console.error(errorText);
        }
    } catch (error) {
        console.error('❌ Failed to connect to Ollama:');
        console.error(error.message);
        console.log('\nMake sure Ollama is installed and running:');
        console.log('1. Install Ollama: https://ollama.com/download');
        console.log('2. Start Ollama service');
        console.log('3. Pull a model: ollama pull llama3');
    }
}

checkOllamaStatus(); 