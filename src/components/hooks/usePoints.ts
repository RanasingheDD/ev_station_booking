import { useState, useEffect, useCallback } from 'react';
import { fetchUserPoints } from '../../services/account_service';

export const usePoints = () => {
  const [points, setPoints] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPoints = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUserPoints();
      setPoints(data.points);
    } catch (error) {
      console.error("Error fetching points:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPoints();
  }, [loadPoints]);

  return { points, loading, refreshPoints: loadPoints };
};