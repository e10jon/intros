import { Container } from "@/container";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { FastifyAdapter } from "@bull-board/fastify";
import Fastify from "fastify";

const port = 3001;

const run = async () => {
  const app = Fastify();

  const cnt = await Container.init();
  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: [new BullMQAdapter(cnt.queue)],
    serverAdapter,
  });

  app.register(serverAdapter.registerPlugin());

  await app.listen({ port });

  console.log(`Running on ${port}...`);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
