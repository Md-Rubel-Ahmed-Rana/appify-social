import { SortOrder } from "mongoose";

type IOptions = {
  cursor?: string;
  limit?: number;
  sort_by?: string;
  sort_order?: SortOrder;
};

type IReturnOptions = {
  cursor?: string;
  limit: number;
  sort_by: string;
  sort_order: SortOrder;
};

const calculatePagination = (options: IOptions): IReturnOptions => {
  const limit = Number(options?.limit || 10);
  const sortBy = options.sort_by || "createdAt";
  const sortOrder = options.sort_order || "desc";

  return {
    limit,
    sort_by: sortBy,
    sort_order: sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
