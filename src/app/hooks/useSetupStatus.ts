import { useQuery } from "@tanstack/react-query";
import { organizationApi } from "../lib/api";

export const fetchSetupStatus = async (organizationId: string) => {
  const res = await organizationApi.getOrganization(organizationId);
  return res.data?.is_active ?? false;
};

export const useSetupStatus = (organizationId: string) => {
  return useQuery({
    queryKey: ["setup-status", organizationId],
    queryFn: () => fetchSetupStatus(organizationId),
  });
};
