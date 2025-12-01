import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

export function useQueryParams<T extends Record<string, string> = any>() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result as T;
  }, [location.search]);

  // Hàm để set/update query param
  const setQueryParams = useCallback(
    (newParams: Record<string, string | number | undefined>) => {
      const searchParams = new URLSearchParams(location.search);

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, String(value));
        }
      });

      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    },
    [location.pathname, location.search, navigate],
  );

  const clearQueryParams = useCallback(() => {
    navigate(location.pathname, { replace: true });
  }, [navigate, location.pathname]);

  return {
    queryParams,
    setQueryParams,
    clearQueryParams,
  };
}
