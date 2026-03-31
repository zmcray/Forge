export function GET() {
  const keys = Object.keys(process.env).filter(k => 
    k.includes("ANTHROPIC") || k.includes("FORGE") || k.includes("VERCEL")
  );
  return Response.json({ 
    envKeys: keys,
    hasKey: !!process.env.ANTHROPIC_API_KEY,
    nodeEnv: process.env.NODE_ENV
  });
}
