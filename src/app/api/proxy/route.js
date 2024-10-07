import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { token, payload, url } = await request.json();
  const notion = new Client({ auth: token });

  try {
    let response;
    if (url === "/v1/databases") {
      response = await notion.databases.create(payload);
    } else if (url === "/v1/pages") {
      response = await notion.pages.create(payload);
    } else {
      return NextResponse.json({ message: "Invalid URL" }, { status: 400 });
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
