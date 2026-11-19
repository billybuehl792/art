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

export const urlToFile = async (url: string): Promise<File> => {
  const response = await fetch(url);

  if (!response.ok) throw new Error("Failed to fetch image");

  const blob = await response.blob();

  return new File([blob], url.split("/").pop() ?? "image", {
    type: blob.type,
  });
};

export const isSameFile = (f1: File, f2: File) => {
  return f1.name === f2.name && f1.size === f2.size && f1.type === f2.type;
};
