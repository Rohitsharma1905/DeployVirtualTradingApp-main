// // hooks/useUserStats.js
// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchUserStats } from '../redux/User/userDashboardSlice';
// import { selectCurrentUser } from '../redux/User/authSlice';
// const user = JSON.parse(localStorage.getItem('user'));
// const userId = user?._id;
// console.log(userId);
// console.log(selectCurrentUser);




// export const useUserStats = () => {
//   // const users = useSelector((state) => state.user.auth.user);
//   // console.log(users);
  
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(fetchUserStats(userId));
//   }, [dispatch]);

//   return {
//     refetch: () => dispatch(fetchUserStats(userId))
//   };
// };


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats } from '../redux/User/userDashboardSlice'; // Action to fetch
import { selectCurrentUser } from '../redux/User/authSlice'; // Selector for logged-in user

// Remove module-level localStorage access for userId

export const useUserStats = () => {
  const dispatch = useDispatch();

  // --- Get the current user reliably from Redux state ---
  const currentUser = useSelector(selectCurrentUser);
  const userId = currentUser?._id; // Get userId from the Redux state user

  // --- Effect to fetch data when userId changes ---
  useEffect(() => {
    // Only fetch if we have a valid userId
    if (userId) {
      console.log('useUserStats: Fetching stats for userId:', userId);
      dispatch(fetchUserStats(userId));
    } else {
      console.log('useUserStats: No userId found, skipping fetch.');
      // Optional: You might want to dispatch an action here to clear
      // existing stats if the user logs out.
      // dispatch(clearUserStats());
    }
    // --- Add userId to the dependency array ---
  }, [dispatch, userId]); // Re-run when dispatch or userId changes

  // --- Refetch function using the current userId ---
  const refetch = () => {
    // Use the userId derived from the current Redux state
    if (userId) {
      console.log('useUserStats: Refetching stats for userId:', userId);
      dispatch(fetchUserStats(userId));
    } else {
       console.warn('useUserStats: Cannot refetch, no userId found.');
    }
  };

  // --- IMPORTANT ---
  // This hook triggers the fetch. To get the *actual data*, the component
  // using this hook needs to use useSelector with a selector for the userDashboardSlice.
  // Example in your component:
  // const { stats, loading, error } = useSelector((state) => state.userDashboard); // Adjust 'userDashboard' to your actual slice name
  // const { refetch } = useUserStats();

  return {
    refetch // Return the refetch capability
  };
};