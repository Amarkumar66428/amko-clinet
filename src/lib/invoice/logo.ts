const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
// 3x the largest size a template draws the logo at (160 x 44 pt), so it stays crisp when printed.
const MAX_WIDTH = 480;
const MAX_HEIGHT = 240;

export class LogoError extends Error {}

/**
 * Validates an uploaded logo and re-encodes it as a small PNG data URL. Re-encoding strips metadata,
 * bounds the size kept in localStorage, and converts WebP/SVG into a format react-pdf can embed.
 */
export async function processLogo(file: File): Promise<string> {
  if (!ACCEPTED_TYPES.includes(file.type)) throw new LogoError("Use a PNG, JPEG, WebP or SVG image.");
  if (file.size > MAX_UPLOAD_BYTES) throw new LogoError("Logo must be smaller than 5 MB.");

  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode().catch(() => {
      throw new LogoError("That image could not be read.");
    });

    const width = image.naturalWidth || MAX_WIDTH;
    const height = image.naturalHeight || MAX_HEIGHT;
    const scale = Math.min(1, MAX_WIDTH / width, MAX_HEIGHT / height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new LogoError("Your browser could not process the image.");
    context.imageSmoothingQuality = "high";
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
