import { readFile } from "node:fs/promises";
import { createContext, SourceTextModule, SyntheticModule } from "node:vm";
import { transformWithOxc } from "vite";

export async function loadSource(
  url,
  { globals = {}, imports = {}, meta = {}, dynamicImport } = {}
) {
  const context = createContext({
    URL,
    URLSearchParams,
    Request,
    Response,
    Headers,
    console,
    ...globals,
  });
  const source = await readFile(url, "utf8");
  const module = new SourceTextModule(
    (await transformWithOxc(source, url.pathname)).code,
    {
      context,
      initializeImportMeta: (target) => Object.assign(target, meta),
      importModuleDynamically: dynamicImport,
    }
  );
  await module.link((specifier) => {
    const values = imports[specifier];
    if (!values) throw new Error(`Missing test import: ${specifier}`);
    return new SyntheticModule(
      Object.keys(values),
      function () {
        for (const [key, value] of Object.entries(values))
          this.setExport(key, value);
      },
      { context }
    );
  });
  await module.evaluate();
  return module.namespace;
}

export function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}
