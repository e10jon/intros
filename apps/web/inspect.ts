import { inspect as utilInspect } from "util";

export const inspect = (input: unknown, level: "log" | "error" = "log") =>
  console[level](utilInspect(input, { depth: null, colors: true }));
