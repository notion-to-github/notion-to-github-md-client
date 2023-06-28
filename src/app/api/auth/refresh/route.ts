import { getGitHubAccessTokenByRefreshToken } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { refreshToken } = await request.json();
    const res = await getGitHubAccessTokenByRefreshToken(refreshToken);

    return NextResponse.json(res);
}
