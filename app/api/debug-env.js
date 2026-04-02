export function GET() {
  const allKeys = Object.keys(process.env);
  const nonSystemKeys = allKeys.filter(
    (k) =>
      !k.startsWith("VERCEL") &&
      k !== "NODE_ENV" &&
      k !== "PATH" &&
      k !== "HOME" &&
      k !== "LANG" &&
      k !== "TZ" &&
      k !== "AWS_REGION" &&
      k !== "AWS_EXECUTION_ENV" &&
      k !== "AWS_LAMBDA_FUNCTION_NAME" &&
      k !== "AWS_LAMBDA_FUNCTION_VERSION" &&
      k !== "AWS_LAMBDA_FUNCTION_MEMORY_SIZE" &&
      k !== "AWS_LAMBDA_LOG_GROUP_NAME" &&
      k !== "AWS_LAMBDA_LOG_STREAM_NAME" &&
      k !== "AWS_ACCESS_KEY_ID" &&
      k !== "AWS_SECRET_ACCESS_KEY" &&
      k !== "AWS_SESSION_TOKEN" &&
      k !== "_HANDLER" &&
      k !== "LAMBDA_TASK_ROOT" &&
      k !== "LAMBDA_RUNTIME_DIR"
  );

  // Check for any key containing "anthropic" or "forge" (case-insensitive)
  const relevantKeys = allKeys.filter(
    (k) =>
      k.toLowerCase().includes("anthropic") ||
      k.toLowerCase().includes("forge") ||
      k.toLowerCase().includes("vite")
  );

  // Check exact expected names
  const exactCheck = {
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    FORGE_AUTH_TOKEN: !!process.env.FORGE_AUTH_TOKEN,
    VITE_FORGE_AUTH_TOKEN: !!process.env.VITE_FORGE_AUTH_TOKEN,
  };

  // If ANTHROPIC_API_KEY exists, show first 7 and last 4 chars
  let keyPreview = null;
  if (process.env.ANTHROPIC_API_KEY) {
    const k = process.env.ANTHROPIC_API_KEY;
    keyPreview = k.length > 11 ? `${k.slice(0, 7)}...${k.slice(-4)}` : "(too short)";
  }

  return Response.json({
    totalEnvVars: allKeys.length,
    nonSystemKeys,
    relevantKeys,
    exactCheck,
    keyPreview,
    vercelEnv: process.env.VERCEL_ENV,
    vercelUrl: process.env.VERCEL_URL,
    timestamp: new Date().toISOString(),
  });
}
