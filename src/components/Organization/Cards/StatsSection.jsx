import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import CardStats from './CardStats';
import StatsModal from '../../Admin/Modals/stats/StatsModal';
import OrganizationStatsGraph from '../Modals/Graphs/OrganizationStatsGraph';
// import { OrganizationEventStatsGraph } from '../Modals/graphs/OrganizationEventStatsGraph';
// import { OrganizationFeedbackStatsGraph } from '../Modals/graphs/OrganizationFeedbackStatsGraph';
// import { OrganizationComplaintStatsGraph } from '../Modals/graphs/OrganizationComplaintStatsGraph';

const StatsSection = ({ isDashboard = false, pageType = 'dashboard' }) => {
  const {
    userStats,
    eventStats,
    feedbackStats,
    complaintStats,
    organizationUserFeedbacksStats,
    organizationUserQueriesStats,
    stocksStats, 
    galleryStats,
    userComplaintStats,
    eventParticipationStats,
    loading,
    error
  } = useSelector((state) => state.organization.dashboard);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  // const handleCardClick = (statType, title) => {
  //   setModalTitle(title);
    
  //   switch(statType) {
  //     case 'users':
  //       setModalContent(
  //         <OrganizationUserStatsGraph 
  //           stats={userStats} 
  //           title="User Statistics"
  //         />
  //       );
  //       break;
  //     case 'events':
  //       setModalContent(
  //         <OrganizationEventStatsGraph 
  //           stats={eventStats} 
  //           title="Event Statistics"
  //         />
  //       );
  //       break;
  //     case 'feedbacks':
  //       setModalContent(
  //         <OrganizationFeedbackStatsGraph 
  //           stats={feedbackStats} 
  //           title="Feedback Statistics"
  //         />
  //       );
  //       break;
  //     case 'complaints':
  //       setModalContent(
  //         <OrganizationComplaintStatsGraph 
  //           stats={complaintStats} 
  //           title="Complaint Statistics"
  //         />
  //       );
  //       break;
  //     default:
  //       setModalContent(<div>No detailed view available</div>);
  //   }
    
  //   setIsModalOpen(true);
  // };

  const handleCardClick = (statType, title) => {
    setModalTitle(title);
    
    let stats, type;
    switch(statType) {
      case 'users':
        stats = userStats;
        type = 'users';
        break;
      case 'events':
        stats = eventParticipationStats;
        type = 'events';
        break;
      case 'feedbacks':
        stats = feedbackStats;
        type = 'feedbacks';
        break;
      case 'complaints':
        stats = complaintStats;
        type = 'complaints';
        break;
        case 'userFeedbacks':
          stats = organizationUserFeedbacksStats;
          type = 'userFeedbacks';
          break;
          case 'userQueries':
            stats = organizationUserQueriesStats;
            type = 'userQueries';
            break;
            case 'stocks':
              stats = stocksStats;
              type = 'stocks';
              break;
              case 'gallery':
                stats = galleryStats;
                type = 'gallery';
                break;
                case 'userComplaint':
                  stats = userComplaintStats;
                  type = 'userComplaints';
                  break;
      default:
        stats = {};
        type = 'users';
    }
    
    setModalContent(
      <OrganizationStatsGraph 
        stats={stats} 
        title={title} 
        type={type} 
      />
    );
    
    setIsModalOpen(true);
  };


  if (loading) {
    return (
      <div className="bg-lightBlue-600 md:pt-32 pb-16 pt-12">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-lightBlue-600 md:pt-32 pb-16 pt-12 text-center text-red-500">
        {error}
      </div>
    );
  }

  // Stats configuration
  const statsConfig = {
    dashboard: [
      {
        statIconName: "fas fa-users",
        statSubtitle: "USER STATS",
        // statTitle: userStats?.total?.toString() || "0",
        statTitle: pageType !== "dashboard" ? userStats?.total?.toString() : "",
        showDetails: true,
        statIconColor: "bg-lightBlue-600",
        statArrow: "up",
        statPercent: "5.48",
        statPercentColor: "text-emerald-500",
        statDescripiron: "Since last month",
        statItems: [
          { label: "Total", value: userStats?.total?.toString() || "0" },
          { label: "Active", value: userStats?.active?.toString() || "0" },
        ],
        onClick: () => handleCardClick('users', 'User')
      },
      {
        statIconName: "fas fa-comment-alt",
        statSubtitle: "FEEDBACK STATS",
        statTitle: pageType !== "dashboard" ? feedbackStats?.total?.toString() : "",
        statIconColor: "bg-orange-500",
        showDetails: true,
        statItems: [
          { label: "Total", value: feedbackStats?.total?.toString() || "0" },
          { label: "Rating", value: feedbackStats?.averageRating?.toString() || "0" },
        ],
        statArrow: "up",
        statPercent: "3.48",
        statPercentColor: "text-emerald-500",
        statDescripiron: "Since last week",
        onClick: () => handleCardClick('feedbacks', 'Feedback')
      },
      {
        statIconName: "fas fa-exclamation-triangle",
        statSubtitle: "COMPLAINT STATS",
        statTitle: pageType!="dashboard" ?  complaintStats?.total?.toString() : "",
        statIconColor: "bg-blue-400",
        showDetails: true,
        statItems: [
          { label: "Total", value: complaintStats?.total?.toString() || "0" },
          { label: "Pending", value:  complaintStats?.pending?.toString() || "0" },
        ],
        statArrow: "up",
        statPercent: "2.10",
        statPercentColor: "text-emerald-500",
        statDescripiron: "Since last month",
        onClick: () => handleCardClick('complaints', 'Complaint')
      },
      // {
      //   statIconName: "fas fa-female",
      //   statSubtitle: "EVENT STATS",
      //   statTitle: pageType!="dashboard" ?  eventStats?.total?.toString() : "",
      //   statIconColor: "bg-pink-500",
      //   showDetails: true,
      //   statItems: [
      //     { label: "Total", value: eventStats?.total?.toString() || "0" },
      //     { label: "Completed", value:  eventStats?.completed?.toString() || "0" },
      //   ],
      //   statArrow: "up",
      //   statPercent: "3.20",
      //   statPercentColor: "text-emerald-500",
      //   statDescripiron: "Since last month",
      //   onClick: () => handleCardClick('events', 'User Statistics')
      // },
      {
        statIconName: "fas fa-calendar-alt",
        statSubtitle: "EVENT STATS",
        statTitle: pageType!="dashboard" ?  eventParticipationStats?.participatingUsers?.toString() : "",
        statIconColor: "bg-pink-500",
        showDetails: true,
        statItems: [
          { label: "Total", value:  eventParticipationStats?.participatingUsers?.toString()  || "0" },
          { label: "P Rate", value:  eventParticipationStats?.participationRate?.toString() || "0" },
        ],
        statArrow: "up",
        statPercent: "3.20",
        statPercentColor: "text-emerald-500",
        statDescripiron: "Since last month",
        onClick: () => handleCardClick('events', 'Event')
      },
      {
        statIconName: "fas fa-comments",
        statSubtitle: "USER FEEDBACKS",
        statTitle: pageType!="dashboard" ?  organizationUserFeedbacksStats?.total?.toString() : "",
        statIconColor: "bg-green-500",
        showDetails: true,
        statItems: [
          { label: "Total", value: organizationUserFeedbacksStats?.total?.toString() || "0" },
          { label: "Rating", value:  organizationUserFeedbacksStats?.averageRating?.toString() || "0" },
        ],
        statArrow: "up",
        statPercent: "4.10",
        statPercentColor: "text-emerald-500",
        statDescripiron: "Since last week",
        onClick: () => handleCardClick('userFeedbacks', 'User Feedback')
      },
      // {
      //   statIconName: "fas fa-user-slash",
      //   statSubtitle: "USER QUERIES",
      //   statTitle: pageType!="dashboard" ?  organizationUserQueriesStats?.total?.toString() : "",
      //   statIconColor: "bg-gray-500",
      //   showDetails: true,
      //   statItems: [
      //     { label: "Total", value: organizationUserQueriesStats?.total?.toString() || "0" },
      //     { label: "Response", value:  organizationUserQueriesStats?.responseRate?.toString() || "0" },
      //   ],
      //   statArrow: "down",
      //   statPercent: "1.10",
      //   statPercentColor: "text-red-500",
      //   statDescripiron: "Since last week",
      //   onClick: () => handleCardClick('userQueries', 'User Statistics')
      // },
      {
        statIconName: "fas fa-times-circle",
        statSubtitle: "USER COMPLAINTS",
        statTitle: pageType!="dashboard" ?  userComplaintStats?.total?.toString() : "",
        statIconColor: "bg-purple-500",
        showDetails: true,
           statItems: [
          { label: "Total", value: userComplaintStats?.total?.toString() || "0" },
          { label: "Resolve", value:  userComplaintStats?.resolved?.toString() || "0" },
        ],
        statArrow: "up",
        statPercent: "",
        statPercentColor: "text-emerald-500",
        statDescripiron: "Average age of users",
        onClick: () => handleCardClick('userComplaint', 'User Complaint')
      },
      // {
      //   statIconName: "fas fa-calendar-alt",
      //   statSubtitle: "TOTAL EVENTS",
      //   statTitle: eventStats?.total?.toString() || "0",
      //   statIconColor: "bg-indigo-500",
      //   onClick: () => handleCardClick('events', 'Event Statistics')
      // },
      {
        statIconName: "fas fa-boxes",
        statSubtitle: "STOCK STATS",
        statTitle:pageType!="dashboard" ?  stocksStats?.all?.toString() : "",
        statIconColor: "bg-green-500",
        showDetails: true,
        statItems: [
          { label: "Nifty50", value:stocksStats?.nifty50 - 1?.toString() || "0" },
          { label: "Nifty500", value: stocksStats?.nifty500 - 1?.toString() || "0" },
        ],
onClick: () => handleCardClick('stocks', 'Stock')

      },
      {
        statIconName: "fas fa-images",
        statSubtitle: "GALLERY STATS",
        statTitle: pageType!="dashboard" ?  galleryStats?.totalPhotos?.toString() : "",
        statIconColor: "bg-gray-500",
        showDetails: true,
        statItems: [
          { label: "Total", value: galleryStats?.totalPhotos?.toString() || "0" },
          { label: "Category", value: galleryStats?.totalCategories?.toString() || "0" },
        ],
onClick: () => handleCardClick('gallery', 'Gallery')
      },
    ],
    users: [
      {
        statIconName: "fas fa-users",
        statSubtitle: "TOTAL USERS",
        statTitle: userStats?.total?.toString() || "0",
        statIconColor: "bg-lightBlue-600",
        showDetails: false,
        onClick: () => handleCardClick('users', 'User')
      },
      {
        statIconName: "fas fa-user-plus",
        statSubtitle: "AVG AGE",
        statTitle: userStats?.averageAge?.toString() || "0",
        statIconColor: "bg-orange-500",
        showDetails: false,
        onClick: () => handleCardClick('users', 'User')
      },
      {
        statIconName: "fas fa-user-check",
        statSubtitle: "ACTIVE USERS",
        statTitle: userStats?.active?.toString() || "0",
        statIconColor: "bg-green-500",
        showDetails: false,
        onClick: () => handleCardClick('users', 'User')
      },
      {
        statIconName: "fas fa-user-slash",
        statSubtitle: "DEACTIVE USERS",
        statTitle: userStats?.deactive?.toString() || "0",
        statIconColor: "bg-gray-500",
        showDetails: false,
        onClick: () => handleCardClick('users', 'User')
      }
    ],
    events: [
      {
        statIconName: "fas fa-calendar-alt",
        statSubtitle: "TOTAL EVENTS",
        statTitle: eventStats?.total?.toString() || "0",
        statIconColor: "bg-indigo-500",
        showDetails: false,
        onClick: () => handleCardClick('events', 'Event')
      },
      {
        statIconName: "fas fa-clock",
        statSubtitle: "UPCOMING",
        statTitle: eventStats?.upcoming?.toString() || "0",
        statIconColor: "bg-blue-400",
        showDetails: false,
        onClick: () => handleCardClick('events', 'Event')
      },
      {
        statIconName: "fas fa-running",
        statSubtitle: "ONGOING",
        statTitle: eventStats?.ongoing?.toString() || "0",
        statIconColor: "bg-green-400",
        showDetails: false,
        onClick: () => handleCardClick('events', 'Event')
      },
      {
        statIconName: "fas fa-history",
        statSubtitle: "COMPLETED",
        statTitle: eventStats?.completed?.toString() || "0",
        statIconColor: "bg-gray-400",
        showDetails: false,
        onClick: () => handleCardClick('events', 'Event')
      }
    ],
    feedbacks: [
      {
        statIconName: "fas fa-comment-alt",
        statSubtitle: "TOTAL FEEDBACK",
        statTitle: feedbackStats?.total?.toString() || "0",
        statIconColor: "bg-lightBlue-600",
        showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback')
      },
      {
        statIconName: "fas fa-star",
        statSubtitle: "AVG RATING",
        statTitle: (
          <div className="flex items-center py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const avgRating = parseFloat(feedbackStats?.averageRating || 0);
              const showFull = avgRating >= star;
              const showPartial = avgRating > (star - 1) && !showFull;
              
              return (
                <i
                  key={star}
                  className={`
                    ${showFull ? 'fas fa-star text-yellow-400' : ''}
                    ${showPartial ? 'fas fa-star-half-alt text-yellow-400' : ''}
                    ${!showFull && !showPartial ? 'far fa-star text-gray-300' : ''}
                  `}
                ></i>
              );
            })}
            <span className="ml-2 text-sm font-semibold">
              {feedbackStats?.averageRating || '0.0'}
            </span>
          </div>
        ),
        statIconColor: "bg-yellow-400",
        showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback')
      },
      {
        statIconName: "fas fa-thumbs-up",
        statSubtitle: "RECOMMENDATION",
        statTitle: `${feedbackStats?.recommendationRate || '0'}%`,
        statIconColor: "bg-green-400",
        showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback')
      },
      {
        statIconName: "fas fa-list-ul",
        statSubtitle: "RECENT FEEDBACK",
        statTitle: feedbackStats?.recentFeedbacks?.length?.toString() || "0",
        statIconColor: "bg-purple-400",
        showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback')
      }
    ],



    userFeedbacks: [
      {
        statIconName: "fas fa-comment-alt",
        statSubtitle: "TOTAL FEEDBACK",
        statTitle: organizationUserFeedbacksStats?.total?.toString() || "0",
        statIconColor: "bg-lightBlue-600",
        showDetails: false,
        onClick: () => handleCardClick('userFeedbacks', 'User Feedback')
      },
      {
        statIconName: "fas fa-star",
        statSubtitle: "AVG RATING",
        statTitle: (
          <div className="flex items-center py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const avgRating = parseFloat(organizationUserFeedbacksStats?.averageRating || 0);
              const showFull = avgRating >= star;
              const showPartial = avgRating > (star - 1) && !showFull;
              
              return (
                <i
                  key={star}
                  className={`
                    ${showFull ? 'fas fa-star text-yellow-400' : ''}
                    ${showPartial ? 'fas fa-star-half-alt text-yellow-400' : ''}
                    ${!showFull && !showPartial ? 'far fa-star text-gray-300' : ''}
                  `}
                ></i>
              );
            })}
            <span className="ml-2 text-sm font-semibold">
              {organizationUserFeedbacksStats?.averageRating || '0.0'}
            </span>
          </div>
        ),
        statIconColor: "bg-yellow-400",
        showDetails: false,
        onClick: () => handleCardClick('userFeedbacks', 'User Feedback')
      },
      {
        statIconName: "fas fa-thumbs-up",
        statSubtitle: "RECOMMENDATION",
        statTitle: `${organizationUserFeedbacksStats?.recommendationRate || '0'}%`,
        statIconColor: "bg-green-400",
        showDetails: false,
        onClick: () => handleCardClick('userFeedbacks', 'User Feedback')
      },
      {
        statIconName: "fas fa-list-ul",
        statSubtitle: "RECENT FEEDBACK",
        statTitle: organizationUserFeedbacksStats?.recentFeedbacks?.length?.toString() || "0",
        statIconColor: "bg-purple-400",
        showDetails: false,
        onClick: () => handleCardClick('userFeedbacks', 'User Feedback')
      }
    ],

    complaints: [
      {
        statIconName: "fas fa-exclamation-circle",
        statSubtitle: "TOTAL COMPLAINTS",
        statTitle: complaintStats?.total?.toString() || "0",
        statIconColor: "bg-red-500",
        showDetails: false,
        onClick: () => handleCardClick('complaints', 'Complaint')
      },
      {
        statIconName: "fas fa-clock",
        statSubtitle: "PENDING",
        statTitle: complaintStats?.pending?.toString() || "0",
        statIconColor: "bg-yellow-500",
        showDetails: false,
        onClick: () => handleCardClick('complaints', 'Complaint')
      },
      {
        statIconName: "fas fa-check-circle",
        statSubtitle: "RESOLVED",
        showDetails: false,
        statTitle: complaintStats?.resolved?.toString() || "0",
        statIconColor: "bg-green-500",
        onClick: () => handleCardClick('complaints', 'Complaint')
      },
      {
        statIconName: "fas fa-chart-line",
        statSubtitle: "RESOLUTION RATE",
        showDetails: false,
        statTitle: `${complaintStats?.resolutionRate || '0'}%`,
        statIconColor: "bg-lightBlue-600",
        onClick: () => handleCardClick('complaints', 'Complaint')
      }
    ]
  };

  const currentStats = statsConfig[pageType] || statsConfig.dashboard;

  return (
    <div className="bg-lightBlue-600 -mt-24 md:pt-32 pb-16 pt-12">
      <div className="px-4 mx-auto w-full">
        <div>
          <div className="flex flex-wrap">
            {currentStats.map((stat, index) => (
              <div
                key={index}
                className={`w-full ${isDashboard ? 'lg:w-6/12 xl:w-3/12' : 'lg:w-3/12'} px-4 mb-4`}
              >
                <CardStats 
                  {...stat} 
                  clickable={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <StatsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
      >
        {modalContent}
      </StatsModal>
    </div>
  );
};

export default StatsSection;