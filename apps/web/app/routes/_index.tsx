import { useLoaderData } from "@remix-run/react";
import { loader } from "./api._index";

export { loader };

export default function Home() {
  const data = useLoaderData<typeof loader>();

  return <div>API says {data.hello}</div>;
}
