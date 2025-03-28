const operatorMap = {
    "=": "equals",
    "<": "lt",
    "<=": "lte",
    ">": "gt",
    ">=": "gte"
  };
  
  function applyFilters(prismaQuery, queryParams) {
    if (!prismaQuery.where) {
      prismaQuery.where = {};
    }
  
    // Build date filter object only if valid values exist
    const dateFilter = {};
    if (queryParams.start_time && queryParams.start_time.trim() !== "") {
      dateFilter.gte = new Date(queryParams.start_time);
    }
    if (queryParams.end_time && queryParams.end_time.trim() !== "") {
      dateFilter.lte = new Date(queryParams.end_time);
    }
    if (Object.keys(dateFilter).length > 0) {
      prismaQuery.where.startTime = dateFilter;
    }
  
    // Only add page_url filter if provided
    if (queryParams.page_url && queryParams.page_url.trim() !== "") {
      prismaQuery.where.pageVisits = {
        some: {
          pageUrl: { contains: queryParams.page_url, mode: "insensitive" },
        },
      };
    }
  
    // Only add elapsed_time filter if provided
    if (queryParams.elapsed_time && queryParams.elapsed_time.trim() !== "") {
      const match = queryParams.elapsed_time.match(/(<=?|>=?|=)(\d+)/);
      if (match) {
        const [, operator, value] = match;
        const prismaOperator = operatorMap[operator];
        if (prismaOperator) {
          prismaQuery.where.timeSpent = {
            some: {
              elapsedTime: { [prismaOperator]: parseInt(value, 10) },
            },
          };
        }
      }
    }
  
    return prismaQuery;
  }
  
  module.exports = { applyFilters };
  