export const removeTrailingEmptyLine = (content: string): string => {
  const lines = content.split("\n");

  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  const cleanedLines = lines.map((line) => line.replace(/^\s+|\s+$/g, ""));

  return cleanedLines.join("\n");
};
