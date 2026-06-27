import { renderStampSvg, type StampDesign } from "./stamp-design.js";

export const stampSvgBlob = (design: StampDesign): Blob =>
  new Blob([renderStampSvg(design)], {
    type: "image/svg+xml;charset=utf-8",
  });

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const downloadStampSvg = (
  design: StampDesign,
  filename = "stampy.svg",
): void => {
  downloadBlob(stampSvgBlob(design), filename);
};

export const stampPngBlob = async (
  design: StampDesign,
  size = 1024,
): Promise<Blob> => {
  const svg = renderStampSvg(design);
  const url = URL.createObjectURL(
    new Blob([svg], { type: "image/svg+xml;charset=utf-8" }),
  );
  const image = new Image();
  image.decoding = "async";
  image.src = url;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context is not available.");

  context.clearRect(0, 0, size, size);
  context.drawImage(image, 0, 0, size, size);
  URL.revokeObjectURL(url);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );
  if (!blob) throw new Error("PNG export failed.");
  return blob;
};

export const downloadStampPng = async (
  design: StampDesign,
  filename = "stampy.png",
  size?: number,
): Promise<void> => {
  downloadBlob(await stampPngBlob(design, size), filename);
};
