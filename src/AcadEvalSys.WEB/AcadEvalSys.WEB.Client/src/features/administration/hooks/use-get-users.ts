import { useQuery } from "@tanstack/react-query";
import { identityAdminService } from "../services/identity-admin-service";

export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: () => [...usersKeys.lists()] as const,
};

export const useGetUsers = () => {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: () => identityAdminService.getUsers({ pageSize: 1000, role: "Professor" }), // Solo profesores
  });
};
