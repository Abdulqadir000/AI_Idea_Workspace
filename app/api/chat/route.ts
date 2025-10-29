import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "OpenRouter API key not configured" },
        { status: 500 }
      );
    }

    const models = [
      "meta-llama/llama-3.2-3b-instruct:free",
      "google/gemma-7b-it:free",
      "mistralai/mistral-7b-instruct:free",
    ];
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "AI Idea Workspace",
    };

    async function callOpenRouter(model: string) {
      return axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        { model, messages },
        { headers }
      );
    }

    let response;
    for (let i = 0; i < models.length; i++) {
      try {
        response = await callOpenRouter(models[i]);
        break;
      } catch (err) {
        const e = err as AxiosError<any>;
        const status = e.response?.status;
        if (status === 429 || (status && status >= 500)) {
          await new Promise((r) => setTimeout(r, 1200));
          continue;
        }
        const message = e.response?.data?.error?.message || e.message;
        return NextResponse.json(
          { error: message || "OpenRouter error" },
          { status: status || 500 }
        );
      }
    }
    if (!response) {
      return NextResponse.json(
        { error: "AI temporarily rate-limited. Please try again shortly." },
        { status: 429 }
      );
    }

    const aiMessage = response.data.choices[0].message.content;
    return NextResponse.json({ message: aiMessage });
  } catch (error) {
    const e = error as AxiosError<any>;
    const status = e.response?.status || 500;
    const message =
      e.response?.data?.error?.message || e.message || "Unknown error";
    console.error("OpenRouter API error:", { status, message });
    return NextResponse.json({ error: message }, { status });
  }
}
