// hooks/useOrganizationDashboard.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchOrganizationDashboardData } from '../redux/Organization/dashboard/organizationDashboardSlice';

export const useOrganizationDashboard = (refreshDependency=null) => {
  const dispatch = useDispatch();
  const orgName = localStorage.getItem('orgName');

  useEffect(() => {
    if (orgName) {
      dispatch(fetchOrganizationDashboardData(orgName));
    }
  }, [dispatch, orgName, refreshDependency]);
};