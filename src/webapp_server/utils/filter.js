// ../utils/filter.js
const operatorMap = {
  "=": "equals",
  "<": "lt",
  "<=": "lte",
  ">": "gt",
  ">=": "gte"
};

function applyFilters(prismaQuery, queryParams) {
  if (!queryParams) {
      return prismaQuery;
  }

  if (!prismaQuery.where) {
      prismaQuery.where = {};
  }

  const target = prismaQuery.where;

  // --- Date Filtering (for Session.startTime) ---
  const dateFilter = {};
  if (queryParams.start_time && queryParams.start_time.trim() !== "") {
      try {
          dateFilter.gte = new Date(queryParams.start_time);
      } catch (e) { console.error("Invalid start_time:", queryParams.start_time, e); }
  }
  if (queryParams.end_time && queryParams.end_time.trim() !== "") {
      try {
          dateFilter.lte = new Date(queryParams.end_time);
      } catch (e) { console.error("Invalid end_time:", queryParams.end_time, e); }
  }
  if (Object.keys(dateFilter).length > 0) {
      target.startTime = { ...(target.startTime || {}), ...dateFilter };
  }

  // --- Page URL Filtering (for Sessions having matching PageVisits) ---
  if (queryParams.page_url && queryParams.page_url.trim() !== "") {
      target.pageVisits = { // Filter sessions with SOME matching page visit
          some: {
              pageUrl: { contains: queryParams.page_url, mode: "insensitive" },
          },
      };
  }

  // --- Elapsed Time Filtering (for Sessions having matching TimeSpent records) ---
  if (queryParams.elapsed_time && queryParams.elapsed_time.trim() !== "") {
      const match = queryParams.elapsed_time.trim().match(/^\s*(<=?|>=?|=)\s*(\d+(?:\.\d+)?)\s*$/);
      if (match) {
          const [, operator, valueStr] = match;
          const value = parseFloat(valueStr);
          const prismaOperator = operatorMap[operator];

          if (prismaOperator && !isNaN(value)) {
              // **Correct Logic for Relation:** Filter sessions that have SOME related TimeSpent record...
              target.timeSpent = {
                some: {
                  // ...where its 'elapsedTime' field matches the condition.
                  elapsedTime: { [prismaOperator]: value },
                },
              };
          } else {
              console.error("Invalid parsed value or operator for elapsed_time:", queryParams.elapsed_time);
          }
      } else {
          console.error("Could not parse elapsed_time filter:", queryParams.elapsed_time);
      }
  }

  return prismaQuery;
}

module.exports = { applyFilters };