import { google } from "googleapis";
import GoogleOAuth2 from "google-oauth2-env-vars";

import { ENV_TOKEN_VAR } from "./constants";
import { Reporter } from "gatsby";
import { fetchFiles } from "./google-drive";

async function fetchDocument(id: string) {
  const googleOAuth2 = new GoogleOAuth2({
    token: ENV_TOKEN_VAR,
  });
  const auth = await googleOAuth2.getAuth();

  const res = await google.docs({ version: "v1", auth }).documents.get({
    documentId: id,
  });

  if (!res.data) {
    throw new Error("Empty Data");
  }

  return res.data;
}

async function fetchDocuments(
  options: { debug: boolean; fileId: string },
  reporter: Reporter
) {
  const timer = reporter.activityTimer(`source-google-docs: documents`);
  if (options.debug) {
    timer.start();
    timer.setStatus("fetching documents");
  }
  const documents = await fetchFiles(options.fileId, { debug: true });
  if (options.debug) {
    timer.setStatus(documents.length + " documents fetched");
    timer.end();
  }
  return documents;
}

export { fetchDocuments };
