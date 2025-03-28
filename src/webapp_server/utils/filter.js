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
  
    // Filter sessions by startTime directly on the session model
    if (queryParams.start_time || queryParams.end_time) {
      prismaQuery.where.startTime = {
        gte: queryParams.start_time ? new Date(queryParams.start_time) : undefined,
        lte: queryParams.end_time ? new Date(queryParams.end_time) : undefined,
      };
    }
  
    // Filter by page URL on the related pageVisits relation
    if (queryParams.page_url) {
      prismaQuery.where.pageVisits = {
        some: {
          pageUrl: { contains: queryParams.page_url, mode: "insensitive" },
        },
      };
    }
  
    // Filter by elapsed time on the related timeSpent relation
    if (queryParams.elapsed_time) {
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
  