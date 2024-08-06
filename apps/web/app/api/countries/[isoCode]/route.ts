import { NextResponse } from "next/server";
import { Container } from "@/container";
import { State } from "country-state-city";

// get the list of states for country
export async function GET(
  request: Request,
  { params }: { params: { isoCode: string } }
) {
  // make sure this endpoint isn't abused publicly
  await Container.init({ requireUser: true });

  const state = State.getStatesOfCountry(params.isoCode).map(
    ({ name, isoCode }) => ({ name, isoCode })
  );
  if (!state)
    return NextResponse.json({ error: "Country not found" }, { status: 400 });

  return NextResponse.json({ state });
}
