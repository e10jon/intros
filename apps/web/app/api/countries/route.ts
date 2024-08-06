import { NextResponse } from "next/server";
import { Container } from "@/container";
import { Country } from "country-state-city";

// get the list of countries
export async function GET() {
  // make sure this endpoint isn't abused publicly
  await Container.init({ requireUser: true });

  const countries = Country.getAllCountries().reduce<
    { name: string; isoCode: string }[]
  >((arr, { name, isoCode }) => {
    const country = { name, isoCode };
    // move United States to the front
    if (name === "United States") return [country].concat(arr);
    return arr.concat(country);
  }, []);

  return NextResponse.json({ countries });
}
