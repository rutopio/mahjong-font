import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSource } from "./helpers/load-source.mjs";

test("tile loading retries rejected imports and retains successful data", async () => {
  let calls = 0;
  const { loadTilesData } = await loadSource(
    new URL("../src/lib/tiles-data.ts", import.meta.url),
    {
      dynamicImport: async () => {
        if (++calls === 1) throw new Error("Chunk unavailable");
        return import(
          "data:text/javascript,export default {metrics:{unitsPerEm:1000}}"
        );
      },
    }
  );
  const first = loadTilesData();
  assert.equal(first, loadTilesData());
  await assert.rejects(first, /Chunk unavailable/);
  const data = await loadTilesData();
  assert.equal(data.metrics.unitsPerEm, 1000);
  assert.equal(await loadTilesData(), data);
  assert.equal(calls, 2);
});
