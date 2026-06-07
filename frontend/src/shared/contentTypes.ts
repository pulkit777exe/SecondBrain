export const CONTENT_TYPES = [
  "youtube",
  "twitter",
  "instagram",
  "reddit",
  "github",
  "linkedin",
  "spotify",
  "soundcloud",
  "loom",
  "other",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];
