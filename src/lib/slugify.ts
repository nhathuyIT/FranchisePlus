import slugify from "slugify";

// Product slugify functions
export function createProductSlug(name: string, id: number | string): string {
  const slug = slugify(name, {
    lower: true,
    strict: true,
    locale: "vi",
    remove: /[*+~.()'"!:@]/g,
  });
  return `${slug}-${id}`;
}

export function parseProductIdFromSlug(slug: string): string | null {
  if (!slug) return null;
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  
  // Check if last part is a number (ID)
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  
  return null;
}

