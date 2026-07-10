import { SortOrder } from "mongoose";

type IOptions = {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: SortOrder;
};

type IReturnOptions = {
  page: number;
  limit: number;
  skip: number;
  sort_by: string;
  sort_order: SortOrder;
};

const calculatePagination = (options: IOptions): IReturnOptions => {
  const page = Number(options?.page || 1);
  const limit = Number(options?.limit || 10);
  const sortBy = options.sort_by || "createdAt";
  const sortOrder = options.sort_order || "desc";

  const skip = (page - 1) * limit;
  return {
    page,
    limit,
    skip,
    sort_by: sortBy,
    sort_order: sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
