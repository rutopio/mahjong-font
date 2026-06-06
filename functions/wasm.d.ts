// Wrangler/CF Pages bundles .wasm imports as WebAssembly.Module instances.
declare module "*.wasm" {
  const wasmModule: WebAssembly.Module;
  export default wasmModule;
}
