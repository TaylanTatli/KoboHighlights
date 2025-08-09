"use client";
import { Highlight } from "@/types";

export type HardcoverBookChoice = {
  bookId: number;
  editionId?: number;
  title: string;
  author?: string;
  slug?: string;
  coverUrl?: string;
};

const stripBearer = (raw: string): string =>
  raw.trim().replace(/^Bearer\s+/i, "");

const hardcoverProxy = async (
  token: string,
  query: string,
  variables?: Record<string, unknown>,
) => {
  const apiKey = stripBearer(token);
  const resp = await fetch("/api/proxy/hardcover", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: apiKey, query, variables }),
  });
  const json = await resp.json().catch(() => ({}));
  if (!resp.ok || json?.errors) {
    const message =
      json?.errors?.[0]?.message ||
      json?.message ||
      resp.statusText ||
      "Request failed";
    throw new Error(message);
  }
  return json as { data?: unknown };
};

export const searchHardcoverBooks = async (
  title: string,
  author: string,
  token: string,
): Promise<HardcoverBookChoice[]> => {
  // Prefer search endpoint for better ranking
  const query = `
    query Search($q: String!, $per: Int!, $page: Int!) {
      search(query: $q, query_type: "books", per_page: $per, page: $page, sort: "activities_count:desc") {
        results
      }
    }
  `;
  const { data } = await hardcoverProxy(token, query, {
    q: `${title} ${author}`.trim(),
    per: 10,
    page: 1,
  });

  const searchContainer = (data as Record<string, unknown>)?.search as
    | Record<string, unknown>
    | undefined;
  const rawResults = searchContainer?.results as unknown;
  const results: unknown[] = Array.isArray(rawResults)
    ? (rawResults as unknown[])
    : typeof rawResults === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(rawResults);
            return Array.isArray(parsed)
              ? (parsed as unknown[])
              : Array.isArray((parsed as Record<string, unknown>)?.hits)
                ? ((parsed as Record<string, unknown>).hits as unknown[]) || []
                : Array.isArray((parsed as Record<string, unknown>)?.items)
                  ? ((parsed as Record<string, unknown>).items as unknown[]) ||
                    []
                  : [];
          } catch {
            return [];
          }
        })()
      : Array.isArray((rawResults as Record<string, unknown>)?.hits)
        ? ((rawResults as Record<string, unknown>).hits as unknown[]) || []
        : Array.isArray((rawResults as Record<string, unknown>)?.items)
          ? ((rawResults as Record<string, unknown>).items as unknown[]) || []
          : [];
  // results is a blob of objects; extract the key fields if present
  const mapped: HardcoverBookChoice[] = results
    .map((r) => {
      const asRecord = (v: unknown): Record<string, unknown> =>
        v && typeof v === "object" ? (v as Record<string, unknown>) : {};
      const getStr = (v: unknown): string | undefined =>
        typeof v === "string" ? v : undefined;

      const obj = asRecord(r);
      const doc = (obj.document ? asRecord(obj.document) : obj) as Record<
        string,
        unknown
      >;

      const image = asRecord(doc.image);
      const cover = asRecord(doc.cover);
      const coverUrl = getStr(image.url) || getStr(cover.url);

      const authorName =
        getStr(doc.author_name) ||
        getStr(doc.primary_author) ||
        getStr(asRecord(doc.author).name);

      const idRaw = doc.book_id ?? doc.id;
      const id = typeof idRaw === "number" ? idRaw : Number(idRaw);

      if (!id || Number.isNaN(id)) return null;

      const title = getStr(doc.title) || "";
      const slug = getStr(doc.slug);

      const choice: HardcoverBookChoice = {
        bookId: id,
        title,
        author: authorName,
        slug,
        coverUrl: coverUrl,
      };
      return choice;
    })
    .filter((x): x is HardcoverBookChoice => Boolean(x));

  if (mapped.length > 0) return mapped;

  // Fallback to books query with ilike filters on title and author
  const fallback = `
    query BooksByTitleAuthor($title: String!, $author: String!) {
      books(
        order_by: { users_read_count: desc }
        where: {
          _and: [
            { title: { _ilike: $title } }
            { contributions: { author: { name: { _ilike: $author } } } }
          ]
        }
        limit: 10
      ) {
        id
        title
        slug
        cached_contributors
        default_physical_edition { id }
        default_digital_edition { id }
        image { url }
      }
    }
  `;
  const fbVars = { title: `%${title}%`, author: `%${author}%` };
  const fb = await hardcoverProxy(token, fallback, fbVars);
  const books = ((fb?.data as Record<string, unknown>)?.books ||
    []) as unknown[];
  return books.map((raw) => {
    const asRecord = (v: unknown): Record<string, unknown> =>
      v && typeof v === "object" ? (v as Record<string, unknown>) : {};
    const getStr = (v: unknown): string | undefined =>
      typeof v === "string" ? v : undefined;

    const b = asRecord(raw);
    const phys = asRecord(b.default_physical_edition);
    const digi = asRecord(b.default_digital_edition);
    const edIdRaw = phys.id ?? digi.id;
    const edId =
      typeof edIdRaw === "number"
        ? edIdRaw
        : edIdRaw != null
          ? Number(edIdRaw)
          : undefined;

    const contributors = Array.isArray(b.cached_contributors)
      ? (b.cached_contributors as unknown[])
      : [];
    const first = asRecord(contributors[0]);
    const firstAuthor = getStr(asRecord(first.author).name);

    const img = asRecord(b.image);

    const choice: HardcoverBookChoice = {
      bookId: Number(b.id),
      editionId: edId && !Number.isNaN(edId) ? Number(edId) : undefined,
      title: getStr(b.title) || "",
      author: firstAuthor,
      slug: getStr(b.slug),
      coverUrl: getStr(img.url),
    };
    return choice;
  });
};

