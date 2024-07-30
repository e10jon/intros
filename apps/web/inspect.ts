import { inspect as utilInspect } from "util";

export const inspect = (input: unknown) =>
  console.log(utilInspect(input, { depth: null, colors: true }));
