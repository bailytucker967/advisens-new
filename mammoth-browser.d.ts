// mammoth ships a browser build at this subpath but no separate type
// declaration for it. Declare the single function we call.
declare module "mammoth/mammoth.browser" {
  export function extractRawText(input: {
    arrayBuffer: ArrayBuffer;
  }): Promise<{ value: string; messages: unknown[] }>;
}