// Normalization helper for deduping quotes
const normalizeQuote = (text: string): string => {
  const unified = text.replace(/\r\n?/g, "\n");
  const lines = unified.split("\n");
  while (lines.length > 0 && lines[0].trim() === "") lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") lines.pop();
  const cleaned: string[] = [];
  let lastBlank = false;
  for (const line of lines) {
    const trimmed = line.replace(/^\s+|\s+$/g, "");
    const isBlank = trimmed.length === 0;
    if (isBlank) {
      if (!lastBlank) cleaned.push("");
    } else {
      cleaned.push(trimmed);
    }
    lastBlank = isBlank;
  }
  return cleaned.join("\n");
};

const getLocalUploadedSet = (bookId: number): Set<string> => {
  try {
    const raw = localStorage.getItem(`hardcoverUploaded:${bookId}`);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? (arr as string[]) : []);
  } catch {
    return new Set();
  }
};

const saveLocalUploadedSet = (bookId: number, ids: Set<string>) => {
  try {
    localStorage.setItem(
      `hardcoverUploaded:${bookId}`,
      JSON.stringify(Array.from(ids)),
    );
  } catch {
    // ignore
  }
};

export const postQuotesToHardcover = async (
  token: string,
  hardcoverBookId: number,
  highlights: Highlight[],
  privacySettingId: number = 1,
) => {
  // Local-only dedupe: skip highlights already uploaded from this browser
  const localIds = getLocalUploadedSet(hardcoverBookId);

  for (const hl of highlights) {
    if (localIds.has(hl.id)) continue;

    const normalized = normalizeQuote(hl.content);
    const entry = normalized.replaceAll('"""', '\\"\\"\\"');
    const mutation = `
      mutation PostQuote($book_id: Int!, $entry: String!, $privacy: Int!) {
        insert_reading_journal(
          object: {
            book_id: $book_id,
            event: "quote",
            tags: { spoiler: false, category: "quote", tag: "" },
            entry: $entry,
            privacy_setting_id: $privacy
          }
        ) { errors }
      }
    `;
    await hardcoverProxy(token, mutation, {
      book_id: hardcoverBookId,
      entry,
      privacy: privacySettingId,
    });
    localIds.add(hl.id);
  }
  saveLocalUploadedSet(hardcoverBookId, localIds);
};
