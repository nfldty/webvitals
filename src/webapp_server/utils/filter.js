const operatorMap = {
    "=": "equals",
    "<": "lt",
    "<=": "lte",
    ">": "gt",
    ">=": "gte"
  };
  
  function applyFilters(prismaQuery, queryParams, session) {
    if (!queryParams) return prismaQuery;

    if (!prismaQuery.where) {
      prismaQuery.where = {};
    }

    let target;
    if (session) {
      target = prismaQuery.where;
    }
    else {
      if (!prismaQuery.where.session) {
        prismaQuery.where.session = {};
      }
      target = prismaQuery.where.session
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
      target.startTime = dateFilter;
    }
  
    // Only add page_url filter if provided
    if (queryParams.page_url && queryParams.page_url.trim() !== "") {
      target.pageVisits = {
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
          target.timeSpent = {
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
  