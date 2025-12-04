import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axios';

export function useItemQuery(id: string | number) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      const { data } = await api.get(`/item/${id}`);
      return data.item;
    },
    enabled: !!id,
  });
}

export function useUpdateItemMutation(id: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: any) => {
      const { data } = await api.put(`/item/${id}`, body);
      return data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
  });
}

export function useToggleSafeDeleteMutation(id: string | number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (active: boolean) => {
      const { data } = await api.patch(`/item/${id}`, { safe_delete: active });
      return data.item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['item', id] });
    },
  });
}
