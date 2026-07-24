import type { APIRoute } from "astro";

import { downloadKycDocumentContent } from "../../../../../lib/server/kyc-service";

export const GET: APIRoute = async ({ locals, params }) => {
  const session = locals.adminSession;
  const documentId = params.documentId;

  if (!session || !documentId) {
    return new Response("Session admin requise.", { status: 401 });
  }

  try {
    const document = await downloadKycDocumentContent(documentId, session.accessToken);
    const headers = new Headers({
      "Content-Type": document.contentType,
      "Cache-Control": "no-store"
    });
    if (document.contentDisposition) {
      headers.set("Content-Disposition", document.contentDisposition);
    }
    return new Response(document.content, { status: 200, headers });
  }
  catch {
    return new Response("Document KYC indisponible.", { status: 502 });
  }
};
