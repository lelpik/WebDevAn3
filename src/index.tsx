// hono.ts — the same server with a framework
import { Hono } from "hono";
import { logger } from "hono/logger";
import { stringPages } from "./string-pages";
import { team } from "./data";
import { Layout } from "./views/Layout.tsx";
import { etaPages } from "./eta-pages";
import { serveStatic } from "@hono/bun";

const app = new Hono();
app.use(logger()); // one line: every request logged with status and time
app.get("/", (c) => {
  const name = c.req.query("name") ?? "stranger";
  return c.html(
    <Layout title="Home">
      <h1>Hello, {name}!</h1>
      <p>The office side of the building survey.</p>
    </Layout>,
  );
});
app.use("*", serveStatic({ root: "./public" }));

app.get("/team", (c) =>
  c.html(
    <Layout title="Team">
      <h1>Team</h1>
      <ul>
        {team.map((member) => (
          <li>{member}</li>
        ))}
      </ul>
    </Layout>,
  ),
);

app.get("/echo", (c) => c.json({ hello: c.req.query("name") ?? "stranger" }));
app.post("/echo", async (c) => {
  const body = await c.req.text();
  return c.json({ youSent: body, contentType: c.req.header("content-type") });
});
app.get("/time", (c) => {
  c.header("Cache-Control", "no-store");
  return c.json({ now: new Date().toISOString() });
});

app.route("/strings", stringPages);
app.route("/eta", etaPages);

import { readdir } from "node:fs/promises";

// step 7b: a page that lists a folder
app.get("/files", async (c) => {
  const names = await readdir("./public");
  const files = names.map((name) => ({ name, size: Bun.file(`./public/${name}`).size }));
  return c.html(
    <Layout title="Files">
      <h1>public/</h1>
      <ul>
        {files.map((file) => (
          <li>
            <a href={`/${file.name}`}>{file.name}</a> — {file.size} bytes
          </li>
        ))}
      </ul>
    </Layout>,
  );
});

app.notFound((c) => c.json({ error: "Not found", path: c.req.path }, 404));


export default app; // Bun sees a default export with fetch() and serves it
