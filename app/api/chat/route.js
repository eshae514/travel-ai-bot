import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = (userMessage) => `
You are a travel assistant AI. Your job is to assist the user with any travel-related questions, bookings, and recommendations. Make sure to be polite, informative, and helpful. Here's the user's message: "${userMessage}"

Your response should:
- Provide detailed answers to any travel-related inquiries (flights, hotels, attractions, local transport, etc.)
- Offer travel tips or suggestions when relevant
- Be concise and to the point while remaining friendly and professional
- Clarify any missing information by asking the user for more details if necessary (e.g., dates, destinations)

If the user asks for:
- Flight or hotel booking: Ask for departure/arrival dates, locations, and preferences (budget, class).
- Travel recommendations: Suggest popular destinations based on the user's preferences (city, nature, adventure, relaxation).
- Local attractions: Provide information on key landmarks, activities, or food in a given city.

Remember, you are a helpful and knowledgeable travel assistant. Always ensure the user has a smooth and pleasant experience.

User: ${userMessage}
Assistant:
`;


const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("API key is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function POST(req) {
  try {
    const data = await req.json();
    const { message: userMessage } = data;

    if (!userMessage) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const prompt = systemPrompt(userMessage);

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json(
      { error: "Error generating response" },
      { status: 500 }
    );
  }
}