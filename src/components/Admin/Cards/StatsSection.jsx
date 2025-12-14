






import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CardStats from './CardStats';
import { fetchDashboardStats, selectDashboardStats, selectDashboardStatus } from '../../../redux/User/userSlice';
import {UserStatsGraph} from "../Modals/graphs/UserStatsGraph";
import {OrganizationStatsGraph} from "../Modals/graphs/OrganizationStatsGraph";
import Loader from '../../Common/Loader';
import StatsModal from '../Modals/stats/StatsModal';
// import { FeedbackStatsGraph } from '../Modals/graphs/feedbackStatsGraph';
import { FeedbackStatsGraph } from '../Modals/graphs/FeedbackStatsGraph';
import { EventStatsGraph } from '../Modals/graphs/EventStatsGraph';
import { StockStatsGraph } from '../Modals/graphs/StockStatsGraph';
import { ComplaintStatsGraph } from '../Modals/graphs/ComplaintStatsGraph';
import { QueryStatsGraph } from '../Modals/graphs/QueryStatsGraph';
import { GalleryStatsGraph } from '../Modals/graphs/GalleryStatsGraph';
import { StatsGraph } from '../Modals/graphs/StatsGraph';
const StatsSection = ({ isDashboard = false, pageType = 'dashboard' }) => {
  const dispatch = useDispatch();
  const stats = useSelector(selectDashboardStats);
  const status = useSelector(selectDashboardStatus);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [modalTitle, setModalTitle] = useState('');
  
  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const handleCardClick = (statType, title) => {
    setModalTitle(title);
    
    // Set the appropriate graph component based on statType
    switch(statType) {
      case 'users':
        // setModalContent(<UserStatsGraph stats={stats?.users} />);
        setModalContent(<StatsGraph
          stats={stats?.users}
          title="User"
          chartLabels={[
            'Total Users', 
            'Active Users', 
            'Deactive Users', 
            'Male Users', 
            'Female Users', 
            'Other Genders', 
            'Avg Age'
          ]}
          chartDataKeys={[
            'total', 
            'active', 
            'deactive', 
            'male', 
            'female', 
            'other', 
            'averageAge'
          ]}
          statsDetails={[
            { label: 'Total Users', key: 'total' },
            { label: 'Active Users', key: 'active' },
            { label: 'Deactive Users', key: 'deactive' },
            { label: 'Male Users', key: 'male' },
            { label: 'Female Users', key: 'female' },
            { label: 'Other Genders', key: 'other' },
            { label: 'Average Age', key: 'averageAge', unit: 'years' }
          ]}
        />);
        break;
      case 'organizations':
        // setModalContent(<OrganizationStatsGraph stats={stats?.organizations} />);
        setModalContent(<StatsGraph
          stats={stats?.organizations}
          title="Organization"
          chartLabels={[
            'Total Orgs', 
            'Active Orgs', 
            'Pending Orgs',
            'Total Users',
            'Male Users',
            'Female Users',
            'Avg Age'
          ]}
          chartDataKeys={[
            'totalOrganizations',
            'activeOrgs',
            'pendingOrgs',
            'totalUsers',
            'maleUsers',
            'femaleUsers',
            'averageAge'
          ]}
          statsDetails={[
            { label: 'Total Organizations', key: 'totalOrganizations' },
            { label: 'Active Organizations', key: 'activeOrgs' },
            { label: 'Pending Organizations', key: 'pendingOrgs' },
            { label: 'Total Users', key: 'totalUsers' },
            { label: 'Male Users', key: 'maleUsers' },
            { label: 'Female Users', key: 'femaleUsers' },
            { label: 'Average Age', key: 'averageAge', unit: 'years' }
          ]}
        />);
        break;

        case 'feedbacks':
          setModalContent(<FeedbackStatsGraph stats={stats?.feedback} />);
          // setModalContent(<StatsGraph
          //   stats={stats?.feedback}
          //   title="Feedback"
          //   chartLabels={[
          //     'Total Feedback',
          //     'Average Rating',
          //     'Recommendation Rate',
          //     'Positive (4-5 stars)',
          //     'Negative (1-2 stars)'
          //   ]}
          //   chartDataKeys={[
          //     'total',
          //     'averageRating',
          //     'recommendationRate',
          //     'totalPositive',
          //     'totalNegative'
          //   ]}
          //   statsDetails={[
          //     { label: 'Total Feedback', key: 'total' },
          //     { label: 'Average Rating', key: 'averageRating' },
          //     { label: 'Recommendation Rate', key: 'recommendationRate', unit: '%' },
          //     { label: 'Positive Feedback', key: 'totalPositive' },
          //     { label: 'Negative Feedback', key: 'totalNegative' },
          //     { label: 'Most Popular Category', 
          //       key: 'mostPopularCategory._id', 
          //       defaultValue: 'N/A',
          //       format: (val, stats) => `${stats.mostPopularCategory?._id || 'N/A'} (${stats.mostPopularCategory?.total || 0})`
          //     }
          //   ]}
          //   chartTypes={['bar', 'pie', 'doughnut']}
          // />);

          break;

          case 'events':
            setModalContent(<EventStatsGraph stats={stats?.events} />);
            break;

            case 'stocks':
              setModalContent(<StockStatsGraph stats={stats?.stocks} />);
              break;

              case 'complaints':
                setModalContent(<ComplaintStatsGraph stats={stats?.complaints} />);
                break;

                case 'queries':
                  setModalContent(<QueryStatsGraph stats={stats?.queries} />);
                  break;

                  case 'gallery':
                    setModalContent(<GalleryStatsGraph stats={stats?.gallery} />);
                    break;
      // Add cases for other stat types
      default:
        setModalContent(<div>No detailed view available</div>);
    }
    
    setIsModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // Common stats configuration
  const commonStats = {
    dashboard: [
      {
        statIconName: "fas fa-users",
        statSubtitle: "USER STATS",
        statTitle: pageType !== "dashboard" ? stats?.users?.total?.toString() : "",
        statIconColor: "bg-lightBlue-600",
        showDetails: true,
        statItems: [
          { label: "Total", value: stats?.users?.total?.toString() || "0" },
          { label: "Active", value: stats?.users?.active?.toString() || "0" },
       
        ],
        onClick: () => handleCardClick('users', 'User Statistics')
      },
      {
        statIconName: "fas fa-building",
        statSubtitle: "ORG STATS",
        statTitle: pageType !== "dashboard" ? stats?.organizations?.totalOrganizations?.toString() : "",
        statIconColor: "bg-indigo-500",
        showDetails: true,
        statItems: [
          { label: "Total", value: stats?.organizations?.totalOrganizations?.toString() || "0" },
          { label: "Active", value: stats?.organizations?.activeOrgs?.toString() || "0" },

        ],
        onClick: () => handleCardClick('organizations', 'Organizations Statistics')

      },
      {
        statIconName: "fas fa-calendar-alt",
        statSubtitle: "EVENT STATS",
        statTitle: pageType !== "dashboard" ? stats?.events?.total?.toString() : "",
        statIconColor: "bg-purple-500",
        showDetails: true,
        statItems: [
          { label: "Total", value: stats?.events?.total?.toString() || "0" },
          { label: "Upcoming", value: stats?.events?.upcoming?.toString() || "0" },

        ],
        onClick: () => handleCardClick('events', 'Events Statistics')

      },
      {
        statIconName: "fas fa-comment-alt",
        statSubtitle: "FEEDBACK STATS",
        statTitle: pageType !== "dashboard" ? stats?.feedback?.total?.toString() : "",
        statIconColor: "bg-blue-400",
        showDetails: true,
        statItems: [
          { label: "Total", value: stats?.feedback?.total?.toString() || "0" },
          { label: "Rating", value: stats?.feedback?.averageRating?.toString() || "0" },
        ],
        onClick: () => handleCardClick('feedbacks', 'Feedback Statistics')
      },
      {
        statIconName: "fas fa-question-circle",
        statSubtitle: "QUERY STATS",
        statTitle: pageType !== "dashboard" ? stats?.queries?.total?.toString() : "",
        statIconColor: "bg-pink-400",
        showDetails: true,
        statItems: [
          { label: "Total", value: stats?.queries?.total?.toString() || "0" },
          { label: "Recent", value: stats?.queries?.recentQueries?.count?.toString() || "0" },
        ],
        onClick: () => handleCardClick('queries', 'Query Statistics')

      },
      {
                statIconName: "fas fa-boxes",
                statSubtitle: "STOCK STATS",
                statTitle:pageType!="dashboard" ?  "-" : "",
                statIconColor: "bg-green-500",
                showDetails: true,
                statItems: [
                  { label: "Nifty50", value:stats?.stocks?.nifty50 - 1?.toString() || "0" },
                  // { label: "nifty500", value: stats?.stocks?.nifty500 - 1?.toString() || "0" },
                  { label: "Etf", value: stats?.stocks?.etf - 1?.toString() || "0" },
             
                ],
        onClick: () => handleCardClick('stocks', 'Stock Statistics')

              },
              {
                statIconName: "fas fa-images",
                statSubtitle: "GALLERY STATS",
                statTitle: pageType!="dashboard" ?  "-" : "",
                statIconColor: "bg-gray-500",
                showDetails: true,
                statItems: [
                  { label: "Total", value: stats?.gallery?.totalPhotos?.toString() || "0" },
                  { label: "Category", value: stats?.gallery?.totalCategories?.toString() || "0" },
                ],
        onClick: () => handleCardClick('gallery', 'Gallery Statistics')
              },
              {
                statIconName: "fas fa-exclamation-triangle",
                statSubtitle: "COMPLAINT STATS",
                statTitle: pageType!="dashboard" ?  "345" : "",
                statIconColor: "bg-yellow-500",
                showDetails: true,
                statItems: [
                  { label: "Total", value: stats?.complaints?.total?.toString() || "0" },
                  { label: "Pending", value:  stats?.complaints?.pendingComplaint?.toString() || "0" },
                ],
        onClick: () => handleCardClick('complaints', 'Complaint Statistics')
              }
    ],
    // ... (keep the rest of your configurations the same)
    users: [
            {
              statIconName: "fas fa-users",
              statSubtitle: "TOTAL USERS",
              statTitle: stats?.users?.total.toString(),
              statIconColor: "bg-lightBlue-600",
              showDetails: false,
              onClick: () => handleCardClick('users', 'User Statistics')
            },
            {
              statIconName: "fas fa-male",
              statSubtitle: "AVG AGE",
              statTitle: stats?.users?.averageAge?.toString(),
              statIconColor: "bg-blue-400",
              showDetails: false,
             onClick: () => handleCardClick('users', 'User Statistics')
            },
            {
              statIconName: "fas fa-female",
              statSubtitle: "DEACTIVE USERS",
              statTitle: stats?.users?.deactive?.toString(),
              statIconColor: "bg-pink-400",
              showDetails: false,
            onClick: () => handleCardClick('users', 'User Statistics')

            },
            {
              statIconName: "fas fa-user-check",
              statSubtitle: "ACTIVE USERS",
              statTitle: stats?.users?.active?.toString() ,
              statIconColor: "bg-green-500",
              showDetails: false,
              onClick: () => handleCardClick('users', 'User Statistics')

            }
          ],
          organizations: [
            {
              statIconName: "fas fa-building",
              statSubtitle: "TOTAL ORGS",
              statTitle: stats?.organizations?.totalOrganizations?.toString(),
              statIconColor: "bg-indigo-500",
              showDetails: false,
        onClick: () => handleCardClick('organizations', 'Organizations Statistics')

            },
            {
              statIconName: "fas fa-check-circle",
              statSubtitle: "ACTIVE ORGS",
              statTitle: stats?.organizations?.activeOrgs?.toString(),
              statIconColor: "bg-green-500",
              showDetails: false,
        onClick: () => handleCardClick('organizations', 'Organizations Statistics')

            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "PENDING ORGS",
              statTitle: stats?.organizations?.pendingOrgs?.toString(),
              statIconColor: "bg-yellow-500",
              showDetails: false,
        onClick: () => handleCardClick('organizations', 'Organizations Statistics')

            },
            {
              statIconName: "fas fa-ban",
              statSubtitle: "REJECTED ORGS",
              statTitle: stats?.organizations?.rejectedOrgs?.toString(),
              statIconColor: "bg-red-500",
              showDetails: false,
        onClick: () => handleCardClick('organizations', 'Organizations Statistics')
            }
          ],
          events: [
            {
              statIconName: "fas fa-calendar-alt",
              statSubtitle: "TOTAL EVENTS",
              statTitle: stats?.events?.total?.toString(),
              statIconColor: "bg-purple-500",
              showDetails: false,
        onClick: () => handleCardClick('events', 'Events Statistics')

            },
            {
              statIconName: "fas fa-check",
              statSubtitle: "UPCOMING",
              statTitle: stats?.events?.upcoming?.toString(), // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('events', 'Events Statistics')

            },
            {
              statIconName: "fas fa-running",
              statSubtitle: "ONGOING",
              statTitle: stats?.events?.ongoing?.toString(), // Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false,
        onClick: () => handleCardClick('events', 'Events Statistics')

            },
            {
              statIconName: "fas fa-history",
              statSubtitle: "COMPLETED",
              statTitle: stats?.events?.completed?.toString(), // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false,
        onClick: () => handleCardClick('events', 'Events Statistics')
            }
          ],
          queries: [
            {
              statIconName: "fas fa-inbox",
              statSubtitle: "TOTAL QUERIES",
              statTitle: stats?.queries?.total?.toString() || "0" ,
              statIconColor: "bg-purple-500",
              showDetails: false,
        onClick: () => handleCardClick('queries', 'Query Statistics')

            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "RECENT QUERIES",
              statTitle: stats?.queries?.recentQueries?.count?.toString() || 0, // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('queries', 'Query Statistics')

            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "POPULAR TIMES",
              statTitle: stats?.queries?.popularTimes?.toString() || 0,// Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false,
        onClick: () => handleCardClick('queries', 'Query Statistics')

            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "CATEGORY",
              statTitle:  "4", // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false,
        onClick: () => handleCardClick('queries', 'Query Statistics')

            }
          ],
          feedbacks: [
            {
              statIconName: "fas fa-envelope-open-text",
              statSubtitle: "TOTAL FEEDBACKS",
              statTitle:stats?.feedback?.total?.toString(),
              statIconColor: "bg-purple-500",
              showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback Statistics')
            },
            {
              statIconName: "fas fa-star",
              statSubtitle: "AVG RATING",
              // statTitle: stats?.feedback?.averageRating?.toString(), // Replace with actual data
              statTitle: (
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const avgRating = parseFloat(stats?.feedback?.averageRating || 0);
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
                    {/* {stats?.feedback?.averageRating?.toFixed(1)} */}
                  </span>
                </div>
              ),
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback Statistics')
            },
            {
              statIconName: "fas fa-smile-beam",
              statSubtitle: "RECOMMENDATION",
    
              statTitle: (
                <div className="flex items-center">
                
                  <span className="ml-2 text-lg font-semibold ">
                    {stats?.feedback?.recommendationRate}%
                  </span>
                </div>
              ),
              statIconColor: "bg-green-400",
              showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback Statistics')
            },
            {
              statIconName: "fas fa-list-ul",
              statSubtitle: "CATEGORY",
              statTitle: "6" , // Replace with actual data
              
              statIconColor: "bg-gray-400",
              showDetails: false,
        onClick: () => handleCardClick('feedbacks', 'Feedback Statistics')
            }
          ],
          complaints: [
            {
              statIconName: "fas fa-inbox",
              statSubtitle: "TOTAL COMPLAINTS",
              statTitle: stats?.complaints?.total?.toString() || 0,
              statIconColor: "bg-purple-500",
              showDetails: false,
        onClick: () => handleCardClick('complaints', 'Complaint Statistics')
            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "PENDING COMPLAINTS",
              statTitle: stats?.complaints?.pendingComplaint?.toString() || 0, // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('complaints', 'Complaint Statistics')
            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "RESOLVED COMPLAINTS",
              statTitle: stats?.complaints?.resolvedComplaints?.toString() || 0,// Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false,
        onClick: () => handleCardClick('complaints', 'Complaint Statistics')
            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "CATEGORY",
              statTitle:  "5", // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false,
        onClick: () => handleCardClick('complaints', 'Complaint Statistics')
            }
          ],
          stocks: [
            {
              statIconName: "fas fa-inbox",
              statSubtitle: "TOTAL STOCKS / ETF",
              statTitle: stats?.stocks?.all - 3?.toString() || 0,
              statIconColor: "bg-purple-500",
              showDetails: false,
        onClick: () => handleCardClick('stocks', 'Stocks Statistics')

            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "NIFTY 50 ",
              statTitle: stats?.stocks?.nifty50 - 1?.toString() || 0, // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('stocks', 'Stocks Statistics')
            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "NIFTY 500",
              statTitle: stats?.stocks?.nifty500 - 1?.toString() || 0,// Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false,
        onClick: () => handleCardClick('stocks', 'Stocks Statistics')
            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "ETF",
              statTitle: stats?.stocks?.etf - 1?.toString() || 0, // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false,
        onClick: () => handleCardClick('stocks', 'Stocks Statistics')
            }
          ],
          galleryImages: [
            {
              statIconName: "fas fa-inbox",
              statSubtitle: "TOTAL PHOTOS",
              statTitle: stats?.gallery?.totalPhotos?.toString() || "0",
              statIconColor: "bg-purple-500",
              showDetails: false,
        onClick: () => handleCardClick('gallery', 'Gallery Statistics')

            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "ACTIVE",
              statTitle: "-", // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('gallery', 'Gallery Statistics')
              
            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "DELETED",
              statTitle: "-",// Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false,
        onClick: () => handleCardClick('gallery', 'Gallery Statistics')
            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "NEW",
              statTitle: "-", // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false,
        onClick: () => handleCardClick('gallery', 'Gallery Statistics')
            }
          ],
          galleryCategories: [
            {
              statIconName: "fas fa-inbox",
              statSubtitle: "CATEGORY",
              statTitle: stats?.gallery?.totalCategories?.toString() || "0",
              statIconColor: "bg-purple-500",
              showDetails: false
            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "ACTIVE",
              statTitle: "-", // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false
            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "DELETED",
              statTitle: "-",// Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false
            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "NEW",
              statTitle: "-", // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false
            }
          ],

          participants: [
            {
              statIconName: "fas fa-inbox",
              statSubtitle: "CATEGORY",
              statTitle: stats?.gallery?.totalCategories?.toString() || "0",
              statIconColor: "bg-purple-500",
              showDetails: false
            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "ACTIVE",
              statTitle: "-", // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false
            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "DELETED",
              statTitle: "-",// Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false
            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "NEW",
              statTitle: "-", // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false
            }
          ],
  };

  // Get the appropriate stats based on page type
  const currentStats = commonStats[pageType] || commonStats.dashboard;

  return (
    <div className="bg-lightBlue-600 md:pt-32 -mt-17 pb-16 pt-12">
      <div className="px-4 mx-auto w-full">
        <div>
          <div className="flex flex-wrap">
            {currentStats.map((stat, index) => (
              <div
                key={index}
                className={`w-full ${isDashboard ? 'lg:w-6/12 xl:w-3/12' : 'lg:w-3/12'} px-4 mb-4`}
              >
                {/* <CardStats {...stat} /> */}
                <CardStats 
                  {...stat} 
                  onClick={stat.onClick}
                  clickable={!!stat.onClick}
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