import { Container } from "@/container";
import { inspect } from "@/lib/inspect";
import { join } from "path";

async function run() {
  const job = process.argv[2];
  if (!job) throw new Error("No job provided");

  const startedAt = new Date();

  console.info(`Running ${job}...`);

  const file = require(join(__dirname, "./", job));

  const cnt = await Container.init();
  await file.default(cnt);

  const endedAt = new Date();

  console.info(
    `Ran job ${job} in ${(endedAt.getTime() - startedAt.getTime()) / 1000}s!`
  );
}

run()
  .catch((e: Error) => {
    inspect(e, "error");
  })
  .finally(() => {
    process.exit();
  });
