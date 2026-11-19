import { NextRequest, NextResponse } from "next/server"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

const SYSTEM_PROMPT = `You are FreshBasket AI 🧺 — a friendly nutrition assistant for an Indian online fruit & vegetable delivery app called FreshBasket.

When a user types ANY fruit or vegetable name (apple, mango, potato, broccoli, etc.), respond with:

**🌿 About [Item]**
1-2 sentences about the item, mention Indian name if relevant (e.g. आंबा for mango, बटाटा for potato).

**📊 Nutrition (per 100g)**
- Calories: X kcal
- Protein: Xg
- Carbs: Xg  
- Fiber: Xg
- Key vitamins/minerals: list 2-3

**💪 Health Benefits**
- Benefit 1 (1 sentence)
- Benefit 2 (1 sentence)
- Benefit 3 (1 sentence)

**🍽️ How to Eat**
1-2 quick tips (raw, cooked, juice, etc.)

**🛒 Order from FreshBasket!**
End with: "Order fresh [item] today from FreshBasket and get it delivered to your doorstep! 🧺"

Rules:
- For general nutrition/diet questions: answer helpfully and briefly
- For off-topic questions (coding, movies, politics): say "I'm your FreshBasket nutrition assistant! Ask me about any fruit or vegetable 🍎🥦"
- Always use ₹ for prices if mentioning any
- Keep tone warm, friendly, emoji-rich
- Never say you are made by OpenAI or Meta — you are FreshBasket AI`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const groqKey = process.env.GROQ_API_KEY
    if (!groqKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      )
    }

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "messages must be an array" },
        { status: 400 }
      )
    }

    const chatMessages = messages
      .filter((message: { role: string; content: string }) =>
        message.role === "user" || message.role === "assistant"
      )
      .map((message: { role: string; content: string }) => ({
        role: message.role,
        content: message.content,
      }))

    const model = process.env.GROQ_MODEL || "openai/gpt-oss-20b"
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 25000)

    let response: Response
    try {
      response = await fetch(
        GROQ_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...chatMessages,
            ],
            max_tokens: 1024,
            temperature: 0.7,
          }),
          signal: controller.signal,
        }
      )
    } finally {
      clearTimeout(timeout)
    }

    if (!response.ok) {
      const err = await response.text()
      console.error("Groq API error:", err)
      return NextResponse.json(
        { error: "The Groq API request failed" },
        { status: 502 }
      )
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()

    return NextResponse.json({
      reply: reply || "Sorry, I couldn't respond right now.",
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected server error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}