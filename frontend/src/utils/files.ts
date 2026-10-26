export const downloadFile = async (url: string, filename: string) => {
  const response = await fetch(url);

  if (!response.ok)
    throw new Error(`Failed to download file: ${response.status}`);

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(blobUrl);
};
