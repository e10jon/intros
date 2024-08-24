import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import express from "express";
import { createQueue } from "@intros/container/dist/redis.js";

const main = async () => {
  const app = express();
  const expressAdapter = new ExpressAdapter();
  const bullMQAdapter = new BullMQAdapter(createQueue());
  const port = process.env.BULL_BOARD_PORT || process.env.PORT || 3005;

  createBullBoard({
    queues: [bullMQAdapter],
    serverAdapter: expressAdapter,
  });

  app.use(expressAdapter.getRouter());
  app.listen(port, () => {
    console.log(`BullBoard running on ${port}`);
  });
};

main().catch((e) => {
  console.error(e);
});
