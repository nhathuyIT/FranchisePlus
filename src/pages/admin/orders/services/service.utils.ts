type RawRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is RawRecord =>
  typeof value === "object" && value !== null;

export const toStringValue = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }

  return "";
};

export const toNumberValue = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return 0;
};

export const toBooleanValue = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === "boolean") {
      return value;
    }
  }

  return false;
};

export const toRecord = (value: unknown) => (isRecord(value) ? value : null);

export const extractArray = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const record = toRecord(payload);
  if (!record) {
    return [];
  }

  if (Array.isArray(record.items)) {
    return record.items;
  }

  if (Array.isArray(record.orders)) {
    return record.orders;
  }

  if (Array.isArray(record.pageData)) {
    return record.pageData;
  }

  if (Array.isArray(record.data)) {
    return record.data;
  }

  return [];
};

export const extractSingle = (payload: unknown) => {
  const record = toRecord(payload);
  if (!record) {
    return payload;
  }

  if (record.order) {
    return record.order;
  }

  if (record.item) {
    return record.item;
  }

  if (record.delivery) {
    return record.delivery;
  }

  if (record.payment) {
    return record.payment;
  }

  return payload;
};
