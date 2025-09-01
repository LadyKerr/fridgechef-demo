// Simple test to verify OpenAI API key
const apiKey = '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';

async function testAPI() {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test. Please respond with "API working"'
          }
        ],
        max_tokens: 10
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return;
    }

    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('Network error:', error);
  }
}

testAPI();
