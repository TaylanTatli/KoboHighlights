export const removeTrailingEmptyLine = (content: string): string => {
  const lines = content.split("\n");

  while (lines.length > 0 && lines[0].trim() === "") {
    lines.shift();
  }

  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop();
  }

  const trimmedLines = lines.map((line) => line.replace(/^\s+|\s+$/g, ""));

  const normalizedLines = trimmedLines.map((line) => {
    if (line.length > 0 && line[0] === line[0].toLowerCase()) {
      return line[0].toLocaleUpperCase() + line.slice(1);
    }
    return line;
  });

  return normalizedLines.join("\n");
};
