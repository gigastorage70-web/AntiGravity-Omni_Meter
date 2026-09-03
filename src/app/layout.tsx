import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antigravity Omniverse | Cloud Command Center & AI Studio Hub",
  description: "Unified dashboard to track all Google Antigravity model quotas (G3FM, Gemini Pro, Claude), Nano-Banana images, Veo video generations, multi-device sessions, and Cloudflare R2 backup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070a10] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_50%_50%_at_90%_80%,rgba(139,92,246,0.08),transparent)] pointer-events-none z-0" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
