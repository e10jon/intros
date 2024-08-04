import { Container } from "@/container";
import { inspect } from "@/lib/inspect";
import { isValidJob } from "./is-valid-job";

async function run() {
  const job = process.argv[2];
  if (!job) throw new Error("No job provided");
  if (!isValidJob(job)) throw new Error("invalid job!");

  const startedAt = new Date();
  const cnt = await Container.init();

  console.info(`Running ${job}...`);
  await cnt.jobs[job]();

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
