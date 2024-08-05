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
}
