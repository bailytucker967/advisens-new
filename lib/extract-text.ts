// Client-side text extraction from uploaded documents.
//
// Runs entirely in the browser so large or binary files (e.g. a 183 MB scanned
// PDF) never have to be uploaded. We send only the extracted text to the model.
// PDFs go through unpdf (a serverless pdf.js build that needs no worker setup),
// DOCX through mammoth, and plain text / CSV / Markdown are read directly.

export type ExtractResult = {
  text: string;
  chars: number;
  warning?: string;
};

// Postgres `text` columns reject NUL bytes, which PDF extraction can emit.
// Built from a char code so there is never a literal NUL byte in this source.
const NUL_BYTES = new RegExp(String.fromCharCode(0), "g");

function stripNul(s: string): string {
  return s.replace(NUL_BYTES, "").trim();
}

function extensionOf(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

async function fromPdf(file: File): Promise<ExtractResult> {
  const { getDocumentProxy, extractText: extractPdfText } = await import("unpdf");
  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await getDocumentProxy(data);
  const { text, totalPages } = await extractPdfText(pdf, { mergePages: true });
  const clean = stripNul(text || "");
  // A multi-page PDF that yields almost no text is a scan with no text layer.
  const warning =
    clean.length < Math.min(40, totalPages * 5)
      ? "Little or no selectable text found. This PDF looks scanned and would need OCR; nothing was extracted."
      : undefined;
  return { text: clean, chars: clean.length, warning };
}

async function fromDocx(file: File): Promise<ExtractResult> {
  const mammoth = await import("mammoth/mammoth.browser");
  const { value } = await mammoth.extractRawText({
    arrayBuffer: await file.arrayBuffer(),
  });
  const clean = stripNul(value || "");
  return { text: clean, chars: clean.length };
}

async function fromPlain(file: File): Promise<ExtractResult> {
  const clean = stripNul(await file.text());
  return { text: clean, chars: clean.length };
}

export async function extractText(file: File): Promise<ExtractResult> {
  const ext = extensionOf(file.name);
  try {
    if (ext === "pdf") return await fromPdf(file);
    if (ext === "docx") return await fromDocx(file);
    if (["txt", "md", "csv"].includes(ext)) return await fromPlain(file);
    if (["png", "jpg", "jpeg"].includes(ext))
      return {
        text: "",
        chars: 0,
        warning: `${file.name}: images need OCR, which isn't supported yet.`,
      };
    if (["xlsx", "xls", "doc"].includes(ext))
      return {
        text: "",
        chars: 0,
        warning: `${file.name}: .${ext} isn't supported yet. Export it to PDF, CSV, or DOCX.`,
      };
    return {
      text: "",
      chars: 0,
      warning: `${file.name}: unsupported file type ".${ext}".`,
    };
  } catch (err) {
    return {
      text: "",
      chars: 0,
      warning: `${file.name}: couldn't read it (${err instanceof Error ? err.message : "extraction failed"}).`,
    };
  }
}
