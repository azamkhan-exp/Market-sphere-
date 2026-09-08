export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateImageFile(file: {
  name: string;
  size: number;
  type: string;
}): FileValidationResult {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  // 1. File size check
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB)`,
    };
  }

  // 2. MIME type check
  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file MIME type: ${file.type}. Allowed formats: JPEG, PNG, WebP, SVG, GIF.`,
    };
  }

  // 3. Extension verification
  const lowerName = file.name.toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  if (!hasValidExt) {
    return {
      valid: false,
      error: "File extension does not match allowed image formats.",
    };
  }

  // 4. Reject dangerous or dual extensions (.php.jpg, .exe.png, etc.)
  const suspiciousExtensions = [".exe", ".bat", ".sh", ".php", ".js", ".html", ".py", ".vbs"];
  for (const sus of suspiciousExtensions) {
    if (lowerName.includes(sus)) {
      return {
        valid: false,
        error: "File contains suspicious or potentially unsafe naming patterns.",
      };
    }
  }

  return { valid: true };
}
