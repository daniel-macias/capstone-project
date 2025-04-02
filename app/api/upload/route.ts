import { NextResponse } from "next/server";

const WEBHOOK_JSON = process.env.NEXT_PUBLIC_N8N_WEBHOOK_POST;

export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!WEBHOOK_JSON) {
      return NextResponse.json({ message: "Webhook URL is missing" }, { status: 500 });
    }

    console.log("Forwarding JSON object to:", WEBHOOK_JSON);
    console.log("Payload:", data);

    const webhookResponse = await fetch(WEBHOOK_JSON, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text();
      console.error("Webhook error:", errorText);
      return NextResponse.json({ message: "Webhook failed", error: errorText }, { status: 500 });
    }

    const result = await webhookResponse.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in proxy:", error);
    return NextResponse.json({ message: "Proxy error", error: String(error) }, { status: 500 });
  }
}
