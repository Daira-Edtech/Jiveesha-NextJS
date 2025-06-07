import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchChildren = async () => {
  const response = await fetch('/api/getChildrenByTeacher');
  if (!response.ok) {
    throw new Error('Failed to fetch children');
  }
  return response.json();
};

const fetchChild = async (childId) => {
  const response = await fetch(`/api/getChild?childId=${childId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch child');
  }
  return response.json();
};

const addChild = async (childData) => {
  const response = await fetch('/api/addChild', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(childData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to add child');
  }
  return response.json();
};

export const useChildren = () => {
  return useQuery({
    queryKey: ['children'],
    queryFn: fetchChildren,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useChild = (childId) => {
  return useQuery({
    queryKey: ['child', childId],
    queryFn: () => fetchChild(childId),
    enabled: !!childId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAddChild = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: addChild,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['children'] });
    },
  });
};
