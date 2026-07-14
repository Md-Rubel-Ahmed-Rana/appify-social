const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

export const calculatePageSize = (limit?: number) => {
  const value = Number(limit ?? DEFAULT_PAGE_SIZE);

  if (!Number.isFinite(value)) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.max(1, Math.min(value, MAX_PAGE_SIZE));
};
