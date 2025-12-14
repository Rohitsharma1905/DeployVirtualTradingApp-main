
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CardStats from './CardStats';
import { selectUserStats, selectUserStatsStatus } from '../../../redux/User/userDashboardSlice';
import UserStatsGraph from "../Modals/Graphs/userStatsGraph";
import StatsModal from '../Modals/stats/StatsModal';
import Loader from '../../Common/Loader';
import { 
  fetchTransactionHistory,
  selectHoldings,
  selectStatistics,
  fetchEventSpecificTransactions,
  selectFilteredTransactions,
  fetchHoldings
} from '../../../redux/User/trading/tradingSlice';

import {
  fetchUserCertificates, // Keep this
  selectAllCertificates,
  selectCertificatesStatus,
  selectCertificatesError,
  fetchUserEvents,
  selectAllEvents
} from '../../../redux/User/events/eventsSlice';

import { useDispatch } from 'react-redux';

const StatsSection = ({ isDashboard = false, pageType = 'dashboard', eventId = null }) => {
  const userSubscriptions = useSelector(state => state.user.subscriptionPlan?.userSubscriptions || []);
  const statistics = useSelector(selectStatistics);
  // Use the selector with the eventId parameter
  const transactions = useSelector(state => selectFilteredTransactions(state, eventId));
const dispatch = useDispatch();
  // added by deepseek
  const userId = useSelector(state => state.user.auth?.user?._id);
  // end deepseek
  const activeSubscription = userSubscriptions.find(sub => 
    sub.status === 'Active' && !sub.isDeleted
  );

  const stats = useSelector(selectUserStats);
  const status = useSelector(selectUserStatsStatus);
  const certificate = useSelector(selectAllCertificates);
  console.log(certificate);
  const holdings = useSelector(selectHoldings).length;
  console.log(holdings);
  
  useEffect(() => {
    if (userId) {
      dispatch(fetchTransactionHistory({ userId, eventId: "none" }));
      dispatch(fetchHoldings({ userId, subscriptionPlanId: activeSubscription?._id }));
      dispatch(fetchUserEvents());
      dispatch(fetchUserCertificates(userId));
    }
  }, [dispatch, userId, activeSubscription?._id]);

  const events = useSelector(selectAllEvents);
    // Get certificates from Redux store
    const certificates = useSelector(selectAllCertificates);
  
  // Calculate ongoing events count
  const ongoingEventsCount = events.filter(e => {
    const now = new Date();
    return new Date(e.startDate) <= now && new Date(e.endDate) >= now;
  }).length;

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

    const nifty50Data = useSelector((state) => state.common.nifty50.data);
    const nifty500Data = useSelector((state) => state.common.nifty500.data);
    const etfData = useSelector((state) => state.common.etf.stockData);

 
  // const handleCardClick = (statType, title) => {
  //   setModalTitle(title);
    
  //   switch(statType) {
  //     case 'users':
  //       setModalContent(
  //         <UserStatsGraph 
  //           stats={stats.user} 
  //           title="Your Profile Statistics"
  //         />
  //       );
  //       break;
  //     case 'events':
  //       setModalContent(
  //         <UserStatsGraph 
  //           stats={stats.events} 
  //           title="Your Event Statistics"
  //         />
  //       );
  //       break;
  //     case 'feedbacks':
  //       setModalContent(
  //         <UserStatsGraph 
  //           stats={stats.feedback} 
  //           title="Your Feedback Statistics"
  //         />
  //       );
  //       break;
  //     case 'complaints':
  //       setModalContent(
  //         <UserStatsGraph 
  //           stats={stats.complaints} 
  //           title="Your Complaint Statistics"
  //         />
  //       );
  //       break;
  //     case 'queries':
  //       setModalContent(
  //         <UserStatsGraph 
  //           stats={stats.queries} 
  //           title="Your Query Statistics"
  //         />
  //       );
  //       break;
  //     case 'subscription':
  //       setModalContent(
  //         <UserStatsGraph 
  //           stats={stats.subscription} 
  //           title="Your Subscription Details"
  //           chartTypes={['doughnut']} // Special chart type for subscription
  //         />
  //       );
  //       break;
  //     default:
  //       setModalContent(<div>No detailed view available</div>);
  //   }
    
  //   setIsModalOpen(true);
  // };

  const handleCardClick = (statType, title) => {
    // setModalTitle(title);
    
    // let statsData, type;
    // switch(statType) {
    //   case 'users':
    //     statsData = stats.user;
    //     type = 'users';
    //     break;
    //   case 'events':
    //     statsData = stats.events;
    //     type = 'events';
    //     break;
    //   case 'feedbacks':
    //     statsData = stats.feedback;
    //     type = 'feedback';
    //     break;
    //   case 'complaints':
    //     statsData = stats.complaints;
    //     type = 'complaints';
    //     break;
    //   case 'queries':
    //     statsData = stats.queries;
    //     type = 'queries';
    //     break;
    //   case 'subscription':
    //     statsData = stats.subscription;
    //     type = 'subscription';
    //     break;
    //   case 'stocks':
    //     statsData = stats.stocks;
    //     type = 'stocks';
    //     break;
    //   case 'gallery':
    //     statsData = stats.gallery;
    //     type = 'gallery';
    //     break;
    //   default:
    //     statsData = {};
    //     type = 'users';
    // }
    
    // setModalContent(
    //   <UserStatsGraph 
    //     stats={statsData} 
    //     title={title} 
    //     type={type}
    //   />
    // );
    
    // setIsModalOpen(true);
  };

  if (status === 'loading') {
    return <Loader />;
  }

  // const commonStats = {
  //   dashboard: [
  //     {
  //       statIconName: "fas fa-user",
  //       statSubtitle: "YOUR PROFILE",
  //       statTitle: "View Stats",
  //       statIconColor: "bg-lightBlue-600",
  //       onClick: () => handleCardClick('user', 'Your Profile Stats')
  //     },
  //     {
  //       statIconName: "fas fa-calendar",
  //       statSubtitle: "YOUR EVENTS",
  //       statTitle: stats.events.total.toString(),
  //       statIconColor: "bg-indigo-500",
  //       onClick: () => handleCardClick('events', 'Your Event Stats')
  //     },
  //     {
  //       statIconName: "fas fa-comment",
  //       statSubtitle: "YOUR FEEDBACK",
  //       statTitle: stats.feedback.total.toString(),
  //       statIconColor: "bg-purple-500",
  //       onClick: () => handleCardClick('feedback', 'Your Feedback Stats')
  //     },
  //     {
  //       statIconName: "fas fa-exclamation-circle",
  //       statSubtitle: "YOUR COMPLAINTS",
  //       statTitle: stats.complaints.total.toString(),
  //       statIconColor: "bg-red-500",
  //       onClick: () => handleCardClick('complaints', 'Your Complaint Stats')
  //     }
  //   ],
  //   // Add other pageType configurations as needed
  // };

  const commonStats = {
    dashboard: [
      // {
      //   statIconName: "fas fa-users",
      //   statSubtitle: "USER STATS",
      //   statTitle: pageType !== "dashboard" ? stats?.user?.total?.toString() : "",
      //   statIconColor: "bg-lightBlue-600",
      //   showDetails: true,
      //   statItems: [
      //     { label: "Age", value: stats?.user?.age?.toString() || "0" },
      //     { label: "Gender", value: stats?.user?.gender?.toString() || "0" },
      //     // { label: "Male", value: stats?.users?.male?.toString() || "0" },
      //     // { label: "Female", value: stats?.users?.female?.toString() || "0" },
      //     // { label: "Avg Age", value: stats?.users?.averageAge?.toString() || "0" }
      //   ],
      //   onClick: () => handleCardClick('users', 'User Statistics')
      // },

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
        statIconName: "fas fa-exclamation-triangle",
        statSubtitle: "COMPLAINT STATS",
        statTitle: pageType!="dashboard" ?  "345" : "",
        statIconColor: "bg-yellow-500",
        showDetails: true,
        statItems: [
          { label: "Total", value: stats?.complaints?.total?.toString() || "0" },
          { label: "Pending", value:  stats?.complaints?.pending?.toString() || "0" },
        ],
onClick: () => handleCardClick('complaints', 'Complaint Statistics')
      },

      
      {
        statIconName: "fas fa-gem",
        statSubtitle: "PLAN STATS",
        statTitle: pageType!="dashboard" ?  stats?.subscription?.plan : "",
        showDetails: true,
        statIconColor: "bg-yellow-500",
        statItems: [
          { label: "plan", value: stats?.subscription?.plan?.toString() || "0" },
          { label: "Time", value:  stats?.subscription?.duration?.toString() || "0" },
        ],
        onClick: () => handleCardClick('subscription', 'Your Subscription Details')
      },

      {
        statIconName: "fas fa-coins",
        statSubtitle: "STOCK STATS",
        statTitle:pageType!="dashboard" ?  "-" : "",
        statIconColor: "bg-green-500",
        showDetails: true,
        statItems: [
          { label: "Nifty50", value:nifty50Data.length - 1 || "0" },
          { label: "Etf", value: etfData.length - 1 || "0" },
        ],
onClick: () => handleCardClick('stocks', 'Stock Statistics')

      },

      {
        statIconName: "fas fa-hand-holding-usd",
        statSubtitle: "HOLDING STATS",
        statTitle: pageType !== "dashboard" ? holdings?.toString() : "",
        statIconColor: "bg-pink-400",
        showDetails: true,
        statItems: [
          { label: "Total", value: holdings.toString() || "0" },
          { label: "Fees", value:"₹" + ((transactions?.length || 0) * 25).toFixed(2).toString() || "0" },
        ],
        onClick: () => handleCardClick('holdings', 'holding Statistics')
//  `₹${((transactions?.length || 0) * 25).toFixed(2)}`
      },

      
      {
        statIconName: "fas fa-calendar-alt",
        statSubtitle: "EVENT STATS",
        statTitle: pageType !== "dashboard" ? events.length.toString() : "",
        statIconColor: "bg-purple-500",
        showDetails: true,
        statItems: [
          { label: "Total", value: events.length.toString() || "0" },
          { label: "Ongoing", value: ongoingEventsCount.toString() || "0" },
        ],
        onClick: () => handleCardClick('events', 'Events Statistics')

      },
     
 

              
             

              {
                statIconName: "fas fa-award",
                statSubtitle: "CERTIFICATE STATS",
                statTitle: pageType!="dashboard" ?  stats?.subscription?.plan : "",
                showDetails: true,
                statIconColor: "bg-yellow-500",
                statItems: [
                  { label: "Total", value:certificates.length.toString() || "0" },
                  { label: "Recent", value: certificates.filter(cert => {
                    const certDate = new Date(cert.event?.endDate || cert.createdAt);
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    return certDate >= threeMonthsAgo;
                  }).length.toString() || "0" },
                ],
                onClick: () => handleCardClick('subscription', 'Your Subscription Details')
              },


              {
                statIconName: "fas fa-crown",
                statSubtitle: "----",
                statTitle: pageType!="dashboard" ?  stats?.subscription?.plan : "",
                showDetails: true,
                statIconColor: "bg-yellow-500",
                statItems: [
                  { label: "plan", value: "-".toString() || "0" },
                  { label: "Time", value: "-".toString() || "0" },
                ],
                onClick: () => handleCardClick('subscription', 'Your Subscription Details')
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
              statTitle: stats?.complaints?.pending?.toString() || 0, // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('complaints', 'Complaint Statistics')
            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "RESOLVED COMPLAINTS",
              statTitle: stats?.complaints?.resolved?.toString() || 0,// Replace with actual data
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
              statTitle: nifty50Data.length + nifty500Data.length + etfData.length - 3 || 0,
              statIconColor: "bg-purple-500",
              showDetails: false,
        onClick: () => handleCardClick('stocks', 'Stocks Statistics')

            },
            {
              statIconName: "fas fa-clock",
              statSubtitle: "NIFTY 50 ",
              statTitle: nifty50Data.length -1 || 0, // Replace with actual data
              statIconColor: "bg-blue-400",
              showDetails: false,
        onClick: () => handleCardClick('stocks', 'Stocks Statistics')
            },
            {
              statIconName: "fas fa-chart-line",
              statSubtitle: "NIFTY 500",
              statTitle: nifty500Data.length - 1 || 0,// Replace with actual data
              statIconColor: "bg-green-400",
              showDetails: false,
        onClick: () => handleCardClick('stocks', 'Stocks Statistics')
            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "ETF",
              statTitle: etfData.length - 1 || 0, // Replace with actual data
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

          trading: [
            {
              statIconName: "fas fa-inbox",
              statSubtitle: "VIRTUAL AMOUNT",
              statTitle: `₹${activeSubscription?.vertualAmount?.toFixed(2).toString() || "0"}`,
              statIconColor: "bg-purple-500",
              showDetails: true,
              // statItems: [
              //   { 
              //     label: "Initial Balance", 
              //     value: `₹${activeSubscription?.initialAmount?.toFixed(2) || "0"}` 
              //   },
              //   { 
              //     label: "Current Balance", 
              //     value: `₹${activeSubscription?.vertualAmount?.toFixed(2) || "0"}` 
              //   },
              // ]
            },
            {
              statIconName: "fas fa-money-bill",
              statSubtitle: "TOTAL FEES",
              statTitle: `₹${((transactions?.length || 0) * 25).toFixed(2)}`,
              statIconColor: "bg-blue-400",
              showDetails: true,
              // statItems: [
              //   { 
              //     label: "Transactions", 
              //     value: transactions?.length || 0 
              //   },
              //   { 
              //     label: "Fee per Trade", 
              //     value: "₹25.00" 
              //   },
              // ]
            },
            // {
            //   statIconName: "fas fa-chart-line",
            //   statSubtitle: "PERFORMANCE",
            //   statTitle: (() => {
            //     // Get all buy and sell trades
            //     const buyTrades = transactions?.filter(t => t.type === 'buy');
            //     const sellTrades = transactions?.filter(t => t.type === 'sell');
          
            //     // Count profitable trades
            //     const profitableTrades = sellTrades?.filter(sellTrade => {
            //       // Find the matching buy trade for this stock
            //       const buyTrade = buyTrades?.find(bt => 
            //         bt.companySymbol === sellTrade.companySymbol
            //       );
          
            //       if (buyTrade) {
            //         // Calculate total sell value and buy value
            //         const sellValue = sellTrade.price * sellTrade.numberOfShares;
            //         const buyValue = buyTrade.price * sellTrade.numberOfShares;
                    
            //         // A trade is profitable if sell value > buy value + portal fee
            //         return (sellValue - buyValue - 25) > 0;
            //       }
            //       return false;
            //     }).length;
          
            //     // Calculate success rate
            //     const totalSellTrades = sellTrades?.length || 0;
            //     const successRate = totalSellTrades > 0 
            //       ? ((profitableTrades / totalSellTrades) * 100).toFixed(2) 
            //       : "0.00";
          
            //     // Return with color coding
            //     return (
            //       <span className={Number(successRate) > 0 ? 'text-green-500' : 'text-red-500'}>
            //         {successRate}%
            //       </span>
            //     );
            //   })(),
            //   statIconColor: "bg-green-400",
            //   showDetails: true,
            //   // statItems: [
            //   //   { 
            //   //     label: "Buy Trades", 
            //   //     value: transactions?.filter(t => t.type === 'buy')?.length || 0 
            //   //   },
            //   //   { 
            //   //     label: "Sell Trades", 
            //   //     value: transactions?.filter(t => t.type === 'sell')?.length || 0 
            //   //   },
            //   //   { 
            //   //     label: "Profitable Trades",
            //   //     value: (() => {
            //   //       const buyTrades = transactions?.filter(t => t.type === 'buy');
            //   //       const sellTrades = transactions?.filter(t => t.type === 'sell');
                    
            //   //       return sellTrades?.filter(sellTrade => {
            //   //         const buyTrade = buyTrades?.find(bt => 
            //   //           bt.companySymbol === sellTrade.companySymbol
            //   //         );
            //   //         if (buyTrade) {
            //   //           const sellValue = sellTrade.price * sellTrade.numberOfShares;
            //   //           const buyValue = buyTrade.price * sellTrade.numberOfShares;
            //   //           return (sellValue - buyValue - 25) > 0;
            //   //         }
            //   //         return false;
            //   //       }).length || 0;
            //   //     })()
            //   //   }
            //   // ]
            // },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "HOLDINGS",
              statTitle: holdings?.toString() , // Replace with actual data
              statIconColor: "bg-gray-400",
              showDetails: false
            },
            {
              statIconName: "fas fa-tags",
              statSubtitle: "PROFIT & LOSS",
              statTitle: (() => {
                // Calculate total P&L
                const totalPL = transactions?.reduce((acc, transaction) => {
                  if (transaction.type === 'sell') {
                    const buyTrade = transactions.find(bt => 
                      bt.type === 'buy' && bt.companySymbol === transaction.companySymbol
                    );
                    if (buyTrade) {
                      const profitLoss = (
                        (transaction.price - buyTrade.price) * transaction.numberOfShares
                      ) - 25; // Subtract portal fee
                      return acc + profitLoss;
                    }
                  }
                  return acc;
                }, 0) || 0;
          
                // Add color based on profit/loss
                const color = totalPL >= 0 ? 'text-green-500' : 'text-red-500';
                return (
                  <span className={color}>
                    ₹{totalPL.toFixed(2)}
                  </span>
                );
              })(),
              statIconColor: "bg-gray-400",
              showDetails: true,
              // statItems: [
              //   { 
              //     label: "Realized P&L", 
              //     value: (() => {
              //       const realizedPL = transactions?.reduce((acc, transaction) => {
              //         if (transaction.type === 'sell') {
              //           const buyTrade = transactions.find(bt => 
              //             bt.type === 'buy' && bt.companySymbol === transaction.companySymbol
              //           );
              //           if (buyTrade) {
              //             const profitLoss = (
              //               (transaction.price - buyTrade.price) * transaction.numberOfShares
              //             ) - 25;
              //             return acc + profitLoss;
              //           }
              //         }
              //         return acc;
              //       }, 0) || 0;
              //       return `₹${realizedPL.toFixed(2)}`;
              //     })()
              //   },
              //   { 
              //     label: "Unrealized P&L", 
              //     value: (() => {
              //       // Calculate unrealized P&L from current holdings
              //       const unrealizedPL = holdings.reduce((acc, holding) => {
              //         const buyTrade = transactions.find(t => 
              //           t.type === 'buy' && t.companySymbol === holding.companySymbol
              //         );
              //         if (buyTrade) {
              //           const currentValue = holding.quantity * holding.averageBuyPrice;
              //           const costBasis = holding.quantity * buyTrade.price;
              //           return acc + (currentValue - costBasis);
              //         }
              //         return acc;
              //       }, 0);
              //       return `₹${unrealizedPL.toFixed(2)}`;
              //     })()
              //   },
              // ]
            }
          ],
  };

  const currentStats = commonStats[pageType] || commonStats.dashboard;

  return (
    <div className="bg-lightBlue-600 md:pt-10 pb-16">
      <div className="px-4 mx-auto w-full">
        <div className="flex flex-wrap">
          {currentStats.map((stat, index) => (
            <div key={index} className={`w-full ${isDashboard ? 'lg:w-6/12 xl:w-3/12' : 'lg:w-3/12'} px-4 mb-4`}>
              <CardStats 
                {...stat} 
                clickable={true}
              />
            </div>
          ))}
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