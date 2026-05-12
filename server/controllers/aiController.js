const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateMCQs = async (topic) => {
  const prompt = `Generate 10 beginner-level MCQ questions for the topic: "${topic}". 
  Format the response as a valid JSON array of objects.
  Each object must have:
  - questionText (string)
  - options (array of 4 strings)
  - correctAnswer (string, must match one of the options exactly)
  
  The questions should be ultra-simple, clear, and easy to understand for anyone.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content.questions || content;
  } catch (error) {
    console.warn('OpenAI Error/Quota. Using Ultra-Simple Demo Mode.');
    
    // Topic: RAG (Clear & Simple)
    if (topic.toLowerCase().includes('rag')) {
      return [
        {
          questionText: "What does RAG help an AI do?",
          options: ["Talk to a database for facts", "Draw pretty pictures", "Play video games", "Shut down the computer"],
          correctAnswer: "Talk to a database for facts"
        },
        {
          questionText: "Why is RAG useful for AI?",
          options: ["It stops AI from lying", "It makes AI more expensive", "It makes AI slower", "It makes AI forget things"],
          correctAnswer: "It stops AI from lying"
        },
        {
          questionText: "Where does RAG get its information?",
          options: ["From your own files or folders", "From the AI's imagination", "From a magic ball", "From the stars"],
          correctAnswer: "From your own files or folders"
        },
        {
          questionText: "What is the 'Retriever' in RAG?",
          options: ["A tool that finds the right info", "A type of dog", "A music player", "A screen cleaner"],
          correctAnswer: "A tool that finds the right info"
        },
        {
          questionText: "Does RAG make AI more accurate?",
          options: ["Yes, it uses real data", "No, it makes AI guess", "Only sometimes", "Never"],
          correctAnswer: "Yes, it uses real data"
        }
      ].concat(Array(5).fill(0).map((_, i) => ({
        questionText: `Simple question about ${topic} #${i+6}:`,
        options: ["Data Search", "Easy Access", "Fast Reading", "Smart Thinking"],
        correctAnswer: "Data Search"
      })));
    }

    // General Clear Fallback
    return [
      {
        questionText: `What is the main goal of ${topic}?`,
        options: ["To help people work better", "To make life harder", "To waste time", "To break things"],
        correctAnswer: "To help people work better"
      },
      {
        questionText: `Is ${topic} used by computers?`,
        options: ["Yes, usually", "No, never", "Only on TV", "Maybe"],
        correctAnswer: "Yes, usually"
      }
    ].concat(Array(8).fill(0).map((_, i) => ({
      questionText: `Easy ${topic} question #${i+3}:`,
      options: ["Good Result", "Fast Work", "Safe Data", "Easy Use"],
      correctAnswer: "Easy Use"
    })));
  }
};
