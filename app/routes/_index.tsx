import {
  ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Link, Form, useLoaderData } from "@remix-run/react";

import { json, redirect } from "@remix-run/node";

import { userPrefs } from "~/cookies.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");

  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  return json({ showBanner: cookie.showBanner });
}

export async function action({ request }: ActionFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");

  const cookie = (await userPrefs.parse(cookieHeader)) || {};

  const bodyParams = await request.formData();

  if (bodyParams.get("bannerVisibility") === "hidden") {
    cookie.showBanner = false;
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": await userPrefs.serialize(cookie),
    },
  });
}

export default function Index() {
  const { showBanner } = useLoaderData<typeof loader>();

  return (
    <div>
      {!showBanner && (
        <div>
          <Link to="/sale">Don't miss our sale!</Link>
          <Form method="post">
            <input type="hidden" name="bannerVisibility" value="hidden" />
            <button type="submit">Hide</button>
          </Form>
        </div>
      )}
      <h1>Welcome!</h1>
    </div>
  );
}
