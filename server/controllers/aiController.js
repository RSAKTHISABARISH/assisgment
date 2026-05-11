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
  
  The questions should be very simple and suitable for absolute beginners.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content.questions || content;
  } catch (error) {
    console.warn('OpenAI Error/Quota. Using Beginner-Friendly Demo Mode.');
    
    // Topic: RAG (Beginner)
    if (topic.toLowerCase().includes('rag')) {
      return [
        {
          questionText: "What is the primary goal of RAG?",
          options: ["To make AI smarter using your own data", "To change the color of the AI", "To make AI talk faster", "To play music"],
          correctAnswer: "To make AI smarter using your own data"
        },
        {
          questionText: "Does RAG help AI stop making things up (hallucinating)?",
          options: ["Yes, it provides facts", "No, it makes it worse", "It has no effect", "Only on weekends"],
          correctAnswer: "Yes, it provides facts"
        },
        {
          questionText: "In RAG, where does the extra information come from?",
          options: ["An external database or folder", "The AI's imagination", "The keyboard", "The monitor"],
          correctAnswer: "An external database or folder"
        },
        {
          questionText: "Is RAG useful for searching through long documents?",
          options: ["Yes, very useful", "No, it's for drawing", "Only for math", "Not at all"],
          correctAnswer: "Yes, very useful"
        }
      ].concat(Array(6).fill(0).map((_, i) => ({
        questionText: `A basic concept in ${topic} part #${i+1}:`,
        options: ["Data Retrieval", "Simple Storage", "Basic Logic", "User Interface"],
        correctAnswer: "Data Retrieval"
      })));
    }

    // General Beginner Fallback
    return [
      {
        questionText: `What is ${topic} mainly used for?`,
        options: ["Solving problems", "Playing games", "Watching videos", "Listening to music"],
        correctAnswer: "Solving problems"
      },
      {
        questionText: `Is ${topic} easy for beginners to learn?`,
        options: ["Yes, with practice", "No, it's impossible", "Only for experts", "Maybe tomorrow"],
        correctAnswer: "Yes, with practice"
      },
      {
        questionText: `Where can you find help for ${topic}?`,
        options: ["Online documentation", "At the grocery store", "In a cookbook", "On the radio"],
        correctAnswer: "Online documentation"
      }
    ].concat(Array(7).fill(0).map((_, i) => ({
      questionText: `Basic ${topic} knowledge question #${i+4}:`,
      options: ["Efficiency", "Simplicity", "Accuracy", "Speed"],
      correctAnswer: "Simplicity"
    })));
  }
};
