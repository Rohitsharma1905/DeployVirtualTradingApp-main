// hooks/usePageTransition.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    // Start transition
    dispatch({ type: 'global/setPageTransitioning', payload: true });

    // Cleanup function
    return () => {
      dispatch({ type: 'global/setPageTransitioning', payload: false });
    };
  }, [location.pathname]);
};