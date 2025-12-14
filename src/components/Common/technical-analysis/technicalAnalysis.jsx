
// node cron -==========================================

// technicalAnalysis.js

// Helper function to check if the necessary properties are available
export const validateStockData = (data) => {
    return data.filter(stock => stock.previousClose !== undefined && stock.dayHigh !== undefined && stock.dayLow !== undefined && stock.totalTradedVolume !== undefined);
  };
  
  // Simple Moving Average (SMA)
  export const calculateSMA = (data, period) => {
    return data.map((stock, index, arr) => {
      if (index < period - 1) return { ...stock, sma: null };
      const slice = arr.slice(index - period + 1, index + 1);
      const sum = slice.reduce((acc, val) => acc + val.previousClose, 0);
      return { ...stock, sma: sum / period };
    });
  };
  
  // Exponential Moving Average (EMA)
  export const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    return data.map((stock, index, arr) => {
      if (index < period - 1) return { ...stock, ema: null };
      if (index === period - 1) {
        const slice = arr.slice(0, period);
        const sum = slice.reduce((acc, val) => acc + val.previousClose, 0);
        return { ...stock, ema: sum / period };
      }
      const prevEMA = arr[index - 1].ema;
      const ema = stock.previousClose * k + prevEMA * (1 - k);
      return { ...stock, ema };
    });
  };
  
  // Relative Strength Index (RSI)
  export const calculateRSI = (data, period = 14) => {
    if (data.length < period) return data.map(stock => ({ ...stock, rsi: null }));
  
    let gains = 0;
    let losses = 0;
    for (let i = 1; i < period; i++) {
      const change = data[i].previousClose - data[i - 1].previousClose;
      if (change > 0) gains += change;
      else losses -= change;
    }
    gains /= period;
    losses /= period;
    const rs = gains / losses;
    const rsi = [100 - 100 / (1 + rs)];
  
    for (let i = period; i < data.length; i++) {
      const change = data[i].previousClose - data[i - 1].previousClose;
      if (change > 0) {
        gains = (gains * (period - 1) + change) / period;
        losses = (losses * (period - 1)) / period;
      } else {
        gains = (gains * (period - 1)) / period;
        losses = (losses * (period - 1) - change) / period;
      }
      const rs = gains / losses;
      rsi.push(100 - 100 / (1 + rs));
    }
  
    return data.map((stock, index) => ({
      ...stock,
      rsi: rsi[index] || null,
    }));
  };
  
  // Moving Average Convergence Divergence (MACD)
  export const calculateMACD = (data, shortPeriod = 12, longPeriod = 26, signalPeriod = 9) => {
    const shortEMA = calculateEMA(data, shortPeriod);
    const longEMA = calculateEMA(data, longPeriod);
    const macd = shortEMA.map((stock, index) => ({
      ...stock,
      macd: shortEMA[index].ema - longEMA[index].ema
    }));
    const signalLine = calculateEMA(macd, signalPeriod);
    return macd.map((stock, index) => ({
      ...stock,
      signalLine: signalLine[index].ema,
      histogram: stock.macd - signalLine[index].ema
    }));
  };
  
  // Bollinger Bands
  export const calculateBollingerBands = (data, period = 20, multiplier = 2) => {
    const smaData = calculateSMA(data, period);
    return smaData.map((stock, index) => {
      if (index < period - 1) return { ...stock, upperBand: null, lowerBand: null };
      const slice = smaData.slice(index - period + 1, index + 1);
      const mean = stock.sma;
      const variance = slice.reduce((acc, val) => acc + Math.pow(val.previousClose - mean, 2), 0) / period;
      const stdDev = Math.sqrt(variance);
      return {
        ...stock,
        upperBand: mean + multiplier * stdDev,
        lowerBand: mean - multiplier * stdDev
      };
    });
  };
  
  // Stochastic Oscillator
  export const calculateStochasticOscillator = (data, period = 14) => {
    return data.map((stock, index, arr) => {
      if (index < period - 1) return { ...stock, stochasticOscillator: null };
      const slice = arr.slice(index - period + 1, index + 1);
      const low = Math.min(...slice.map(s => s.dayLow));
      const high = Math.max(...slice.map(s => s.dayHigh));
      return {
        ...stock,
        stochasticOscillator: ((stock.previousClose - low) / (high - low)) * 100
      };
    });
  };
  
  // Average True Range (ATR)
  export const calculateATR = (data, period = 14) => {
    const trValues = data.map((stock, index, arr) => {
      if (index === 0) return stock.dayHigh - stock.dayLow;
      const prevClose = arr[index - 1].previousClose;
      return Math.max(stock.dayHigh - stock.dayLow, Math.abs(stock.dayHigh - prevClose), Math.abs(stock.dayLow - prevClose));
    });
    return trValues.map((tr, index, arr) => {
      if (index < period) return { ...data[index], atr: null };
      const slice = arr.slice(index - period + 1, index + 1);
      const atr = slice.reduce((acc, val) => acc + val, 0) / period;
      return { ...data[index], atr };
    });
  };
  
  // Fibonacci Retracement
  export const calculateFibonacciRetracement = (data) => {
    const high = Math.max(...data.map(stock => stock.dayHigh));
    const low = Math.min(...data.map(stock => stock.dayLow));
    const diff = high - low;
    return data.map(stock => ({
      ...stock,
      fibRetracement: {
        0: high,
        0.236: high - diff * 0.236,
        0.382: high - diff * 0.382,
        0.5: high - diff * 0.5,
        0.618: high - diff * 0.618,
        0.786: high - diff * 0.786,
        1: low
      }
    }));
  };
  
  // Volume Weighted Average Price (VWAP)
  export const calculateVWAP = (data) => {
    let cumulativeVolume = 0;
    let cumulativePriceVolume = 0;
    return data.map(stock => {
      cumulativeVolume += stock.totalTradedVolume;
      cumulativePriceVolume += stock.previousClose * stock.totalTradedVolume;
      return { ...stock, vwap: cumulativePriceVolume / cumulativeVolume };
    });
  };
  
  // Parabolic SAR
  export const calculateParabolicSAR = (data, accelerationFactor = 0.02, maxAcceleration = 0.2) => {
    let isRising = true;
    let ep = Math.min(...data.slice(0, 4).map(stock => stock.dayLow));
    let sar = Math.max(...data.slice(0, 4).map(stock => stock.dayHigh));
    let af = accelerationFactor;
  
    return data.map((stock, index, arr) => {
      if (index < 4) return { ...stock, parabolicSAR: null };
      const prevStock = arr[index - 1];
      let newSAR = sar;
      if (isRising) {
        newSAR += af * (ep - sar);
        if (stock.dayLow < newSAR) {
          isRising = false;
          sar = ep;
          ep = stock.dayLow;
          af = accelerationFactor;
        } else {
          if (stock.dayHigh > ep) {
            ep = stock.dayHigh;
            af = Math.min(af + accelerationFactor, maxAcceleration);
          }
        }
      } else {
        newSAR -= af * (sar - ep);
        if (stock.dayHigh > newSAR) {
          isRising = true;
          sar = ep;
          ep = stock.dayHigh;
          af = accelerationFactor;
        } else {
          if (stock.dayLow < ep) {
            ep = stock.dayLow;
            af = Math.min(af + accelerationFactor, maxAcceleration);
          }
        }
      }
      return { ...stock, parabolicSAR: newSAR };
    });
  };