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

  // Ensure the base 'where' object exists
  if (!prismaQuery.where) {
      prismaQuery.where = {};
  }

  const target = prismaQuery.where; // Apply filters directly to 'where'

  // --- Date Filtering ---
  const dateFilter = {};
  if (queryParams.start_time && queryParams.start_time.trim() !== "") {
      try {
          dateFilter.gte = new Date(queryParams.start_time);
      } catch (e) {
          console.error("Invalid start_time format:", queryParams.start_time, e);
      }
  }
  if (queryParams.end_time && queryParams.end_time.trim() !== "") {
      try {
          dateFilter.lte = new Date(queryParams.end_time);
      } catch (e) {
          console.error("Invalid end_time format:", queryParams.end_time, e);
      }
  }
  if (Object.keys(dateFilter).length > 0) {
      target.startTime = { ...(target.startTime || {}), ...dateFilter };
  }

  // --- Page URL Filtering ---
  // Assumes 'pageVisits' relation exists on Session model. Adjust if needed.
  if (queryParams.page_url && queryParams.page_url.trim() !== "") {
      target.pageVisits = {
          some: {
              pageUrl: { contains: queryParams.page_url, mode: "insensitive" },
          },
      };
  }

  // --- Elapsed Time Filtering ---
  if (queryParams.elapsed_time && queryParams.elapsed_time.trim() !== "") {
      // Regex to capture operator and numeric value
      const match = queryParams.elapsed_time.trim().match(/^\s*(<=?|>=?|=)\s*(\d+(?:\.\d+)?)\s*$/);
      if (match) {
          const [, operator, valueStr] = match;
          const value = parseFloat(valueStr);
          const prismaOperator = operatorMap[operator];

          if (prismaOperator && !isNaN(value)) {
              // --- IMPORTANT: Choose ONE option based on your 'timeSpent' field type ---

              // OPTION A: If 'timeSpent' is a Number (e.g., Int, Float) on Session model
               target.timeSpent = { [prismaOperator]: value }; // Replace 'timeSpent' with your actual field name

              // OPTION B: If 'timeSpent' is a Relation on Session model
              // target.timeSpent = {
              //   some: {
              //     elapsedTime: { [prismaOperator]: value }, // Replace 'elapsedTime' with field in related model
              //   },
              // };
              // --- End of options ---
          } else {
              console.error("Invalid elapsed_time value or operator:", queryParams.elapsed_time);
          }
      } else {
          console.error("Could not parse elapsed_time filter:", queryParams.elapsed_time);
      }
  }

  return prismaQuery;
}

module.exports = { applyFilters };