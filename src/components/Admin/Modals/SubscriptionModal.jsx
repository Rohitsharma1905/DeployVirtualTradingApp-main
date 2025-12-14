import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Loader from '../../Common/Loader';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationModal from './ConformationModal';
import { BASE_API_URL } from '../../../utils/BaseUrl';
import subscriptionData from '../../../data/subscriptionPlans.json';
import {
  createSubscription,
  updateSubscription,
  getUserSubscriptions,
  cancelSubscription,
  selectLoading,
  selectError,
  selectUserSubscriptions,
} from '../../../redux/User/userSubscriptionPlan/userSubscriptionPlansSlice';
import { fetchHoldings } from '../../../redux/User/trading/tradingSlice';

// Utility function for date calculation
const calculateEndDate = (startDate, duration) => {
  if (!startDate || !duration) return '';

  const date = new Date(startDate);
  switch (duration) {
    case '1 Month':
      date.setMonth(date.getMonth() + 1);
      break;
    case '3 Months':
      date.setMonth(date.getMonth() + 3);
      break;
    case '6 Months':
      date.setMonth(date.getMonth() + 6);
      break;
    default:
      return '';
  }
  return date.toISOString().split('T')[0];
};

// Plan configurations
const PLAN_CONFIGS = subscriptionData.configs;

