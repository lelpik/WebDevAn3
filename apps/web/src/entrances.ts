import { createEntrance, listEntrances, searchEntrances } from "./db/entrances";

// GET /api/entrances?q=unirii searches the addresses; no q, the whole list
entrancesApi.get("/", (c) => {
  const q = c.req.query("q");
  return c.json(q ? searchEntrances(q) : listEntrances());
});