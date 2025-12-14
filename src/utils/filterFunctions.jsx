// // export const getAppliedFiltersCount = ({ startDate, endDate, minAge, maxAge }) => {
// export const getAppliedFiltersCount = ({ startDate, endDate, minAge, maxAge}) => {
//     let count = 0;
//     if (startDate || endDate) count++; // Date Range is considered one filter
//     if (minAge || maxAge) count++; // Age Range is considered one filter
//     // if(gender) count++;
//     return count;
//   };
  
//   export const getAppliedFiltersText = ({ startDate, endDate, minAge, maxAge}) => {
//     const filters = [];
//     if (startDate || endDate) filters.push("Date Range");
//     if (minAge || maxAge) filters.push("Age Range");
//     // if (gender) filters.push(`Gender: ${gender}`);
//     return filters.join(", ");

//   };




// new ones:


// filterFunctions.js
export const getAppliedFiltersCount = ({ startDate, endDate, gender }) => {
  let count = 0;
  if (startDate || endDate) count++;
  // if (endDate) count++;
  if (gender) count++;
  return count;
};

export const getAppliedFiltersText = ({ startDate, endDate, gender }) => {
  const filters = [];
  if (startDate) filters.push(`Start: ${new Date(startDate).toLocaleDateString()}`);
  if (endDate) filters.push(`End: ${new Date(endDate).toLocaleDateString()}`);
  if (gender) filters.push(`Gender: ${gender}`);
  return filters.join(', ');
};