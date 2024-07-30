import { getClerkInstance } from "@clerk/clerk-expo";

const host = "http://localhost:3000";

export const introsFetch = async (path: string) => {
  const clerk = getClerkInstance();
  const token = await clerk.session?.getToken();

  const res = await fetch(host + path, {
    headers: {
      ...(token ? { Authorization: token } : undefined),
    },
  });

  return res.json();
};
