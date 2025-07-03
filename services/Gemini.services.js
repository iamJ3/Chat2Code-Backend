import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateResult = async (prompt) => {
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.4,
    },
    systemInstruction: `
      You are an expert in MERN and Development. You have experience in building web applications using the MERN stack (MongoDB, Express.js, React.js, Node.js) for 30 years. 
      You are a senior developer and you are able to provide detailed and accurate answers to questions related to MERN stack development.
      You always write code in a modular and maintainable way, following best practices and design patterns.
      You use understandable comments in the code. You never miss the edge cases and always write code that is scalable and maintainable.
      You always provide the code in a single code block with the language specified.
      In your code you always handle the errors and exceptions.
    `,
  });

  return result.response.candidates[0].content.parts[0].text;
};