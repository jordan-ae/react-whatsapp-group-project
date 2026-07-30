import { useState, useEffect, useCallback } from 'react';
import { mockFetch } from '../utils/mockFetch';

export function useApi(url, immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (overrideUrl) => {
    setLoading(true);
    setError(null);
    try {
      const result = await mockFetch(overrideUrl || url);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  const refetch = useCallback(() => execute(), [execute]);

  return { data, loading, error, refetch };
}
