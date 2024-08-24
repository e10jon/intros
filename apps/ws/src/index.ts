import { WebSocketServer } from "ws";
import { NhConnection } from "./nh-connection";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => new NhConnection(ws));

wss.on("listening", () => {
  console.log("listening on port 8080");
});
