export function GET() {
  const allKeys = Object.keys(process.env);
  const nonVercelKeys = allKeys.filter(k => !k.startsWith("VERCEL") && k !== "NODE_ENV" && k !== "PATH" && k !== "HOME" && k !== "LANG" && k !== "TZ");
  return Response.json({
    hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
    hasForgeToken: !!process.env.FORGE_AUTH_TOKEN,
    totalEnvVars: allKeys.length,
    nonSystemEnvVars: nonVercelKeys,
    vercelEnv: process.env.VERCEL_ENV,
    vercelTargetEnv: process.env.VERCEL_TARGET_ENV,
    vercelProject: process.env.VERCEL_PROJECT_NAME,
    vercelUrl: process.env.VERCEL_URL,
  });
}
