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
        { error: "GROQ_API_KEY not set in .env.local" },
        { status: 500 }
      )
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: err }, { status: response.status })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't respond right now."

    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}