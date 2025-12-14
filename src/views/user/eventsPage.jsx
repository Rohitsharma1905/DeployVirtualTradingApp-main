import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BASE_API_URL } from '../../utils/BaseUrl';
import { 
  selectCurrentUser,
  selectIsAuthenticated 
} from '../../redux/User/authSlice';
import { fetchEvents, selectEvents, selectEventsStatus } from '../../redux/Admin/EventManage/eventSlice';
import {
  Calendar,
  Clock,
  Trophy,
  Gift,
  Users,
  Star,
  ArrowRight,
  Info,
  Medal,
  Zap,
  Award,
  TrendingUp,
  Shield,
  BadgeCheck,
  DollarSign,
  Coins,
  X,
  Percent,
  ChevronDown,
  BarChart2,
  Plus,
  Edit,
  Trash2,
  IndianRupee 
} from 'lucide-react';

// Shared icon component function
const getIconComponent = (iconName, size = 24, className = "") => {
  const icons = {
    Trophy: <Trophy className={`text-lightBlue-600 ${className}`} size={size} />,
    Medal: <Medal className={`text-yellow-500 ${className}`} size={size} />,
    Gift: <Gift className={`text-purple-500 ${className}`} size={size} />,
    Award: <Award className={`text-green-500 ${className}`} size={size} />,
    Star: <Star className={`text-orange-500 ${className}`} size={size} />,
    Zap: <Zap className={`text-red-500 ${className}`} size={size} />,
    Users: <Users className={`text-green-500 ${className}`} size={size} />,
    BarChart2: <BarChart2 className={`text-red-500 ${className}`} size={size} />,
    Coins: <Coins className={`text-amber-500 ${className}`} size={size} />,
    Info: <Info className={`text-lightBlue-600 ${className}`} size={size} />,
  };
  return icons[iconName] || <Trophy className={`text-lightBlue-600 ${className}`} size={size} />;
};

