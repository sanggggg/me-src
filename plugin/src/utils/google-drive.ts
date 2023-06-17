import { google, drive_v3 } from "googleapis";
import _chunk from "lodash/chunk";
import _flatten from "lodash/flatten";
import GoogleOAuth2 from "google-oauth2-env-vars";

import { ENV_TOKEN_VAR } from "./constants";
import { wait } from "./wait";

const MIME_TYPE_DOCUMENT = "text/markdown";
const MIME_TYPE_FOLDER = "application/vnd.google-apps.folder";

interface Parent {
  id: string;
  tree: Array<{ name: string | undefined }>;
}

type FileWithPath = drive_v3.Schema$File & {
  path: string | undefined;
  content: string;
};

type FileWithPath2 = {
  name: string;
  path: string | undefined;
  content: string;
};

function evenlyChunk<T>(arr: Array<T>, count: number): Array<Array<T>> {
  const chunks = Math.ceil(arr.length / count);
  if (chunks <= 1) {
    return [arr];
  }
  return _chunk(arr, Math.ceil(arr.length / chunks));
}

async function getGoogleDrive(): Promise<drive_v3.Drive> {
  const googleOAuth2 = new GoogleOAuth2({
    token: ENV_TOKEN_VAR,
  });
  const auth = await googleOAuth2.getAuth();

  return google.drive({ version: "v3", auth });
}

// 10 per 1.5 seconds.
const rateLimit = wait(10, 1500);
const BATCH_SIZE = 100;
/**
 * @param {import('..').Options & FetchDocumentsOptions} options
 * @returns {Promise<(import('..').DocumentFile & { path: string })[]>}
 */
async function fetchDocumentsFiles(
  drive: drive_v3.Drive,
  parents: Array<Parent>,
  options: any
): Promise<Array<FileWithPath>> {
  if (parents.length > BATCH_SIZE) {
    return _flatten(
      await Promise.all(
        evenlyChunk(parents, BATCH_SIZE).map((parents) =>
          fetchDocumentsFiles(drive, parents, options)
        )
      )
    );
  }

  const waited = await rateLimit();
  if (options.debug && waited > 1000) {
    const waitingTime = (waited / 1000).toFixed(1);
    console.info(
      `source-google-docs: rate limit reach. waiting ${waitingTime}s`
    );
  }

  const parentQuery =
    parents.length === 1 && parents[0].id === null
      ? false
      : parents.map((p) => `'${p.id}' in parents`).join(" or ");

  const query = {
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    q: `${
      parentQuery ? `(${parentQuery}) and ` : ""
    }(mimeType='${MIME_TYPE_FOLDER}' or mimeType='${MIME_TYPE_DOCUMENT}') and trashed = false`,
    fields: `nextPageToken,files(id, mimeType, name, description, createdTime, modifiedTime, parents)`,
  };

  const collectDocuments = (
    files: Array<drive_v3.Schema$File>
  ): Promise<Array<FileWithPath>> =>
    Promise.all(
      files
        .filter((file) => file.mimeType === MIME_TYPE_DOCUMENT)
        .map(async (file) => {
          const parentIds = file.parents && new Set(file.parents);
          const folder =
            (parentIds && parents.find((p) => parentIds.has(p.id))) ??
            undefined;
          const fileContent = await drive.files.get({
            fileId: file.id!,
            alt: "media",
          });
          const path = folder?.tree?.map((t) => t.name).join("/");
          return { ...file, path, content: fileContent.data as string };
        })
    );
  const collectParents = (files: Array<drive_v3.Schema$File>) => {
    return files
      .filter((file) => file.mimeType === MIME_TYPE_FOLDER && file.id)
      .map((folder) => {
        const parentIds = folder.parents && new Set(folder.parents);
        const parent = parentIds && parents.find((p) => parentIds.has(p.id));
        const tree = [
          ...(parent?.tree ?? []),
          {
            name: folder.name ?? undefined,
          },
        ];
        return {
          id: folder.id!,
          tree,
        };
      });
  };

  let documents: Array<FileWithPath> = [];
  let nextParents: Array<Parent> = [];
  let nextPageToken: string | undefined = undefined;

  do {
    await rateLimit();
    const response: drive_v3.Schema$FileList = (
      await drive.files.list({
        ...query,
        pageToken: nextPageToken,
      })
    ).data;
    documents = [
      ...documents,
      ...(await collectDocuments(response.files ?? [])),
    ];
    nextParents = [...nextParents, ...collectParents(response.files ?? [])];
    nextPageToken = response.nextPageToken ?? undefined;
  } while (nextPageToken);

  if (nextParents.length !== 0) {
    const documentsInChildren = await fetchDocumentsFiles(
      drive,
      nextParents,
      options
    );
    documents = [...documents, ...documentsInChildren];
  }
  return documents;
}

async function fetchFiles(folder: string, options: any) {
  const drive = await getGoogleDrive();
  const documentsFiles = await fetchDocumentsFiles(
    drive,
    [
      {
        id: folder,
        tree: [],
      },
    ],
    options
  );
  return documentsFiles;
}

export { fetchFiles, FileWithPath, FileWithPath2 };
