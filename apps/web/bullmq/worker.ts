import { Worker } from "bullmq";
import { connection } from "./connection";
import { defaultQueueName } from "./queue";
import { Container } from "@/container";
import { isValidJob } from "@/lib/is-valid-job";

const worker = new Worker(
  defaultQueueName,
  async (job) => {
    if (!isValidJob(job.name)) {
      console.error(`Invalid job "${job.name}"`);
      return true;
    }

    const cnt = await Container.init();
    await cnt.jobs[job.name]();

    // work
    console.log(
      `Worker completed job "${job.name}" with args ${JSON.stringify(
        job.data
      )}"`
    );
    return true;
  },
  { connection }
);

worker.on("ready", () => {
  console.log(`Worker is working "${defaultQueueName}"`);
});

worker.on("active", (job) => {
  console.log(
    `Worker received job "${job.name}" with args ${JSON.stringify(job.data)}"`
  );
});

worker.on("closing", () => {
  console.log("Worker is closing");
});

worker.on("closed", () => {
  console.log("Worker has closed");
});

worker.on("failed", (job, err) => {
  console.log(`Job failed with error ${err.message}`);
});

worker.on("error", (error) => {
  console.error(`Worker error: ${error.message}`);
});

// do this in the worker function itself:
// worker.on("completed", (job, result) => {
//   `Worker completed job "${job.name}" with args ${JSON.stringify(job.data)}"`;
// });
