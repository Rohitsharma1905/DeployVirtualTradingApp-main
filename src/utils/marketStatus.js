export const isMarketOpen = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  // Market is open from 9:30 AM to 3:30 PM, Monday to Friday
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    const marketOpenTime = new Date(now);
    marketOpenTime.setHours(9, 30, 0, 0);

    const marketCloseTime = new Date(now);
    marketCloseTime.setHours(15, 30, 0, 0);

    return now >= marketOpenTime && now <= marketCloseTime;
  }
  return false;
};

export const getNextMarketOpenTime = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const nextOpen = new Date(now);

  // If it's Saturday, move to Monday
  if (dayOfWeek === 6) {
    nextOpen.setDate(now.getDate() + 2);
  } 
  // If it's Sunday, move to Monday
  else if (dayOfWeek === 0) {
    nextOpen.setDate(now.getDate() + 1);
  } 
  // If it's after market hours on a weekday, move to next day
  else if (now.getHours() > 15 || (now.getHours() === 15 && now.getMinutes() > 30)) {
    // Move to next day, but skip weekend
    do {
      nextOpen.setDate(now.getDate() + 1);
    } while (nextOpen.getDay() === 0 || nextOpen.getDay() === 6);
  }

  // Set time to market open (9:30 AM)
  nextOpen.setHours(9, 30, 0, 0);
  return nextOpen;
};

export const getMarketTimes = () => {
  const now = new Date();
  const todayMarketOpen = new Date(now);
  todayMarketOpen.setHours(9, 30, 0, 0);

  const todayMarketClose = new Date(now);
  todayMarketClose.setHours(15, 30, 0, 0);

  return {
    open: todayMarketOpen,
    close: todayMarketClose
  };
};

export const getTimeRemaining = (targetTime) => {
  const now = new Date();
  const { open: marketOpen, close: marketClose } = getMarketTimes();
  let diff;

  // If current time is before market open
  if (now < marketOpen) {
    diff = marketOpen.getTime() - now.getTime();
  } 
  // If current time is after market close but before midnight
  else if (now > marketClose && now.getDay() >= 1 && now.getDay() <= 5) {
    // Calculate time to next morning's market open
    const nextMorning = new Date(now);
    nextMorning.setDate(now.getDate() + 1);
    nextMorning.setHours(9, 30, 0, 0);
    diff = nextMorning.getTime() - now.getTime();
  } 
  // If it's weekend, calculate time to next Monday's market open
  else if (now.getDay() === 0 || now.getDay() === 6) {
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (now.getDay() === 6 ? 2 : 1));
    nextMonday.setHours(9, 30, 0, 0);
    diff = nextMonday.getTime() - now.getTime();
  }
  // If current time is after market close and it's a weekday
  else {
    const nextMorning = new Date(now);
    nextMorning.setDate(now.getDate() + 1);
    nextMorning.setHours(9, 30, 0, 0);
    diff = nextMorning.getTime() - now.getTime();
  }

  // Ensure non-negative values
  if (diff <= 0) {
    return { 
      hours: 0, 
      minutes: 0, 
      seconds: 0,
      formattedTime: '0 hours 0 mins 0 sec'
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { 
    hours, 
    minutes, 
    seconds,
    formattedTime: `${hours} hours ${minutes} mins ${seconds} sec`
  };
};