// Event Details Modal Component
const EventDetailsModal = ({ isOpen, onClose, event, onJoin, user }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-2 sm:p-4">
      <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-[95vw] sm:max-w-[80vw] sm:mr-4 md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] max-h-[90vh] mx-2 my-4 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className={`p-2 sm:p-3 rounded-xl ${event.backgroundColor || 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
              {getIconComponent(event.icon, 20, "text-gray-100")}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{event.title}</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center">
                <Shield className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                {event.requirements || 'No requirements specified'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <X className="text-gray-500 w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-1">
          <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Description */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Info className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  Description
                </h3>
                <p className="text-sm sm:text-base text-gray-700">{event.description}</p>
              </div>

              {/* Date & Time */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                  <Calendar className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  Event Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <Clock className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Start Date</p>
                      <p className="text-sm sm:text-base font-medium">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">End Date</p>
                      <p className="text-sm sm:text-base font-medium">
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <Shield className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  Participation Requirements
                </h3>
                <p className="text-sm sm:text-base text-gray-700">{event.requirements || 'No requirements specified'}</p>
              </div>

              {/* Highlight */}
              {event.highlight && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <Zap className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    Event Highlight
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700">{event.highlight}</p>
                </div>
              )}
            </div>

            {/* Right Column - Financial Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Prize Information */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                  <Medal className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  Prize Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Total Prize</p>
                      <p className="text-sm sm:text-base font-medium text-lightBlue-600">{event.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BadgeCheck className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Cashback</p>
                      <p className="text-sm sm:text-base font-medium text-green-600">
                        {event.cashbackPercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <IndianRupee className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Entry Fee</p>
                      <p className="text-sm sm:text-base font-medium">₹{event.entryFee}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Difficulty</p>
                      <p className="text-sm sm:text-base font-medium">{event.difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participation */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                  <Users className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                  Participation Stats
                </h3>
                <div className="flex justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600">Participants:</span>
                  <span className="text-sm sm:text-base font-medium">{event.participants}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-1">
                  <div 
                    className="bg-lightBlue-600 h-2 sm:h-2.5 rounded-full" 
                    style={{ width: `${event.progress}%` }}
                  ></div>
                </div>
                <p className="text-xxs sm:text-xs text-gray-500 text-right">
                  {event.progressText || `${event.progress}% complete`}
                </p>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                <Zap className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                Event Rewards
              </h3>
              <ul className="space-y-2">
                {event.rewards?.filter(r => r.trim() !== '').map((reward, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1.5 mr-2 w-2 h-2 rounded-full bg-lightBlue-600"></div>
                    <span className="text-sm sm:text-base text-gray-700">{reward}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reward Tiers Section */}
          <div className="px-3 sm:px-4 md:px-6 pb-4 sm:pb-6">
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                <Percent className="mr-2 text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
                Performance Reward Tiers
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                {event.rewardTiers?.map((tier, index) => (
                  <li key={index} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center mb-1 sm:mb-2">
                      <span className="inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-2 sm:mr-3">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800 mr-1 sm:mr-2">Tier Name:</span>
                            <span className="text-xs sm:text-sm text-gray-700">{tier.tier}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pl-7 sm:pl-9">
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 mr-1 sm:mr-2">Reward Description:</span>
                      <span className="text-xs sm:text-sm text-gray-600">{tier.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4 flex justify-center">
          <button
            onClick={() => user ? onJoin(event) : toast.error('Please login to join events')}
            className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 transition-colors flex items-center text-sm sm:text-base"
          >
            <ArrowRight className="mr-2 w-4 h-4" /> 
            {event.entryFee > 0 ? `Join for ₹${event.entryFee}` : 'Join Event Now'}
          </button>
        </div>
      </div>
    </div>
  );
};


// Main Events Page Component
const EventsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const events = useSelector(selectEvents);
  const status = useSelector(selectEventsStatus);
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [activeTab, setActiveTab] = useState('ongoing');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
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

  // Initialize Razorpay when component mounts
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Fetch events on component mount
  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  // Handle event joining
  const handleJoinEvent = async (event) => {
    try {
      // Validate event and user
      if (!event) throw new Error("No event selected");
      if (!isAuthenticated) {
        toast.error('Please log in to join events');
        return;
      }

      // Ensure user and user ID exist
      if (!user?._id) {
        toast.error('User authentication failed');
        return;
      }

      // Logging for debugging
      console.log('Joining Event:', {
        eventId: event._id,
        eventTitle: event.title,
        eventFee: event.entryFee,
        userId: user._id,
        userName: user.name
      });

      // Free event registration
      if (event.entryFee <= 0) {
        try {
          const response = await axios.post(
            `${BASE_API_URL}/admin/events/register`, 
            {
              eventId: event._id,
              userId: user._id
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            }
          );
          
          toast.success(`Successfully registered for ${event.title}!`);
          dispatch(fetchEvents());
          return;
        } catch (freeEventError) {
          console.error('Free Event Registration Error:', freeEventError);
          toast.error(freeEventError.response?.data?.message || 'Registration failed');
          return;
        }
      }

      // Paid event registration
      try {
        // First ensure Razorpay is loaded
        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded) {
          throw new Error('Failed to load payment processor');
        }

        const response = await axios.post(
          `${BASE_API_URL}/user/payment/create-event-order`,
          {
            userId: user._id,
            eventId: event._id,
            amount: event.entryFee
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        // Validate response
        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to create event order');
        }

        const { order, paymentId, registrationId } = response.data;

        // Razorpay payment options
        const options = {
          key: 'rzp_test_Wro7XGWFjBE5VK',
          amount: order.amount,
          currency: 'INR',
          name: 'DreamNifty Events',
          description: `Registration for ${event.title}`,
          order_id: order.id,
          handler: async function (paymentResponse) {
            try {
              const verificationResponse = await axios.post(
                `${BASE_API_URL}/user/payment/verify-event`,
                {
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                  paymentId,
                  registrationId,
                  userId: user._id,
                  eventId: event._id
                },
                {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                  }
                }
              );

              if (verificationResponse.data.success) {
                toast.success('Payment successful! Registration complete.');
                dispatch(fetchEvents());
              } else {
                throw new Error(verificationResponse.data.message || 'Payment verification failed');
              }
            } catch (verificationError) {
              console.error("Verification error:", verificationError);
              toast.error(
                verificationError.response?.data?.message || 
                verificationError.message || 
                'Payment verification failed'
              );
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || ''
          },
          theme: {
            color: '#3399cc'
          },
          modal: {
            ondismiss: function() {
              toast.error('Payment was cancelled');
            }
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

      } catch (paidEventError) {
        console.error('Paid Event Registration Error:', paidEventError);
        toast.error(
          paidEventError.response?.data?.message || 
          paidEventError.message || 
          'Event registration failed'
        );
      }
    } catch (error) {
      console.error('Event Join Error:', error);
      toast.error(error.message || 'Failed to join event');
    }
  };

  // Filter events based on active tab
  const filteredEvents = events.filter(event => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (activeTab === 'ongoing') {
      return startDate <= now && endDate >= now;
    } else if (activeTab === 'upcoming') {
      return startDate > now;
    } else if (activeTab === 'completed') {
      return endDate < now;
    }
    return true;
  });

  // Open details modal
  const openDetailsModal = (event) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  // Render loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lightBlue-600"></div>
      </div>
    );
  }

  // Render authentication required state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
          <p className="mb-6">You need to be logged in to view events</p>
          <button 
            onClick={() => navigate('/login')} 
            className="px-6 py-3 bg-lightBlue-600 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="lg:pt-16 pb-8 sm:pb-12 sm:-mt-24 px-3 sm:px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center -mt-4 sm:-mt-24 mb-8 sm:mb-12 relative">
          <div className="absolute -top-8 -left-8 w-24 h-24 sm:w-32 sm:h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-8 sm:-bottom-12 -right-8 w-24 h-24 sm:w-32 sm:h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-0 right-8 sm:right-20 w-24 h-24 sm:w-32 sm:h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="relative mt-6 pt-10">
            <h1 className="text-2xl mt-24 sm:text-3xl md:text-4xl font-extrabold text-gray-900">
              DreamNifty Trading Events
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Compete in thrilling trading challenges, master new strategies, and win life-changing rewards! 
              Our events cater to all skill levels with prizes worth over ₹250,000 annually.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-lg shadow-xs p-3 sm:p-4 mb-4 sm:mb-6 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 border border-gray-100">
          {/* Active Traders Stat */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 sm:p-2 bg-green-50 rounded-lg">
              <Users className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xxs sm:text-xs text-gray-500">Active Traders</p>
              <p className="text-sm sm:text-base font-semibold">
                {events.reduce((sum, event) => sum + (event.participants || 0), 0)}+
              </p>
            </div>
          </div>

          {/* Ongoing Events Stat */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 sm:p-2 bg-yellow-50 rounded-lg">
              <TrendingUp className="text-yellow-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xxs sm:text-xs text-gray-500">Ongoing Events</p>
              <p className="text-sm sm:text-base font-semibold">
                {events.filter(e => {
                  const now = new Date();
                  const startDate = new Date(e.startDate);
                  const endDate = new Date(e.endDate);
                  return startDate <= now && endDate >= now;
                }).length}
              </p>
            </div>
          </div>

          {/* Upcoming Events Stat */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 sm:p-2 bg-blue-50 rounded-lg">
              <Calendar className="text-lightBlue-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xxs sm:text-xs text-gray-500">Upcoming Events</p>
              <p className="text-sm sm:text-base font-semibold">
                {events.filter(e => {
                  const now = new Date();
                  const startDate = new Date(e.startDate);
                  return startDate > now;
                }).length}
              </p>
            </div>
          </div>

          {/* Completed Events Stat */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 sm:p-2 bg-purple-50 rounded-lg">
              <Award className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <p className="text-xxs sm:text-xs text-gray-500">Completed Events</p>
              <p className="text-sm sm:text-base font-semibold">
                {events.filter(e => {
                  const now = new Date();
                  const endDate = new Date(e.endDate);
                  return endDate < now;
                }).length}
              </p>
            </div>
          </div>
        </div>

        {/* Event Tabs */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <div className="bg-white rounded-full shadow-sm p-1 flex flex-wrap justify-center sm:flex-nowrap sm:space-x-2 border border-gray-200">
            {['ongoing', 'upcoming', 'completed'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1 sm:py-2 m-1 sm:m-0 rounded-full transition-colors duration-200 flex items-center ${
                  activeTab === tab 
                    ? 'bg-lightBlue-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab === 'ongoing' && <Zap className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />}
                {tab === 'upcoming' && <Calendar className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />}
                {tab === 'completed' && <Award className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <div 
                key={event._id} 
                className={`rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md ${event.backgroundColor || 'bg-gradient-to-br from-blue-50 to-blue-100'} border border-gray-200`}
              >
                <div className="p-4 sm:p-5">
                  {/* Event Header */}
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="p-2 bg-white rounded-lg shadow-xs mr-3 sm:mr-4">
                      {getIconComponent(event.icon, 20)}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        {event.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Shield className="text-gray-400 mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs text-gray-500">Entry: ₹{event.entryFee || 'Free'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-2">{event.description}</p>
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-5">
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                      <div>
                        <p className="text-xxs sm:text-xs text-gray-500">Date</p>
                        <p className="text-xs sm:text-sm font-medium">
                          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="mr-2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                      <div>
                        <p className="text-xxs sm:text-xs text-gray-500">Prize Pool</p>
                        <p className="text-xs sm:text-sm font-medium">{event.prize}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Reward Requirements Preview */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center text-xs sm:text-sm text-gray-700">
                      <Percent className="mr-1 text-gray-500 w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-medium">Reward Tiers:</span>
                      <span className="ml-1">
                        {event.rewardTiers?.slice(0, 3).map(tier => tier.tier).join(', ')}
                        {event.rewardTiers?.length > 3 && '...'}
                      </span>
                    </div>
                    <div className="mt-1 text-xxs sm:text-xs text-gray-500">
                      {event.participants || 0} participants
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between text-xxs sm:text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{event.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1 sm:h-2">
                      <div 
                        className="bg-lightBlue-600 h-1 sm:h-2 rounded-full" 
                        style={{ width: `${event.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => openDetailsModal(event)}
                      className="flex items-center text-lightBlue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                    >
                      <Info className="mr-1 w-3 h-3 sm:w-4 sm:h-4" />
                      View Details
                    </button>
                    <button 
                      onClick={() => user ? handleJoinEvent(event) : toast.error('Please login to join events')}
                      className="px-3 sm:px-4 py-1 sm:py-2 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      Quick Join
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 sm:py-16 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Calendar className="text-gray-400 w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-3 sm:mb-4">
                No {activeTab} events at the moment
              </h3>
              <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-4 sm:mb-6">
                We're preparing exciting new challenges for you. Check back soon or explore our learning resources while you wait.
              </p>
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base">
                Notify Me About New Events
              </button>
            </div>
          )}
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventDetailsModal 
            isOpen={isDetailsModalOpen}
            onClose={() => setIsDetailsModalOpen(false)}
            event={selectedEvent}
            onJoin={handleJoinEvent}
            user={user}
          />
        )}

        {/* Testimonials Section */}
        {filteredEvents.length > 0 && (
          <div className="mt-8 sm:mt-16 bg-white rounded-xl shadow-sm p-4 sm:p-6 md:p-8 border border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800">What Our Traders Say</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-purple-600 font-bold text-sm sm:text-base">JD</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">John D.</h4>
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">"Won ₹8,500 in the Options Challenge! The competition pushed me to refine my strategies and the rewards were incredible."</p>
              </div>
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-lightBlue-600 font-bold text-sm sm:text-base">SM</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Sarah M.</h4>
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">"As a beginner, the Bootcamp was perfect. I learned so much and still won ₹1,200! The community support was amazing."</p>
              </div>
              <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <span className="text-green-600 font-bold text-sm sm:text-base">RK</span>
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-medium">Raj K.</h4>
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600">"The cashback alone makes these events worth it. I've earned over ₹2,300 in cashback rewards this year!"</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-8 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-gray-800">Frequently Asked Questions</h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200">
              <h3 className="text-sm sm:text-base font-medium flex items-center">
                <Info className="text-lightBlue-600 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
                How do I participate in an event?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 pl-6 sm:pl-8">
                Simply click the "Join Event Now" button on any event card, complete the registration process, and pay the entry fee if applicable. You'll receive immediate access to the event dashboard.
              </p>
            </div>
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200">
              <h3 className="text-sm sm:text-base font-medium flex items-center">
                <Info className="text-lightBlue-600 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
                Are there any requirements to join?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 pl-6 sm:pl-8">
                Most events require a minimum account balance or trading volume. Beginner events often have no requirements, while advanced competitions may require verification of trading experience.
              </p>
            </div>
            <div className="p-4 sm:p-5 md:p-6">
              <h3 className="text-sm sm:text-base font-medium flex items-center">
                <Info className="text-lightBlue-600 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5" />
                How are winners determined?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 pl-6 sm:pl-8">
                Winners are ranked based on event-specific metrics (ROI, accuracy, profit, etc.). All judging criteria are clearly outlined in each event's rules, and standings are updated in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default EventsPage;