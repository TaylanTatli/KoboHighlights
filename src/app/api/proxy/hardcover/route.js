import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { token, query, variables } = await request.json();

    if (!token || !query) {
      return NextResponse.json(
        { message: "Missing token or query" },
        { status: 400 },
      );
    }

    const resp = await fetch("https://api.hardcover.app/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      return NextResponse.json(
        { message: data?.errors?.[0]?.message || resp.statusText },
        { status: resp.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Unknown error" },
      { status: 500 },
    );
  }
}

