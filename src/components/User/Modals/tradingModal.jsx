import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ChevronDown, BookUser, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Redux imports
import {
  fetchTransactionHistory,
  selectHoldings,
  selectStatistics,
  fetchEventSpecificTransactions,
  selectFilteredTransactions,
} from "../../../redux/User/trading/tradingSlice";
import { getUserSubscriptions } from "../../../redux/User/userSubscriptionPlan/userSubscriptionPlansSlice";
import {
  selectActiveEvent,
  selectActiveEvents,
  setActiveEvent,
  fetchUserEvents,
} from "../../../redux/User/events/eventsSlice";

// Component imports
import StockDetailsModal from "./StockDetailsModal";
import PortfolioTable from "./PortfolioTable";
import StatsSection from "../Cards/StatsSection";
import { useUserStats } from "../../../hooks/userUserStats";
import logoImage from "../../../assets/img/PGR_logo.jpeg";

const UserPortfolioPage = () => {
  const { refetch } = useUserStats();
  const dispatch = useDispatch();
  const location = useLocation();
  const activeEvent = useSelector(selectActiveEvent);
  const activeEvents = useSelector(selectActiveEvents);
  const userId = useSelector((state) => state.user.auth?.user?._id);
  const user = useSelector((state) => state.user.auth?.user || {});
  const userSubscriptions = useSelector(
    (state) => state.user.subscriptionPlan?.userSubscriptions || []
  );

  const [selectedStock, setSelectedStock] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const transactions = useSelector((state) =>
    selectFilteredTransactions(state, activeEvent?._id || "none")
  );
  const holdings = useSelector(selectHoldings);
  const statistics = useSelector(selectStatistics);

  const activeSubscription = userSubscriptions.find(
    (sub) => sub.status === "Active" && !sub.isDeleted
  );

  useEffect(() => {
    const initializeEvent = async () => {
      if (location.state?.eventId) {
        try {
          let event = activeEvents.find((e) => e._id === location.state.eventId);
          
          if (!event) {
            await dispatch(fetchUserEvents());
            const updatedEvents = useSelector(selectActiveEvents);
            event = updatedEvents.find((e) => e._id === location.state.eventId);
          }
          
          if (event) {
            dispatch(setActiveEvent(event));
          }
        } catch (error) {
          console.error("Error initializing event:", error);
        }
      }
      setIsLoading(false);
    };

    initializeEvent();
  }, [location.state, dispatch]);

  useEffect(() => {
    if (location.state?.eventId) {
      const event = activeEvents.find((e) => e._id === location.state.eventId);
      if (event) {
        dispatch(setActiveEvent(event));
      } else {
        dispatch(fetchUserEvents()).then(() => {
          const foundEvent = useSelector(selectActiveEvents).find(
            (e) => e._id === location.state.eventId
          );
          if (foundEvent) {
            dispatch(setActiveEvent(foundEvent));
          }
        });
      }
    }
  }, [location.state, activeEvents, dispatch]);

  useEffect(() => {
    if (userId && !isLoading) {
      dispatch(getUserSubscriptions(userId));
      
      if (activeEvent?._id) {
        dispatch(
          fetchEventSpecificTransactions({
            userId,
            eventId: activeEvent._id,
          })
        );
      } else {
        dispatch(
          fetchTransactionHistory({
            userId,
            eventId: "none",
          })
        );
      }
    }
  }, [dispatch, userId, activeEvent, isLoading]);

  const handleStockClick = (symbol, type) => {
    const stockTransactions = transactions
      .filter((t) => t.companySymbol === symbol)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const stockHolding = holdings.find((h) => h.companySymbol === symbol);
    
    console.log(`UserPortfolioPage: Clicked ${symbol}, received type: ${type}`);

    setSelectedStock({
      symbol,
      transactions: stockTransactions,
      holding: stockHolding,
      type: type
    });
    setShowDetailsModal(true);
  };

  const generatePDF = async () => {
    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageCenter = pageWidth / 2;
      const margin = 15; // Page margin
      const contentWidth = pageWidth - 2 * margin;
      let currentY = 20; // Initial Y position

      // --- Header Section ---
      const getBase64FromImageUrl = async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error("Error fetching or converting image:", error);
          return null;
        }
      };

      const logoBase64 = await getBase64FromImageUrl(logoImage);
      const logoWidth = 45;
      const logoHeight = 45;

      if (logoBase64) {
        doc.addImage(logoBase64, 'JPEG', pageCenter - logoWidth / 2, currentY, logoWidth, logoHeight);
        currentY += logoHeight + 8;
      } else {
        currentY += 10;
      }

      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 37, 41);
      doc.text("PGR - Virtual Trading App", pageCenter, currentY, { align: "center" });
      currentY += 8;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(`User: ${user.name || "N/A"} (ID: ${user.id || userId || "N/A"})`, pageCenter, currentY, { align: "center" });
      currentY += 6;
      doc.text(`Portfolio: ${activeEvent ? activeEvent.title : "Basic Trading"}`, pageCenter, currentY, { align: "center" });
      currentY += 6;
      const generatedDate = new Date().toLocaleDateString("en-GB", {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      }).replace(",", "");
      doc.text(`Generated on: ${generatedDate}`, pageCenter, currentY, { align: "center" });
      currentY += 10;

      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 12;

      // --- Portfolio Holdings Section ---
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(33, 37, 41);
      doc.text("Portfolio Holdings", margin, currentY);
      currentY += 6;

      const holdingsData = holdings && holdings.length > 0 ? holdings.map((holding) => {
        const stockTransactions = transactions?.filter(t => t.companySymbol === holding.companySymbol) || [];
        const buyTransactions = stockTransactions.filter(t => t.type === "buy");
        const sellTransactions = stockTransactions.filter(t => t.type === "sell");
        const avgPrice = holding.averageBuyPrice || 0;
        const quantity = holding.quantity || 0;
        const value = quantity * avgPrice;

        return [
          holding.companySymbol || "N/A",
          quantity,
          `₹${avgPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `₹${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          buyTransactions.length,
          sellTransactions.length,
          holding.lastUpdated ? new Date(holding.lastUpdated).toLocaleDateString('en-GB') : "N/A",
        ];
      }) : [["No holdings data available.", "", "", "", "", "", ""]];

      autoTable(doc, {
        startY: currentY,
        head: [["Symbol", "Qty", "Avg Price", "Value", "Buys", "Sells", "Last Updated"]],
        body: holdingsData,
        theme: "grid",
        headStyles: {
          fillColor: [22, 162, 184],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 35, halign: "left" },
          1: { cellWidth: 20, halign: "left" },
          2: { cellWidth: 35, halign: "left" },
          3: { cellWidth: 35, halign: "left" },
          4: { cellWidth: 20, halign: "left" },
          5: { cellWidth: 20, halign: "left" },
          6: { cellWidth: 30, halign: "left" },
        },
        styles: {
          fontSize: 9,
          cellPadding: 2.5,
          valign: 'middle',
        },
        margin: { left: margin, right: margin },
      });

      currentY = doc.lastAutoTable.finalY + 12;

      // --- Portfolio Statistics Section ---
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 12;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Portfolio Statistics", margin, currentY);
      currentY += 6;

      const feePerTransaction = 25;
      const totalFees = (transactions?.length || 0) * feePerTransaction;
      const virtualBalance = activeSubscription?.vertualAmount || 0;
      const realizedPL = statistics?.realizedPL || 0;

      const statsBody = [
        ["Total Holdings", holdings?.length || 0],
        ["Virtual Balance", `₹${virtualBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ["Total Fees Paid", `₹${totalFees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
        ["Net Realized P/L", `₹${realizedPL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`],
      ];

      autoTable(doc, {
        startY: currentY,
        body: statsBody,
        theme: 'plain',
        columnStyles: {
          0: { fontStyle: "bold", cellWidth: 60, halign: 'left' },
          1: { halign: "right", cellWidth: contentWidth - 60 },
        },
        styles: {
          fontSize: 11,
          cellPadding: 3,
        },
        margin: { left: margin, right: margin },
        tableWidth: 'auto',
      });

      currentY = doc.lastAutoTable.finalY + 12;

      // --- Stock Activity History Section ---
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 12;

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Stock Activity History", margin, currentY);
      currentY += 6;

      const activityData = transactions && transactions.length > 0 ? transactions.map((transaction) => {
        const transactionAmount = (transaction.price || 0) * (transaction.numberOfShares || 0);
        return [
          transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString('en-GB') : "N/A",
          transaction.createdAt ? new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A",
          transaction.companySymbol || "N/A",
          transaction.type?.toUpperCase() || "N/A",
          transaction.numberOfShares || 0,
          `₹${(transaction.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `₹${transactionAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          `₹${feePerTransaction.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        ];
      }) : [["No transaction data available.", "", "", "", "", "", "", ""]];

      autoTable(doc, {
        startY: currentY,
        head: [["Date", "Time", "Symbol", "Type", "Qty", "Price", "Amount", "Fee"]],
        body: activityData,
        theme: "grid",
        headStyles: {
          fillColor: [22, 162, 184],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 20, halign: "left" },
          1: { cellWidth: 20, halign: "left" },
          2: { cellWidth: 35, halign: "left" },
          3: { cellWidth: 15, halign: "left" },
          4: { cellWidth: 15, halign: "left" },
          5: { cellWidth: 35, halign: "left" },
          6: { cellWidth: 35, halign: "left" },
          7: { cellWidth: 25, halign: "left" },
        },
        styles: {
          fontSize: 8.5,
          cellPadding: 2,
          valign: 'middle',
        },
        margin: { left: margin, right: margin },
      });

      // --- Footer ---
      const footerY = pageHeight - 18;
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.setFont("helvetica", "normal");
      doc.text("Contact Us:", pageCenter, footerY, { align: "center" });
      doc.text("Email: praedicoglobalresearch@gmail.com | Phone: +91 (555) 123-4567", pageCenter, footerY + 4, { align: "center" });
      doc.text("© 2025 PGR Virtual Trading App. All rights reserved.", pageCenter, footerY + 8, { align: "center" });

      // --- Save PDF ---
      const filename = `PGR_Portfolio_${user.name || "User"}_${activeEvent ? activeEvent.title.replace(/[^a-z0-9]/gi, "_") : "Basic"}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF report. Please check the console for errors.");
    }
  };

  // Event dropdown component
  const EventDropdown = ({ activeEvent, onSelectEvent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const activeEvents = useSelector(selectActiveEvents);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow border border-gray-200 hover:bg-gray-50"
        >
          <span className="font-medium">
            {activeEvent ? activeEvent.title : "Basic Transactions"}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <button
              onClick={() => {
                onSelectEvent(null);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                !activeEvent ? "bg-blue-50 text-lightBlue-600" : "text-gray-700"
              }`}
            >
              Basic Transactions
            </button>
            {activeEvents.map((event) => (
              <button
                key={event._id}
                onClick={() => {
                  onSelectEvent(event);
                  setIsOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                  activeEvent?._id === event._id
                    ? "bg-blue-50 text-lightBlue-600"
                    : "text-gray-700"
                }`}
              >
                {event.title}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Main component render
  return (
    <div className="pb-10">
      <div className="-mt-24">
        <StatsSection isDashboard={false} pageType="trading" />
      </div>

      <div className="px-4 md:px-8 mx-4 -mt-12">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center">
              <BookUser className="text-gray-600 mr-2" size={24} />
              <h2 className="text-xl font-bold text-gray-800">
                {activeEvent
                  ? `${activeEvent.title} Portfolio`
                  : "Basic Trading Portfolio"}
              </h2>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
              <button
                onClick={generatePDF}
                className="flex items-center mt-2 mr-2 space-x-2 bg-lightBlue-600 hover:bg-lightBlue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 mb-2 md:mb-0"
              >
                <Download size={18} />
                <span>Export PDF Report</span>
              </button>
              <EventDropdown
                activeEvent={activeEvent}
                onSelectEvent={(event) => dispatch(setActiveEvent(event))}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <PortfolioTable
              transactions={transactions}
              holdings={holdings}
              onStockClick={handleStockClick}
            />
          </div>
        </div>
      </div>

      {showDetailsModal && selectedStock && (
        <StockDetailsModal
          stock={selectedStock}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default UserPortfolioPage;