const SubscriptionModal = ({ isOpen, onClose, selectedUser, onSuccess, isGuestUser = false }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const userSubscriptions = useSelector(selectUserSubscriptions);

  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showPaymentUI, setShowPaymentUI] = useState(false);

  // Use selectedUser
  const activePlan = userSubscriptions?.find(
    (plan) => plan.status === 'Active' && !plan.isDeleted
  );

  const validationSchema = Yup.object().shape({
    plan: Yup.string()
      .required('Plan is required')
      .oneOf(['Gold', 'Silver', 'Platinum', 'Diamond']),
    vertualAmount: Yup.number()
      .required('Amount is required')
      .positive('Amount must be positive'),
    planPrice: Yup.number()
      .required('Plan price is required')
      .positive('Plan price must be positive'),
    duration: Yup.string()
      .required('Duration is required')
      .oneOf(['1 Month', '3 Months', '6 Months']),
    startDate: Yup.date()
      .required('Start date is required')
      .min(new Date(), 'Start date cannot be in the past'),
    endDate: Yup.date().required('End date is required'),
    tradingPreference: Yup.string()
      .required('Trading preference is required')
      .oneOf(['Market Hours', 'Off-Market Hours']),
  });

  const formik = useFormik({
    initialValues: {
      plan: activePlan?.plan || '',
      vertualAmount: activePlan?.vertualAmount || '',
      planPrice: activePlan?.planPrice || '',
      duration: activePlan?.duration || '',
      startDate: activePlan?.startDate
        ? new Date(activePlan.startDate).toISOString().split('T')[0]
        : '',
      endDate: activePlan?.endDate
        ? new Date(activePlan.endDate).toISOString().split('T')[0]
        : '',
      tradingPreference: activePlan?.tradingPreference || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const subscriptionData = {
          ...values,
          userId: selectedUser._id,
        };

        if (activePlan) {
          const result = await dispatch(
            updateSubscription({
              id: activePlan._id,
              updateData: subscriptionData,
            })
          ).unwrap();

          if (result) {
            setIsEditing(false);
            onSuccess?.();
            dispatch(getUserSubscriptions(selectedUser._id));
          }
        } else {
          // Show payment UI for new subscriptions
          setShowPaymentUI(true);
          initializeRazorpay();
        }
      } catch (error) {
        toast.error(error.message || 'Failed to process subscription');
      }
    },
  });

  useEffect(() => {
    if (isOpen && selectedUser?._id) {
      dispatch(getUserSubscriptions(selectedUser._id))
        .unwrap()
        .then((response) => {
          console.log('Subscription data received:', response);
        })
        .catch((error) => {
          console.error('Error fetching subscriptions:', error);
          toast.error('Failed to fetch subscription details');
        });
    }
  }, [dispatch, isOpen, selectedUser]);

  useEffect(() => {
    if (formik.values.startDate && formik.values.duration) {
      const calculatedEndDate = calculateEndDate(
        formik.values.startDate,
        formik.values.duration
      );
      formik.setFieldValue('endDate', calculatedEndDate);
    }
  }, [formik.values.startDate, formik.values.duration]);

  useEffect(() => {
    if (formik.values.plan) {
      const planConfig = PLAN_CONFIGS[formik.values.plan];
      formik.setFieldValue('vertualAmount', planConfig.vertualAmount);
      formik.setFieldValue('tradingPreference', planConfig.tradingPreference);

      // Calculate plan price based on duration
      const basePrice = planConfig.planPrice;
      let priceMultiplier = 1;
      switch (formik.values.duration) {
        case '1 Month':
          priceMultiplier = 1;
          break;
        case '3 Months':
          priceMultiplier = 3;
          break;
        case '6 Months':
          priceMultiplier = 6;
          break;
        default:
          priceMultiplier = 1;
      }
      formik.setFieldValue('planPrice', basePrice * priceMultiplier);
    }
  }, [formik.values.plan, formik.values.duration]);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };


  const handlePayment = async () => {
    try {
      // Validate all required fields exist
      if (!selectedUser?._id) {
        throw new Error("User information is missing");
      }

      if (!formik.values.planPrice || !formik.values.plan || !formik.values.duration) {
        throw new Error("Please complete all subscription details before payment");
      }

      // Prepare the complete subscription data
      const subscriptionData = {
        plan: formik.values.plan,
        vertualAmount: formik.values.vertualAmount,
        planPrice: formik.values.planPrice,
        duration: formik.values.duration,
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        tradingPreference: formik.values.tradingPreference,
        userId: selectedUser._id // Include userId in subscription data
      };

      console.log("Creating order with:", {
        userId: selectedUser._id,
        amount: formik.values.planPrice,
        subscriptionData
      });

      // Create the order
      const orderResponse = await fetch(`${BASE_API_URL}/user/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add if using auth
        },
        body: JSON.stringify({
          userId: selectedUser._id,
          amount: formik.values.planPrice,
          subscriptionData: subscriptionData
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        console.error("Order creation failed:", errorData);
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();
      console.log("Order created:", orderData);

      if (!orderData.success || !orderData.order) {
        throw new Error(orderData.message || 'Invalid order data received');
      }

      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_Wro7XGWFjBE5VK', // Your test key
        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Your Project Name',
        description: `${formik.values.plan} Subscription Plan`,
        image: '/logo.png', // Your logo
        order_id: orderData.order.id,
        method: {
          netbanking: false,
          wallet: true,
          card: true,
          upi: true,
          emi: false,    // Disable EMI
          paylater: false,
        },
        handler: async function (response) {
          console.log("Payment completed, verifying...", response);
          try {
            // Verify payment on server
            const verificationResponse = await fetch(`${BASE_API_URL}/user/payment/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: orderData.paymentId, // From create-order response
                subscriptionData: subscriptionData,
                userId: selectedUser._id
              }),
            });

            if (!verificationResponse.ok) {
              const errorData = await verificationResponse.json();
              console.error("Verification failed:", errorData);
              throw new Error(errorData.message || 'Payment verification failed');
            }

            const verificationData = await verificationResponse.json();
            console.log("Verification result:", verificationData);

            if (verificationData.success) {
              toast.success('Payment successful! Subscription created.');
              onSuccess?.();
              onClose();
              dispatch(getUserSubscriptions(selectedUser._id));
            } else {
              throw new Error(verificationData.message || 'Payment verification failed');
            }
          } catch (verificationError) {
            console.error("Verification error:", verificationError);
            toast.error(verificationError.message || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: selectedUser.name,
          email: selectedUser.email,
          contact: selectedUser.phone || '',
        },
        notes: {
          userId: selectedUser._id,
          plan: formik.values.plan
        },
        theme: {
          color: '#3399cc',
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal dismissed");
            toast.error("Payment was cancelled or failed");
          }
        }
      };

      console.log("Opening Razorpay with options:", options);
      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');

      // Optional: Update payment status to failed in your backend
      try {
        await fetch(`${BASE_API_URL}/user/payment/update-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: 'Failed',
            error: error.message
          })
        });
      } catch (statusUpdateError) {
        console.error("Failed to update payment status:", statusUpdateError);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(cancelSubscription(activePlan._id)).unwrap();
      setShowConfirmDelete(false);
      toast.success('Subscription cancelled successfully');
      onSuccess?.();
      dispatch(getUserSubscriptions(selectedUser._id));
    } catch (error) {
      toast.error(error.message || 'Failed to cancel subscription');
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!isOpen) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getPlanStyle = (plan) => {
    return PLAN_CONFIGS[plan] || {
      bgLight: 'bg-gray-100',
      textColor: 'text-gray-800',
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-900 opacity-50"></div>

      <div
        style={{
          width: '80%',
          maxWidth: '85%',
          maxHeight: '95vh',
          borderRadius: '1rem',
          clipPath: 'inset(0 0 0 0 round 1rem)',
        }}
        // className="relative hello w-full max-w-5xl mx-auto my-8 bg-white rounded-2xl shadow-2xl flex flex-col"
        className={`relative hello w-full max-w-5xl mx-auto my-8 bg-white rounded-2xl shadow-2xl flex flex-col  ${isGuestUser ? 'mt-60' : 'mt-0'}`}

      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-lightBlue-50 to-lightBlue-100 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-lightBlue-600 rounded-xl flex items-center justify-center shadow-lg">
              <i className="fas fa-credit-card text-white text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {activePlan ? 'Subscription Details' : 'New Subscription'}
              </h2>
              <p className="text-sm text-gray-600">
                Manage subscription plan details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-xl transition-all duration-200"
          >
            <i className="fas fa-times text-gray-500 text-xl"></i>
          </button>
        </div>

        <div className="overflow-y-auto px-6 flex-1 pb-[100px]">
          {/* User Info */}
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div
                className={`w-16 h-16 ${activePlan ? getPlanStyle(activePlan.plan).bgLight : 'bg-lightBlue-100'
                  } rounded-full flex items-center justify-center shadow-md`}
              >
                <span
                  className={`text-2xl font-bold ${activePlan ? getPlanStyle(activePlan.plan).textColor : 'text-lightBlue-600'
                    }`}
                >
                  {selectedUser?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedUser?.name}
                </h3>
                <p className="text-gray-600">{selectedUser?.email}</p>
                {activePlan && (
                  <div className="mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getPlanStyle(activePlan.plan).bgLight
                        } ${getPlanStyle(activePlan.plan).textColor} shadow-sm`}
                    >
                      {activePlan.plan} Plan
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subscription Content */}
          <div className="p-6">
            {!activePlan && !isEditing ? (
              // No Active Plan View
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <i className="fas fa-plus text-gray-400 text-3xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Active Subscription
                </h3>
                <p className="text-gray-600 mb-6">
                  Create a new subscription plan to start trading
                </p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-8 py-4 bg-lightBlue-600 text-white rounded-xl hover:bg-lightBlue-700 transition-all duration-200 shadow-lg"
                >
                  <i className="fas fa-plus-circle mr-2"></i>
                  Create New Subscription
                </button>
              </div>
            ) : !isEditing ? (
              // View Mode - Active Plan Details
              <div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-lightBlue-50 to-lightBlue-100 p-6 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-lightBlue-800">
                          Active Plan Details
                        </h3>
                        <p className="text-lightBlue-600 mt-1">
                          Current subscription information
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Plan Details Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Plan Type */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Plan Type
                      </p>
                      <div className="flex items-center">
                        <span
                          className={`w-3 h-3 rounded-full  ${getPlanStyle(activePlan?.plan).color
                            } mr-2`}
                        ></span>
                        <p className="text-xl font-bold text-gray-800">
                          {activePlan?.plan}
                        </p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className=" p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Virtual Trading Amount
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{activePlan?.vertualAmount?.toLocaleString()}
                      </p>
                    </div>

                    {/* Plan Price */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Plan Price
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        ₹{activePlan?.planPrice?.toLocaleString()}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Duration
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {activePlan?.duration}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Status
                      </p>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                          activePlan?.status
                        )}`}
                      >
                        {activePlan?.status}
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Start Date
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatDate(activePlan?.startDate)}
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        End Date
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {formatDate(activePlan?.endDate)}
                      </p>
                    </div>

                    {/* Trading Preference */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Trading Preference
                      </p>
                      <p className="text-xl font-bold text-gray-800">
                        {activePlan?.tradingPreference}
                      </p>
                    </div>
                  </div>


                  {/* Edit and Cancel Buttons */}
                  <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 mx-4 rounded-xl bg-yellow-500 text-white hover:bg-yellow-600 transition-all duration-200 shadow-sm"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit Plan
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-sm"
                    >
                      <i className="fas fa-trash-alt mr-2"></i>
                      Cancel Plan
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Edit/Create Form
              <form onSubmit={formik.handleSubmit} className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 gap-8">
                  {/* Form fields */}
                  <div className="col-span-2 bg-lightBlue-50 p-4 rounded-xl mb-6">
                    <p className="text-lightBlue-800">
                      <i className="fas fa-info-circle mr-2"></i>
                      Select a plan and duration. The virtual trading amount will be
                      automatically set based on the plan.
                    </p>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="plan"
                      {...formik.getFieldProps('plan')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-500 focus:ring-2 focus:ring-lightBlue-500/20 transition-all duration-200"
                    >
                      <option value="">Select Plan</option>
                      {Object.keys(PLAN_CONFIGS).map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                    {formik.touched.plan && formik.errors.plan && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.plan}
                      </p>
                    )}
                  </div>

                  {/* Amount (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Virtual Trading Amount
                    </label>
                    <input
                      type="text"
                      value={
                        formik.values.vertualAmount
                          ? `₹${parseInt(formik.values.vertualAmount).toLocaleString()}`
                          : ''
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                      readOnly
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Amount is set based on the selected plan
                    </p>
                  </div>

                  {/* Plan Price (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plan Price
                    </label>
                    <input
                      type="text"
                      value={
                        formik.values.planPrice
                          ? `₹${parseInt(formik.values.planPrice).toLocaleString()}`
                          : ''
                      }
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                      readOnly
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Price is set based on the selected plan and duration
                    </p>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="duration"
                      {...formik.getFieldProps('duration')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-500 focus:ring-2 focus:ring-lightBlue-500/20 transition-all duration-200"
                    >
                      <option value="">Select Duration</option>
                      <option value="1 Month">1 Month</option>
                      <option value="3 Months">3 Months</option>
                      <option value="6 Months">6 Months</option>
                    </select>
                    {formik.touched.duration && formik.errors.duration && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.duration}
                      </p>
                    )}
                  </div>

                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      {...formik.getFieldProps('startDate')}
                      min={new Date().toISOString().split('T')[0]} // added so that plan start date cannot be in past
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-lightBlue-500 focus:ring-2 focus:ring-lightBlue-500/20 transition-all duration-200"
                    />
                    {formik.touched.startDate && formik.errors.startDate && (
                      <p className="mt-1 text-sm text-red-500">
                        {formik.errors.startDate}
                      </p>
                    )}
                  </div>

                  {/* End Date (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formik.values.endDate}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Automatically calculated based on duration
                    </p>
                  </div>

                  {/* Trading Preference (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trading Preference
                    </label>
                    <input
                      type="text"
                      value={formik.values.tradingPreference}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 cursor-not-allowed"
                      disabled
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Automatically set based on the selected plan
                    </p>
                  </div>
                </div>

                {/* Payment Button */}
                {showPaymentUI && (
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handlePayment}
                      className="w-full px-6 py-4 bg-lightBlue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg"
                    >
                      <i className="fas fa-lock mr-2"></i>
                      Pay ₹{formik.values.planPrice} with Razorpay
                    </button>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Secure payment powered by Razorpay
                    </p>
                  </div>
                )}


                {/* Form Actions */}
                {/* <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setShowPaymentUI(false);
                  }}
                  className="px-6 py-3 mx-4 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  Cancel
                </button>
                {!showPaymentUI && (
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 transition-all duration-200 shadow-lg"
                  >
                    {activePlan ? 'Update Subscription' : 'Proceed to Payment'}
                  </button>
                )}
              </div> */}
                <div className="fixed bottom-8 left-0 right-0 w-full  bg-white  border-t border-gray-200 p-4 shadow-lg z-50 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowPaymentUI(false);
                    }}
                    className="px-6 py-3 mr-35 mx-4 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  {!showPaymentUI && (
                    <button
                      type="submit"
                      className="px-6 py-3 mr-40 rounded-xl bg-lightBlue-600 text-white hover:bg-lightBlue-700 transition-all duration-200 shadow-lg"
                    >
                      {activePlan ? 'Update Subscription' : 'Proceed to Payment'}
                    </button>
                  )}
                </div>


              </form>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel the ${activePlan?.plan} subscription plan? This action cannot be undone.`}
      />
    </div>
  );
};

// PropTypes
SubscriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUser: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
};

export default SubscriptionModal;