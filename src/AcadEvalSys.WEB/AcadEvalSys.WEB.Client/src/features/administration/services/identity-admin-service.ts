import { api } from "@infrastructure/query/axios";
import { PagedResult } from "@infrastructure/api/types/paged-result";

const IDENTITY_API_URL = "/identity";

export interface UserListItem {
  id: string;
  email: string;
  name: string;
  phone?: string;
  roles: string[];
  isLockedOut: boolean;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface UpdateAdminRequest {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface GetUsersParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  role?: string;
}

export const identityAdminService = {
  getUsers: async (
    params: GetUsersParams = {}
  ): Promise<PagedResult<UserListItem>> => {
    const searchParams = new URLSearchParams();

    if (params.pageNumber)
      searchParams.append("pageNumber", params.pageNumber.toString());
    if (params.pageSize)
      searchParams.append("pageSize", params.pageSize.toString());
    if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
    if (params.role) searchParams.append("role", params.role);

    const queryString = searchParams.toString();
    const url = queryString
      ? `${IDENTITY_API_URL}/users?${queryString}`
      : `${IDENTITY_API_URL}/users`;

    const { data } = await api.get<PagedResult<UserListItem>>(url);
    return data;
  },

  getAdmins: async (
    params: Omit<GetUsersParams, "role"> = {}
  ): Promise<PagedResult<UserListItem>> => {
    return identityAdminService.getUsers({ ...params, role: "Admin" });
  },

  getAllUsers: async (
    params: Omit<GetUsersParams, "role"> = {}
  ): Promise<PagedResult<UserListItem>> => {
    return identityAdminService.getUsers(params);
  },

  createAdmin: async (request: CreateAdminRequest): Promise<string> => {
    const { data } = await api.post<{ id: string }>(
      `${IDENTITY_API_URL}/admins`,
      request
    );
    return data.id;
  },

  updateAdmin: async (request: UpdateAdminRequest): Promise<void> => {
    await api.put(`${IDENTITY_API_URL}/admins/${request.id}`, {
      name: request.name,
      email: request.email,
      password: request.password,
    });
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`${IDENTITY_API_URL}/admins/${id}`);
  },
};
