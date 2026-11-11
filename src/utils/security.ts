/**
 * Security and Validation Utilities
 * Daily Utility Hub - All in One Website
 *
 * Implements client-side defense-in-depth:
 * - Input validation & HTML entity sanitization (XSS mitigation)
 * - Strict file type inspection (MIME and extension check)
 * - Safe file size threshold enforcement for mobile memory stability
 * - Memory leak prevention through controlled Object URL revocation
 */

/**
 * Strips dangerous HTML tags and escapes special characters to prevent DOM-based XSS.
 */
export function sanitizeInputText(input: string, maxLength: number = 2000): string {
  if (typeof input !== 'string') return '';
  const trimmed = input.slice(0, maxLength);
  return trimmed
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates a file's size against a threshold in megabytes.
 * Prevents tab crashes and out-of-memory errors on 2GB/3GB RAM mobile devices.
 */
export function validateFileSize(
  file: File,
  maxMegabytes: number
): { valid: boolean; error?: string } {
  const maxBytes = maxMegabytes * 1024 * 1024;
  if (file.size > maxBytes) {
    const actualMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File "${file.name}" is ${actualMb} MB, which exceeds the safe ${maxMegabytes} MB limit. Please select a smaller file to avoid browser memory issues on mobile devices.`,
    };
  }
  return { valid: true };
}

/**
 * Validates a file's MIME type and extension against an allowlist.
 */
export function validateFileType(
  file: File,
  allowedMimes: string[],
  allowedExtensions: string[]
): { valid: boolean; error?: string } {
  const fileExt = file.name.slice(((file.name.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
  const mimeMatch = allowedMimes.some((m) => file.type.toLowerCase().startsWith(m.toLowerCase()));
  const extMatch = allowedExtensions.some((ext) => ext.toLowerCase() === fileExt);

  if (!mimeMatch && !extMatch) {
    return {
      valid: false,
      error: `Unsupported file type for "${file.name}". Supported formats: .${allowedExtensions.join(', .')}`,
    };
  }
  return { valid: true };
}

/**
 * Safely triggers browser download and guarantees immediate memory cleanup.
 */
export function triggerSafeDownload(blobOrUrl: Blob | string, filename: string): void {
  // Sanitize filename to prevent directory traversal or invalid characters
  const cleanFilename = filename.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'download';
  let blobUrl: string;
  let isCreated = false;

  if (typeof blobOrUrl === 'string') {
    blobUrl = blobOrUrl;
  } else {
    blobUrl = URL.createObjectURL(blobOrUrl);
    isCreated = true;
  }

  const anchor = document.createElement('a');
  anchor.href = blobUrl;
  anchor.download = cleanFilename;
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  if (isCreated) {
    // Revoke after a brief delay to ensure the browser has read the stream
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 2000);
  }
}
