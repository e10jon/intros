import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { Container } from "../container";

type Props = { hello: string };

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return <div>hello world data {props.hello}</div>;
}

export const getServerSideProps = (async ({ req, res }) => {
  const cnt = await Container.init(req, res);
  console.log("propping");
  return { props: cnt.helloWorld() };
}) satisfies GetServerSideProps<Props>;
