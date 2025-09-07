import { api } from "@infrastructure/query/axios";
import { PagedResult } from "@infrastructure/api/types/common";

const ADMIN_API_URL = "/identity/admin";

export interface UserListItem {
  id: string;
  email: string;
  roles: string[];
  isLockedOut: boolean;
}

export const getUsers = async (): Promise<PagedResult<UserListItem>> => {
  const { data } = await api.get<PagedResult<UserListItem>>(
    `${ADMIN_API_URL}/users`
  );
  return data;
};
