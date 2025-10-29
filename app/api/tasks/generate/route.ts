import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import axios, { AxiosError } from "axios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ideaId, description } = body;

    if (!ideaId || !description) {
      return NextResponse.json(
        { error: "ideaId and description are required" },
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
        {
          model,
          messages: [
            {
              role: "system",
              content:
                'You are a helpful project management assistant. Generate a structured task breakdown for the given project idea. Return ONLY a valid JSON array of tasks with this exact format: [{"title": "Task Title", "description": "Task Description", "priority": "high|medium|low"}]. Do not include any markdown, code blocks, or additional text.',
            },
            {
              role: "user",
              content: `Generate 5-7 detailed tasks for this project: ${description}`,
            },
          ],
        },
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
          // simple backoff then try next/fallback model
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        // non-retryable
        const message = e.response?.data?.error?.message || e.message;
        return NextResponse.json(
          { error: message || "OpenRouter error" },
          { status: status || 500 }
        );
      }
    }
    if (!response) {
      return NextResponse.json(
        {
          error:
            "All free models rate-limited or unavailable. Please try again in a minute.",
        },
        { status: 429 }
      );
    }

    let tasksData: any;
    try {
      const aiResponse: string =
        response.data?.choices?.[0]?.message?.content?.trim() ?? "";

      let cleaned = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .replace(/^[\s\S]*?\[/, "[")
        .replace(/\][\s\S]*$/, "]");

      tasksData = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError);
      console.error(
        "Raw AI response:",
        response.data?.choices?.[0]?.message?.content
      );
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    // Validate & normalize tasks
    if (!Array.isArray(tasksData)) {
      return NextResponse.json(
        { error: "AI response was not a list of tasks" },
        { status: 502 }
      );
    }

    const normalized = tasksData
      .filter((t: any) => t && (t.title || t.description))
      .slice(0, 10) // cap
      .map((t: any, idx: number) => {
        const title = (t.title ?? "").toString().trim();
        const description = (t.description ?? "").toString().trim();
        const priorityRaw = (t.priority ?? "medium").toString().toLowerCase();
        const priority = ["high", "medium", "low"].includes(priorityRaw)
          ? priorityRaw
          : "medium";
        return {
          title: title || `Task ${idx + 1}`,
          description: description || "No description provided.",
          priority,
        };
      });

    if (normalized.length === 0) {
      return NextResponse.json(
        { error: "AI did not return any usable tasks. Please try again." },
        { status: 502 }
      );
    }

    const tasks = await Promise.all(
      normalized.map((task) =>
        prisma.task.create({
          data: {
            ideaId,
            title: task.title,
            description: task.description,
            priority: task.priority,
          },
        })
      )
    );

    return NextResponse.json(tasks, { status: 201 });
  } catch (error) {
    console.error("Error generating tasks:", error);
    return NextResponse.json(
      { error: "Failed to generate tasks" },
      { status: 500 }
    );
  }
}
