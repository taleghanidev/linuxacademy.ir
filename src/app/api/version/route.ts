// Deploy marker: CI polls this to know when a given commit is live.
export function GET() {
  return Response.json({
    sha: process.env.VERCEL_GIT_COMMIT_SHA ?? "dev",
  });
}
