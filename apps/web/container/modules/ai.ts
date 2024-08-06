import OpenAI from "openai";
import { Container } from "..";
import { getEnvCred } from "@/lib/get-env-cred";
import { inspect } from "@/lib/inspect";

export class AiModule {
  openAiApiClient = new OpenAI({ apiKey: getEnvCred("openAiSecretKey") });

  constructor(private cnt: Container) {}

  async extractInterestsFromBio(bio: string): Promise<string[]> {
    const response = await this.openAiApiClient.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to read a biography about a person and then output the top 10 keywords they are interested in talking about, in JSON format { interests: string[] }.",
        },
        { role: "user", content: bio },
      ],
    });
    if (!response.choices[0].message.content) return [];

    const { interests } = JSON.parse(response.choices[0].message.content) as {
      interests: string[];
    };

    return interests;
  }

  async getModerationScores(input: string) {
    const response = await this.openAiApiClient.moderations.create({ input });
    return response.results[0];
  }

  async reviewUserReport({
    profile,
    messages,
    report,
  }: {
    report: { reason: string };
    profile: { title: string; bio: string };
    messages: { body: string }[];
  }) {
    const response = await this.openAiApiClient.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a helpful moderator designed to review a report that one user made against another user. I will send you the reason for the report, as well as the suspect's profile title and bio, as well as an array of recent messages sent. You will tell me if the report is valid in JSON format { valid: boolean; notes: string }",
        },
        {
          role: "user",
          content: JSON.stringify({ report, profile, messages }),
        },
      ],
    });
    if (!response.choices[0].message.content) return [];

    const { valid, notes } = JSON.parse(
      response.choices[0].message.content
    ) as {
      valid: boolean;
      notes: string;
    };

    return { valid, notes };
  }
}
