import { messageSchema, type MessageSchema } from "@intros/shared";
import { type WebSocket } from "ws";

export class NhConnection {
  constructor(private ws: WebSocket) {
    ws.onerror = this.onError;
    ws.onmessage = this.onMessage;
    ws.onclose = this.onClose;
  }

  private onError: WebSocket["onerror"] = (e) => {};

  private onMessage: WebSocket["onmessage"] = async (e) => {
    console.log(`NhConnection message: ${e.data}`);

    let message;
    try {
      message = JSON.parse(e.data.toString());
    } catch (e) {
      console.error(e);
      return;
    }

    const parsed = messageSchema.safeParse(message);
    if (!parsed.success) {
      console.error(parsed.error.errors);
      return;
    }

    return await this.processMessage(parsed.data);
  };

  private onClose: WebSocket["onclose"] = (e) => {};

  private processMessage = async ({ event, roomId }: MessageSchema) => {
    switch (event) {
      case "join-room":
        return this.joinRoom(roomId);
      case "leave-room":
        return this.leaveRoom(roomId);
      case "describe-room":
        return this.describeRoom(roomId);
    }
  };

  private joinRoom = (roomId: string) => {
    const room = NhConnection.rooms.get(roomId) || new Set<WebSocket>();
    if (room.has(this.ws)) return;

    room.add(this.ws);
    NhConnection.rooms.set(roomId, room);
    console.log(`NhConnection joined room: ${roomId}`);
  };

  private leaveRoom = (roomId: string) => {
    const room = NhConnection.rooms.get(roomId);
    if (!room) return;

    room.delete(this.ws);
    if (room.size === 0) {
      NhConnection.rooms.delete(roomId);
    } else {
      NhConnection.rooms.set(roomId, room);
    }
    console.log(`NhConnection left room: ${roomId}`);
  };

  private describeRoom = (roomId: string) => {
    const room = NhConnection.rooms.get(roomId);
    if (!room) return;

    console.log(`NhConnection room: ${roomId} [${room.size}]`);
  };

  static rooms = new Map<string, Set<WebSocket>>();
}
