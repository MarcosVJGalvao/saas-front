const stripQuotes = (value: string): string => {
  const trimmedValue = value.trim();
  if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
    return trimmedValue.slice(1, -1);
  }
  return trimmedValue;
};

const getHeaderParameter = (
  contentDisposition: string,
  parameterName: string,
): string | undefined =>
  contentDisposition
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.toLowerCase().startsWith(`${parameterName.toLowerCase()}=`))
    ?.slice(parameterName.length + 1);

const decodeExtendedFileName = (value: string): string | undefined => {
  const encodedValue = stripQuotes(value);
  const parts = encodedValue.split("''");
  const fileNamePart = parts.length > 1 ? parts[1] : parts[0];
  if (!fileNamePart) return undefined;

  try {
    return decodeURIComponent(fileNamePart);
  } catch {
    return fileNamePart;
  }
};

export const getFileNameFromContentDisposition = (
  contentDisposition: string | undefined,
): string | undefined => {
  if (!contentDisposition) return undefined;

  const extendedFileName = getHeaderParameter(contentDisposition, 'filename*');
  if (extendedFileName) return decodeExtendedFileName(extendedFileName);

  const fileName = getHeaderParameter(contentDisposition, 'filename');
  if (!fileName) return undefined;

  return stripQuotes(fileName);
};
