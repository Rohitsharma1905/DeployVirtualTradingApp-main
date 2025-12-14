import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Common/Loader';
import { motion } from 'framer-motion';
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
  BarChart2,
  DollarSign,
  TrendingUp,
  Shield,
  BadgeCheck,
  Coins,
  X,
  CheckCircle // <-- Import CheckCircle for completed events icon
} from 'lucide-react';
import { fetchEvents, selectEvents, selectEventsStatus } from '../../redux/Admin/EventManage/eventSlice'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../views/auth/UnifiedLoginModal'; // Adjust path if needed
import RegisterModal from '../../views/auth/UnifiedRegistrationModal'; // Adjust path if needed

// EventDetailsModal Component (Assuming it's defined correctly above or imported)
const EventDetailsModal = ({ event, onClose, onJoin }) => {
  if (!event) return null;

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto p-2 sm:p-4">
      <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={onClose} />
      <div className="relative w-full max-w-full sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%] max-h-[90vh] mx-2 my-4 bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="p-1 sm:p-2 bg-blue-100 rounded-lg sm:rounded-xl">
              {getIconComponent(event.icon, 20, "text-lightBlue-600")}
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors duration-200"
          >
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column - Event Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Description */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center">
                  <Info className="mr-2 text-lightBlue-600" size={16} />
                  Description
                </h3>
                <p className="text-sm sm:text-base text-gray-700">{event.description}</p>
              </div>

              {/* Date & Time */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                  <Calendar className="mr-2 text-lightBlue-600" size={16} />
                  Event Schedule
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <Clock className="mr-2 text-gray-500" size={14} />
                    <div>
                      <p className="text-xs text-gray-500">Start Date</p>
                      <p className="text-sm sm:text-base font-medium">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 text-gray-500" size={14} />
                    <div>
                      <p className="text-xs text-gray-500">End Date</p>
                      <p className="text-sm sm:text-base font-medium">
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2 flex items-center">
                  <Shield className="mr-2 text-lightBlue-600" size={16} />
                  Participation Requirements
                </h3>
                <p className="text-sm sm:text-base text-gray-700">{event.requirements}</p>
              </div>
            </div>

            {/* Right Column - Financial Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Prize Information */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                  <Medal className="mr-2 text-lightBlue-600" size={16} />
                  Prize Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <DollarSign className="mr-2 text-gray-500" size={14} />
                    <div>
                      <p className="text-xs text-gray-500">Total Prize</p>
                      <p className="text-sm sm:text-base font-medium text-lightBlue-600">{event.prize}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BadgeCheck className="mr-2 text-gray-500" size={14} />
                    <div>
                      <p className="text-xs text-gray-500">Cashback</p>
                      <p className="text-sm sm:text-base font-medium text-green-600">
                        {event.cashbackPercentage}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 text-gray-500" size={14} />
                    <div>
                      <p className="text-xs text-gray-500">Entry Fee</p>
                      <p className="text-sm sm:text-base font-medium">${event.entryFee}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="mr-2 text-gray-500" size={14} />
                    <div>
                      <p className="text-xs text-gray-500">Difficulty</p>
                      <p className="text-sm sm:text-base font-medium">{event.difficulty}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participation */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                  <Users className="mr-2 text-lightBlue-600" size={16} />
                  Participation Stats
                </h3>
                <div className="flex justify-between mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm text-gray-600">Participants:</span>
                  <span className="text-sm sm:text-base font-medium">{event.participants}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-1">
                  <div
                    className="bg-lightBlue-600 h-2 sm:h-2.5 rounded-full"
                    style={{ width: `${event.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {event.progressText}
                </p>
              </div>

              {/* Prize Breakdown */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                  <Award className="mr-2 text-lightBlue-600" size={16} />
                  Prize Breakdown
                </h3>
                <ul className="space-y-1 sm:space-y-2">
                  {event.prizeBreakdown.map((item, index) => (
                    <li key={index} className="flex justify-between text-xs sm:text-sm">
                      <span className="font-medium">{item.position}</span>
                      <span className="text-gray-700">{item.reward}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mt-4 sm:mt-6"> {/* Added margin-top */}
            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                <Zap className="mr-2 text-lightBlue-600" size={16} />
                Event Rewards
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                {event.rewards.map((reward, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mt-1 sm:mt-1.5 mr-2 w-2 h-2 rounded-full bg-lightBlue-600 flex-shrink-0"></div> {/* Added flex-shrink-0 */}
                    <span className="text-xs sm:text-sm text-gray-700">{reward}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-3 sm:p-4 flex justify-center">
          <button
            onClick={onJoin}
            className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg bg-lightBlue-600 text-white hover:bg-blue-700 transition-colors flex items-center text-sm sm:text-base"
          >
            <ArrowRight className="mr-2" size={14} /> Join Event Now
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
  const [activeTab, setActiveTab] = useState('ongoing');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Assuming you have auth state like this in your Redux store
  // Adjust the selector path based on your actual store structure
  const authState = useSelector((state) => state.auth); // Example path
  const isAuthenticated = authState?.isAuthenticated || false;

  useEffect(() => {
    // Fetch events only if not already loaded or failed
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [dispatch, status]);

  // --- MODIFIED calculateStats function ---
  const calculateStats = () => {
    const now = new Date();
    let activeTraders = 0;
    let activeEvents = 0;
    let upcomingEvents = 0;
    let completedEvents = 0; // <-- Initialize completed events counter
    let totalPrizePool = 0;

    // Ensure events is an array before iterating
    if (!Array.isArray(events)) {
      console.error("Events data is not an array:", events);
      return { activeTraders: 0, activeEvents: 0, upcomingEvents: 0, completedEvents: 0, totalPrizePool: '$0' };
    }

    events.forEach(event => {
      // Basic validation for event structure
      if (!event || !event.startDate || !event.endDate) {
        console.warn("Skipping invalid event data:", event);
        return;
      }

      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);

      // Check if dates are valid
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn("Skipping event with invalid dates:", event);
          return;
      }

      activeTraders += event.participants || 0;

      const prizeValue = parseFloat(event.prize?.replace(/[^0-9.]/g, '')) || 0;
      totalPrizePool += prizeValue;

      if (startDate <= now && endDate >= now) {
        activeEvents++;
      } else if (startDate > now) {
        upcomingEvents++;
      } else if (endDate < now) { // <-- Condition for completed events
        completedEvents++;
      }
    });

    return {
      activeTraders,
      activeEvents,
      upcomingEvents,
      completedEvents, // <-- Return completed events count
      totalPrizePool: `$${totalPrizePool.toLocaleString()}`,
    };
  };

  const stats = calculateStats();
  // --- END of MODIFIED calculateStats function ---


  const handleJoinEvent = () => {
    if (isAuthenticated) {
      console.log('Joining event:', selectedEvent?.title);
      // Add actual join logic here (e.g., navigate, API call)
      setSelectedEvent(null); // Close modal after initiating join
    } else {
      setSelectedEvent(null); // Close details modal first
      setShowLoginModal(true); // Then show login modal
    }
  };

  const handleQuickJoin = (event) => {
    if (isAuthenticated) {
      console.log('Quick joining event:', event.title);
       // Add actual quick join logic here
    } else {
      // Optionally set the event you want to join after login
      // setSelectedEvent(event); // Uncomment if needed
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Optionally trigger join logic if an event was selected before login prompt
    if (selectedEvent) {
      console.log('Joining event after login:', selectedEvent?.title);
       // Add actual join logic here
      setSelectedEvent(null);
    }
  };

  const handleRegisterClick = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleLoginClick = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const getIconComponent = (iconName) => {
    const icons = {
      Trophy: <Trophy className="text-lightBlue-600" size={20} />,
      Medal: <Medal className="text-yellow-500" size={20} />,
      Gift: <Gift className="text-purple-500" size={20} />,
      Award: <Award className="text-green-500" size={20} />,
      Star: <Star className="text-orange-500" size={20} />,
      Zap: <Zap className="text-red-500" size={20} />,
      Users: <Users className="text-green-500" size={20} />,
      BarChart2: <BarChart2 className="text-red-500" size={20} />,
      Coins: <Coins className="text-amber-500" size={20} />,
    };
    return icons[iconName] || <Trophy className="text-lightBlue-600" size={20} />;
  };

  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    // Add validation inside filter as well
    if (!event || !event.startDate || !event.endDate) return false;

    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return false;


    if (activeTab === 'ongoing') {
      return startDate <= now && endDate >= now;
    } else if (activeTab === 'upcoming') {
      return startDate > now;
    } else if (activeTab === 'completed') {
      return endDate < now;
    }
    return true; // Should not happen if tabs cover all cases
  }) : [];


  if (status === 'loading') {
    return (
      <div style={{ marginTop: '5rem' }}>
        <Loader />
      </div>
    );
  }
  


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="pt-16 md:pt-24 pb-12 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Hero Section - Full Width */}
        <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] my-6 sm:my-8 overflow-hidden bg-lightBlue-600 py-12 z-0">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
          </div>

          <div className="relative w-full mt-8 text-center z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4 sm:space-y-6"
            >
              <h1 className="text-4xl  md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight pt-2">
                <span className="block">DreamNifty Trading Events</span>
              </h1>
              <motion.p
                className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                “Join exciting trading challenges and win big—over $250,000 in annual prizes!”
              </motion.p>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white opacity-10"
                style={{
                  width: Math.random() * 120 + 30,
                  height: Math.random() * 120 + 30,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 60 - 30],
                  x: [0, Math.random() * 60 - 30],
                  opacity: [0.05, 0.2, 0.05],
                }}
                transition={{
                  duration: Math.random() * 15 + 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>

        {/* --- MODIFIED Stats Bar --- */}
        <div className="relative bg-white rounded-lg shadow-xs p-4 mb-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 border border-gray-100 z-20 -mt-8 sm:-mt-14 mx-4"> {/* Changed grid columns */}
          {/* Active Traders Stat */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="text-green-600" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Traders</p>
              <p className="text-sm sm:text-base font-semibold">
                {stats.activeTraders.toLocaleString()}+
              </p>
            </div>
          </div>

          {/* Active Events Stat */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <TrendingUp className="text-yellow-600" size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Active Events</p>
              <p className="text-sm sm:text-base font-semibold">
                {stats.activeEvents}
              </p>
            </div>
          </div>

          {/* Upcoming Events Stat */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="text-lightBlue-600" size={18} /> {/* Changed Icon */}
            </div>
            <div>
              <p className="text-xs text-gray-500">Upcoming Events</p>
              <p className="text-sm sm:text-base font-semibold">
                {stats.upcomingEvents}
              </p>
            </div>
          </div>

          {/* --- NEW Completed Events Stat --- */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-50 rounded-lg"> {/* Muted background */}
              <CheckCircle className="text-gray-600" size={18} /> {/* Icon and color */}
            </div>
            <div>
              <p className="text-xs text-gray-500">Completed Events</p>
              <p className="text-sm sm:text-base font-semibold">
                {stats.completedEvents} {/* Display calculated value */}
              </p>
            </div>
          </div>
          {/* --- END NEW Completed Events Stat --- */}

        </div>
        {/* --- END MODIFIED Stats Bar --- */}


        {/* Rest of content with side padding */}
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Event Tabs */}
          <div className="flex justify-center mb-6 sm:mb-8 md:mb-10">
            <div className="bg-white rounded-full shadow-sm p-1 flex flex-wrap justify-center gap-2 sm:flex-nowrap sm:space-x-2 border border-gray-200">
              {['ongoing', 'upcoming', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full transition-colors duration-200 flex items-center text-xs sm:text-sm ${
                    activeTab === tab
                      ? 'bg-lightBlue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab === 'ongoing' && <Zap className="mr-1 sm:mr-2" size={14} />}
                  {tab === 'upcoming' && <Calendar className="mr-1 sm:mr-2" size={14} />}
                  {tab === 'completed' && <CheckCircle className="mr-1 sm:mr-2" size={14} />} {/* Icon for tab */}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredEvents.map(event => (
              <div
                key={event._id}
                className={`relative rounded-lg sm:rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 ${event.backgroundColor || 'bg-white'}`} // Added default bg
              >
                {/* Highlight Badge */}
                {event.highlight && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-yellow-400 text-yellow-900 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold shadow-xs flex items-center z-10"> {/* Adjusted colors */}
                    <Zap className="mr-1" size={12} />
                    {event.highlight}
                  </div>
                )}

                <div className="p-3 sm:p-4 md:p-5">
                  {/* Event Header */}
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="p-1 sm:p-2 bg-white rounded-lg shadow-xs mr-2 sm:mr-3 md:mr-4">
                      {getIconComponent(event.icon)}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 line-clamp-1"> {/* Adjusted size and line clamp */}
                        {event.title}
                      </h3>
                      <div className="flex items-center mt-1">
                        <Award className="text-gray-400 mr-1" size={12} />
                        <span className="text-xs text-gray-500">{event.difficulty}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 h-10">{event.description}</p> {/* Fixed height */}

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 md:mb-5">
                    <div className="flex items-center">
                      <Calendar className="mr-1 sm:mr-2 text-gray-500 flex-shrink-0" size={14} /> {/* flex-shrink-0 */}
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="text-xs sm:text-sm font-medium">
                          {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {/* Formatted date */}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-1 sm:mr-2 text-gray-500 flex-shrink-0" size={14} /> {/* flex-shrink-0 */}
                      <div>
                        <p className="text-xs text-gray-500">Prize Pool</p>
                        <p className="text-xs sm:text-sm font-medium text-lightBlue-600">{event.prize}</p> {/* Colored prize */}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3"> {/* Added border-top */}
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-center text-lightBlue-600 hover:text-blue-800 text-xs sm:text-sm font-medium transition-colors"
                    >
                      <Info className="mr-1" size={12} />
                      View Details
                    </button>
                     {activeTab !== 'completed' && ( // Show Join only if not completed
                         <button
                            onClick={() => handleQuickJoin(event)}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs sm:text-sm shadow-sm"
                         >
                            Join Now
                         </button>
                     )}
                     {activeTab === 'completed' && ( // Show "Completed" badge if completed
                          <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                              Completed
                          </span>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && status !== 'loading' && (
            <div className="text-center py-8 sm:py-12 md:py-16 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <div className="mx-auto w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                 {activeTab === 'ongoing' && <Zap className="text-gray-400 w-8 h-8" />}
                 {activeTab === 'upcoming' && <Calendar className="text-gray-400 w-8 h-8" />}
                 {activeTab === 'completed' && <CheckCircle className="text-gray-400 w-8 h-8" />}
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-600 mb-3 sm:mb-4">
                No {activeTab} events found
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4 sm:mb-6 text-sm sm:text-base">
                {activeTab === 'ongoing' && "There are no active events right now. Check the upcoming events!"}
                {activeTab === 'upcoming' && "We're preparing exciting new challenges. Check back soon!"}
                {activeTab === 'completed' && "No events have been completed yet, or past events aren't listed."}
              </p>
               {activeTab !== 'completed' && (
                 <button
                    onClick={() => setActiveTab('upcoming')} // Example action
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-lightBlue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                 >
                   View Upcoming Events
                 </button>
               )}
            </div>
          )}

          {/* FAQ Section */}
          <div className="mt-8 sm:mt-12 md:mt-16">
             <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-gray-800">Frequently Asked Questions</h2>
             <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden border border-gray-200 max-w-4xl mx-auto"> {/* Centered FAQs */}
               <div className="p-4 sm:p-6 border-b border-gray-200">
                 <h3 className="font-medium flex items-center text-sm sm:text-base">
                   <Info className="text-lightBlue-600 mr-2 sm:mr-3 flex-shrink-0" size={16} />
                   How do I participate in an event?
                 </h3>
                 <p className="mt-1 sm:mt-2 text-gray-600 pl-6 sm:pl-8 text-xs sm:text-sm">
                   Click "Join Now" or "View Details" then "Join Event Now". If you're not logged in, you'll be prompted. Follow any specific event requirements mentioned.
                 </p>
               </div>
               <div className="p-4 sm:p-6 border-b border-gray-200">
                 <h3 className="font-medium flex items-center text-sm sm:text-base">
                   <Info className="text-lightBlue-600 mr-2 sm:mr-3 flex-shrink-0" size={16} />
                   Are there any requirements to join?
                 </h3>
                 <p className="mt-1 sm:mt-2 text-gray-600 pl-6 sm:pl-8 text-xs sm:text-sm">
                   Some events may have entry fees, minimum account balances, or require KYC verification. Check the "Requirements" section in the event details. Beginner events usually have fewer restrictions.
                 </p>
               </div>
               <div className="p-4 sm:p-6">
                 <h3 className="font-medium flex items-center text-sm sm:text-base">
                   <Info className="text-lightBlue-600 mr-2 sm:mr-3 flex-shrink-0" size={16} />
                   How are winners determined and paid?
                 </h3>
                 <p className="mt-1 sm:mt-2 text-gray-600 pl-6 sm:pl-8 text-xs sm:text-sm">
                   Winners are typically ranked by Return on Investment (ROI), profit, or other metrics defined in the event rules. Prizes are usually credited directly to your DreamNifty account within 7 business days after the event concludes and results are verified.
                 </p>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onJoin={handleJoinEvent}
        />
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterClick={handleRegisterClick}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onLoginClick={handleLoginClick}
        // Add onRegisterSuccess if needed
      />
    </div>
  );
};

export default EventsPage;