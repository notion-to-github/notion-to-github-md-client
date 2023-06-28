import { getGitHubAccessToken } from "@/lib/github";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { code } = await request.json();
    const res = await getGitHubAccessToken(code);

    return NextResponse.json(res);
}
