import { Worker } from "bullmq";
import { connection } from "./connection";
import { defaultQueueName } from "./queue";

console.log(`Worker is working "${defaultQueueName}"`);

const worker = new Worker(
  defaultQueueName,
  async (job) => {
    console.log(job.data);
  },
  { connection }
);
