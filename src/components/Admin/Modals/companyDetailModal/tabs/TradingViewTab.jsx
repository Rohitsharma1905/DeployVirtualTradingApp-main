import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import Loader from '../../../../Common/Loader';
const TradingViewTab = ({ symbol, loading }) => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleFullScreen = () => {
    setIsFullScreen((prev) => !prev);
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.() || document.body.requestFullscreen?.();
      document.body.style.overflow = 'hidden';
    } else {
      document.exitFullscreen?.();
      document.body.style.overflow = 'auto';
    }
  };

  const refreshChart = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .tradingview-widget-container {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: 100% !important;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    if (scriptRef.current) {
      scriptRef.current.remove();
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;

    const formattedSymbol = symbol.includes(':') ? symbol : `BSE:${symbol}`;
    const widgetConfig = {
      autosize: true,
      symbol: formattedSymbol,
      timezone: 'Asia/Kolkata',
      theme: 'light',
      style: '1',
      locale: 'en',
      withdateranges: true,
      range: 'ALL',
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      hotlist: true,
      calendar: false,
      show_popup_button: true,
      popup_width: '1000',
      popup_height: '650',
      support_host: 'https://www.tradingview.com',
    };

    script.innerHTML = JSON.stringify(widgetConfig);
    scriptRef.current = script;

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container__widget';
      widgetContainer.style.height = '100%';
      widgetContainer.style.width = '100%';

      containerRef.current.appendChild(widgetContainer);
      containerRef.current.appendChild(script);
    }

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
      }
    };
  }, [symbol, refreshKey]);

  return (
    <div
      className={`m-4 p-4 bg-gray-100 shadow-2xl rounded transition-all ${
        isFullScreen ? 'fixed top-0 left-0 w-screen h-screen z-50' : 'relative'
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">TradingView Chart</h2>
        <div className="flex space-x-4">
          <button
            onClick={refreshChart}
            className="p-2 bg-gray-200 mx-4 rounded-full hover:bg-gray-300 transition"
            title="Refresh Chart"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            title="Toggle Fullscreen"
          >
            {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>
      </div>
      <div className="relative w-full h-[80vh] bg-white rounded-md overflow-hidden">
        {loading ? (
    
      <div>
        <Loader />
      </div>
    
        ) : (
          <div ref={containerRef} className="tradingview-widget-container w-full h-full" />
        )}
      </div>
    </div>
  );
};

TradingViewTab.propTypes = {
  symbol: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

TradingViewTab.defaultProps = {
  loading: false,
};

export default TradingViewTab;
