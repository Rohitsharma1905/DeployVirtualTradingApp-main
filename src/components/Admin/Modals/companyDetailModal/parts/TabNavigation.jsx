import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Loader from '../../../../Common/Loader';
import {
  Info,
  Clock,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

const MetricCard = ({ label, value, isHighlighted, type }) => {
  const getHighlightColor = () => {
    if (!isHighlighted) return 'bg-blue-50/80';
    return type === 'positive' ? 'bg-green-50/80' : 'bg-red-50/80';
  };

  const getTextColor = () => {
    if (!isHighlighted) return 'text-gray-900';
    return type === 'positive' ? 'text-green-700' : 'text-red-700';
  };

  return (
    <div className={`px-3 py-1.5 ${getHighlightColor()} rounded-lg border border-gray-100 transition-all duration-200 shadow-sm`}>
      <div className="text-xs font-medium text-gray-500 truncate">{label}</div>
      <div className={`text-sm font-bold tabular-nums ${getTextColor()} truncate`}>{value}</div>
    </div>
  );
};

const AccountSummaryCards = memo(({ data }) => {
  const activeSubscription = useSelector(state => 
    state.user.subscriptionPlan.userSubscriptions?.find(sub => sub.status === 'Active' && !sub.isDeleted)
  );

  if (!data || !activeSubscription) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <MetricCard 
        label="Virtual Amount" 
        value={`₹${activeSubscription.vertualAmount?.toLocaleString('en-IN') || '0'}`} 
        isHighlighted={false} 
      />
      <MetricCard 
        label="Plan" 
        value={activeSubscription.plan || 'N/A'} 
        isHighlighted={false} 
      />
      <MetricCard 
        label="Valid Till" 
        value={activeSubscription.endDate ? new Date(activeSubscription.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'} 
        isHighlighted={false} 
      />
      {data.currentHoldings && (
        <MetricCard 
          label="Holdings" 
          value={`₹${data.currentHoldings.toLocaleString('en-IN')}`} 
          isHighlighted={data.currentHoldings > activeSubscription.vertualAmount} 
          type={data.currentHoldings > activeSubscription.vertualAmount ? 'positive' : 'negative'}
        />
      )}
    </div>
  );
});

const TabButton = memo(({
  active,
  onClick,
  icon: Icon,
  label,
  disabled = false,
  badge = null,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative flex items-center gap-2 px-4 py-2
        rounded-lg transition-all duration-300 
        font-medium text-sm focus:outline-none
        ${active 
          ? 'text-lightBlue-600 bg-blue-50 shadow-sm' 
          : disabled 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      <Icon 
        size={16} 
        className={`transition-colors duration-200 ${
          active ? 'text-lightBlue-600' : 'text-gray-500'
        }`} 
      />
      <span className="relative">
        {label}
        {active && (
          <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-lightBlue-600 rounded-full" />
        )}
      </span>
      {badge && (
        <span className={`
          absolute -top-1.5 -right-1.5 
          px-1.5 py-0.5 text-[10px] font-bold 
          rounded-full shadow-sm
          ${active 
            ? 'bg-lightBlue-600 text-white' 
            : 'bg-gray-100 text-gray-600'
          }
        `}>
          {badge}
        </span>
      )}
    </button>
  );
});

const TabNavigation = memo(({
  activeTab,
  onTabChange,
  loading = false,
  availableTabs = ['overview', 'historical', 'trading-view', 'trading'],
  accountSummary = null
}) => {
  const allTabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'historical', label: 'Historical', icon: Clock },
    { id: 'trading-view', label: 'TradingView', icon: TrendingUp, badge: 'PRO' },
    { id: 'trading', label: 'Trade', icon: ShoppingCart, badge: 'LIVE' },
  ];

  const visibleTabs = allTabs.filter(tab => availableTabs.includes(tab.id));

  return (
    <div className="relative">
      {loading && (
      <div>
        <Loader />
      </div>
      )}

      {/* Large Screen Layout */}
      <div className="hidden lg:block bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {visibleTabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                icon={tab.icon}
                label={tab.label}
                badge={tab.badge}
              />
            ))}
          </div>

          {accountSummary && (
            <div className="ml-4">
              <AccountSummaryCards data={accountSummary} />
            </div>
          )}
        </div>
      </div>

      {/* Small Screen Layout */}
      <div className="lg:hidden bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {visibleTabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => onTabChange(tab.id)}
                icon={tab.icon}
                label={tab.label}
                badge={tab.badge}
              />
            ))}
          </div>

          {accountSummary && (
            <div className="w-full">
              <AccountSummaryCards data={accountSummary} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

TabButton.propTypes = {
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  badge: PropTypes.string,
};

AccountSummaryCards.propTypes = {
  data: PropTypes.shape({
    currentHoldings: PropTypes.number,
  }),
};

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  availableTabs: PropTypes.arrayOf(PropTypes.string),
  accountSummary: PropTypes.object,
};

TabNavigation.defaultProps = {
  loading: false,
  availableTabs: ['overview', 'historical', 'trading-view', 'trading'],
  accountSummary: null,
};

export default TabNavigation;