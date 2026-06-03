import { PageHeader } from "../../_components/PageHeader";
import { TemplateUploadForm } from "./TemplateUploadForm";

export default function NewTemplatePage() {
  return (
    <>
      <PageHeader
        eyebrow="Templates · New"
        title="Upload a template"
        description="Upload the report design TWI Report Generator should learn from. PDFs work best — the AI will parse structure, section order, and your firm's language."
      />
      <TemplateUploadForm />
    </>
  );
}
