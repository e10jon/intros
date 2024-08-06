import { NextResponse } from "next/server";
import { Data } from "@intros/shared";

export async function GET(): Promise<NextResponse<Data<"/api">>> {
  return NextResponse.json({ hello: "there" });
}
