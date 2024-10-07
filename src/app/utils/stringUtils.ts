export const removeTrailingEmptyLine = (content: string): string => {
  const lines = content.split("\n");
  const trimmedLines = lines.map((line) => line.trim());
  while (
    trimmedLines.length > 0 &&
    trimmedLines[trimmedLines.length - 1] === ""
  ) {
    trimmedLines.pop();
  }
  return trimmedLines.join("\n");
};