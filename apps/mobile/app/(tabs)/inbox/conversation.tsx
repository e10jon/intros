import { Button, Text, View } from "react-native";
import {
  introsFetch,
  type DescribeRoomMessageSchema,
  type JoinRoomMessageSchema,
  type LeaveRoomMessageSchema,
} from "@intros/shared";
import { useEffect, useState } from "react";

export default function Home() {
  const [ws, setWs] = useState<WebSocket | null>(null);

  const connect = () => {
    console.log(`WS connecting...`);
    const ws = new WebSocket("ws://localhost:8080");
    setWs(ws);

    ws.onopen = () => {
      console.log("WS connected!");
    };

    ws.onclose = () => {
      console.log("WS closed!");
      return setTimeout(connect, 1000);
    };

    return () => {
      ws.close();
    };
  };

  useEffect(() => {
    return connect();
  }, []);

  const joinRoom = () => {
    if (!ws || ws.readyState !== 1) return;

    const message: JoinRoomMessageSchema = {
      event: "join-room",
      roomId: "abc",
    };
    ws.send(JSON.stringify(message));
  };

  const leaveRoom = () => {
    if (!ws || ws.readyState !== 1) return;

    const message: LeaveRoomMessageSchema = {
      event: "leave-room",
      roomId: "abc",
    };
    ws.send(JSON.stringify(message));
  };

  const describeRoom = () => {
    if (!ws || ws.readyState !== 1) return;

    const message: DescribeRoomMessageSchema = {
      event: "describe-room",
      roomId: "abc",
    };
    ws.send(JSON.stringify(message));
  };

  return (
    <View>
      <Text>Hello!</Text>
      <Button onPress={joinRoom} title="Join room" />
      <Button onPress={leaveRoom} title="leave room" />
      <Button onPress={describeRoom} title="Describe room" />
    </View>
  );
}
