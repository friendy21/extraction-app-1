import { useQuery } from "@tanstack/react-query";
import { connectionsApi } from "../lib/api";
import { DataSourceConfig } from "../lib/database-types";

export const useConnections = (organizationId: string) => {
  return useQuery<DataSourceConfig[]>({
    queryKey: ["connections", organizationId],
    queryFn: async () => {
      const res = await connectionsApi.getConnections(organizationId);
      return res.data || [];
    },
  });
};
