import slugify from "slugify";

// Product slugify functions
export function createProductSlug(name: string, id?: number | string): string {
  const slug = slugify(name, {
    lower: true,
    strict: true,
    locale: "vi",
    remove: /[*+~.()'"!:@]/g,
  });
  return id ? `${slug}-${id}` : slug;
}

export function parseProductIdFromSlug(slug: string): string | null {
  if (!slug) return null;
  const parts = slug.split("-");
  const lastPart = parts[parts.length - 1];
  
  if (/^\d+$/.test(lastPart)) {
    return lastPart;
  }
  
  return null;
}

