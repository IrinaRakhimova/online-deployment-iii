import { serve } from "https://deno.land/std@0.202.0/http/server.ts";
import { configure, renderFile } from "https://deno.land/x/eta@v2.2.0/mod.ts";
import * as addressService from "./services/addressService.js";
import { sql } from "./database/database.js";

configure({
  views: `${Deno.cwd()}/views/`,
});

const responseDetails = {
  headers: { "Content-Type": "text/html;charset=UTF-8" },
};

const redirectTo = (path) => {
  return new Response(`Redirecting to ${path}.`, {
    status: 303,
    headers: {
      "Location": path,
    },
  });
};

const listTopFive = async (request) => {
  const data = {
    messages: await addressService.topFive(),
  };

  return new Response(await renderFile("index.eta", data), responseDetails);
};


const addComment = async (request) => {
  const formData = await request.formData();

  const sender = formData.get("sender");
  const message = formData.get("message");

  await addressService.create(sender, message);

  return redirectTo("/");
};

const handleRequest = async (request) => {
  if (request.method === "GET") {
    return await listTopFive(request);
  } else if (request.method === "POST") {
    return await addComment(request);
  } else {
    return await listTopFive(request);
  }
};

serve(handleRequest, { port: 7777 });
