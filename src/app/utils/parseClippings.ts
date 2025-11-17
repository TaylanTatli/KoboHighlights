import { Book, Highlight } from "@/types";

interface ParsedClipping {
  bookTitle: string;
  author: string;
  highlightText: string;
  metadata?: string;
}

/**
 * Parses "My Clippings.txt" format from Kindle/KoReader
 * Format:
 * Book Title (Author, Name)
 * - Your Highlight on page X | Location Y-Z | Added on Date
 * 
 * Highlight text here
 * ==========
 */
export const parseClippingsFile = (fileContent: string): Book[] => {
  // Split by separator, handling both with and without trailing newline
  const entries = fileContent.split(/==========\r?\n?/);
  const parsedClippings: ParsedClipping[] = [];

  for (const entry of entries) {
    if (!entry.trim()) continue;

    const lines = entry.trim().split(/\r?\n/);
    if (lines.length < 2) continue;

    // First line: "Book Title (Author, Name)"
    const titleLine = lines[0].trim();
    const titleMatch = titleLine.match(/^(.+?)\s*\(([^)]+)\)$/);
    
    if (!titleMatch) {
      // Try without parentheses (some formats might not have author)
      const bookTitle = titleLine;
      const author = "";
      const metadata = lines[1]?.trim() || "";
      // Skip empty lines after metadata, then get highlight text
      let highlightStartIndex = 2;
      while (highlightStartIndex < lines.length && !lines[highlightStartIndex]?.trim()) {
        highlightStartIndex++;
      }
      const highlightText = lines.slice(highlightStartIndex).join("\n").trim();
      
      if (highlightText) {
        parsedClippings.push({
          bookTitle,
          author,
          highlightText,
          metadata,
        });
      }
      continue;
    }

    const bookTitle = titleMatch[1].trim();
    const authorPart = titleMatch[2].trim();
    
    // Extract author name (format: "Last, First" or "First Last")
    let author = "";
    if (authorPart.includes(",")) {
      const [last, ...firstParts] = authorPart.split(",");
      author = `${firstParts.join(",").trim()} ${last.trim()}`.trim();
    } else {
      author = authorPart;
    }

    // Second line: metadata (optional)
    const metadata = lines[1]?.trim() || "";
    
    // Skip empty lines after metadata, then get highlight text
    let highlightStartIndex = 2;
    while (highlightStartIndex < lines.length && !lines[highlightStartIndex]?.trim()) {
      highlightStartIndex++;
    }
    const highlightText = lines.slice(highlightStartIndex).join("\n").trim();

    if (highlightText) {
      parsedClippings.push({
        bookTitle,
        author,
        highlightText,
        metadata,
      });
    }
  }

  // Group clippings by book (title + author combination)
  const bookMap = new Map<string, ParsedClipping[]>();
  
  for (const clipping of parsedClippings) {
    const bookKey = `${clipping.bookTitle}|||${clipping.author}`;
    if (!bookMap.has(bookKey)) {
      bookMap.set(bookKey, []);
    }
    bookMap.get(bookKey)!.push(clipping);
  }

  // Convert to Book format
  const books: Book[] = Array.from(bookMap.entries()).map(([bookKey, clippings], index) => {
    const [title, author] = bookKey.split("|||");
    
    const highlights: Highlight[] = clippings.map((clipping, highlightIndex) => ({
      id: `#${highlightIndex + 1}`,
      content: clipping.highlightText,
    }));

    return {
      id: `clippings-${index}`,
      title,
      author,
      publisher: "",
      isbn: 0,
      releaseDate: "",
      series: "",
      seriesNumber: 0,
      rating: 0,
      readPercent: 0,
      lastRead: "",
      fileSize: 0,
      source: "Clippings",
      highlights,
    };
  });

  // Sort books by title
  return books.sort((a, b) =>
    a.title.localeCompare(b.title, "en", { sensitivity: "base" }),
  );
};

