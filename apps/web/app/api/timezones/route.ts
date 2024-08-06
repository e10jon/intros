import { NextResponse } from "next/server";
import { Container } from "@/container";
import timezones from "timezones-list";
import { Data } from "@intros/types";

// get the list of timezones
export async function GET(): Promise<NextResponse<Data<"/api/timezones">>> {
  // make sure this endpoint isn't abused publicly
  await Container.init({ requireUser: true });

  // put american timezones first
  const list = timezones
    .map(({ tzCode }) => tzCode)
    .sort((a, b) => {
      const aIsAmerica = a.startsWith("America/");
      const bIsAmerica = b.startsWith("America/");

      return aIsAmerica && bIsAmerica
        ? a.localeCompare(b)
        : aIsAmerica
        ? -1
        : bIsAmerica
        ? 1
        : a.localeCompare(b);
    });

  return NextResponse.json({ timezones: list });
}
