import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const syncedChatsDir = path.join(process.cwd(), "synced-chats");
    const chats: any[] = [];

    if (fs.existsSync(syncedChatsDir)) {
      const files = fs.readdirSync(syncedChatsDir);

      for (const file of files) {
        if (file.endsWith(".jsonl")) {
          const filePath = path.join(syncedChatsDir, file);
          const content = fs.readFileSync(filePath, "utf8");
          const lines = content
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          const messages: any[] = [];
          let userQueryCount = 0;
          let firstUserPrompt = "";

          for (const line of lines) {
            try {
              const item = JSON.parse(line);
              if (item.type === "USER_INPUT") {
                userQueryCount++;
                const text = item.content
                  .replace(/<USER_REQUEST>/g, "")
                  .replace(/<\/USER_REQUEST>/g, "")
                  .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, "")
                  .trim();
                if (!firstUserPrompt && text) {
                  firstUserPrompt = text.slice(0, 70);
                }
                messages.push({
                  role: "user",
                  timestamp: item.created_at
                    ? new Date(item.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "17:09",
                  content: text,
                });
              } else if (
                item.type === "PLANNER_RESPONSE" ||
                item.type === "RUN_COMMAND" ||
                item.type === "GENERIC"
              ) {
                if (item.content && typeof item.content === "string") {
                  const thoughtMatch = item.content.match(
                    /<thought>([\s\S]*?)<\/thought>/
                  );
                  const cleanContent = item.content
                    .replace(/<thought>[\s\S]*?<\/thought>/g, "")
                    .trim();

                  if (cleanContent || item.tool_calls) {
                    messages.push({
                      role: "assistant",
                      timestamp: item.created_at
                        ? new Date(item.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "17:10",
                      content: cleanContent || "Executed task operations and tools.",
                      thought: thoughtMatch ? thoughtMatch[1].trim() : undefined,
                      toolCalls: item.tool_calls
                        ? item.tool_calls.map((tc: any) => ({
                            tool: tc.name,
                            summary: tc.args?.toolSummary || tc.args?.toolAction || tc.name,
                          }))
                        : undefined,
                    });
                  }
                }
              }
            } catch (e) {
              // skip malformed line
            }
          }

          const stat = fs.statSync(filePath);
          const isPhoneSession = file.includes("session-e1528e1e");

          const provenance = {
            source: "live" as const,
            fetched_at: new Date().toISOString(),
            stale_after: new Date(Date.now() + 60000).toISOString(),
            pipeline_engine: "Antigravity-JSONL-Transcript-Parser-v1",
            raw_source_ref: file,
          };

          chats.push({
            id: file.replace(".jsonl", ""),
            title: isPhoneSession
              ? "Samsung Galaxy S21+ ADB Mirror & Control"
              : firstUserPrompt
              ? firstUserPrompt + (firstUserPrompt.length >= 70 ? "..." : "")
              : "Antigravity Active Development Session",
            category: isPhoneSession ? "coding" : "coding",
            modelUsed: isPhoneSession ? "Gemini 3 Flash Thinking" : "Gemini 3.8 Flash (High)",
            deviceId: isPhoneSession ? "dev-s21-03" : "dev-win-01",
            deviceName: isPhoneSession
              ? "Samsung Galaxy S21+ 5G"
              : "Windows Studio Workstation",
            createdAt: stat.birthtime.toISOString().slice(0, 16).replace("T", " "),
            updatedAt: stat.mtime.toISOString().slice(0, 16).replace("T", " "),
            totalTurns: messages.length,
            totalTokens: Math.floor(stat.size * 1.8),
            previewMessage:
              messages[messages.length - 1]?.content?.slice(0, 120) ||
              "Session synchronized from local transcript files.",
            isSyncedToR2: true,
            messages: messages.slice(-15), // keep last 15 for snappiness
            provenance,
          });
        }
      }
    }

    const globalProvenance = {
      source: "live" as const,
      fetched_at: new Date().toISOString(),
      stale_after: new Date(Date.now() + 60000).toISOString(),
      pipeline_engine: "Antigravity-JSONL-Transcript-Parser-v1",
      raw_source_ref: syncedChatsDir,
    };

    return NextResponse.json({ success: true, chats, provenance: globalProvenance });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TRANSCRIPT_PARSE_ERROR",
          message: error.message,
          recoverable: true,
        },
        provenance: {
          source: "live" as const,
          fetched_at: new Date().toISOString(),
          stale_after: new Date().toISOString(),
          pipeline_engine: "Antigravity-JSONL-Transcript-Parser-v1",
        },
      },
      { status: 500 }
    );
  }
}
