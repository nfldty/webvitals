const operatorMap = {
    "=": "equals",
    "<": "lt",
    "<=": "lte",
    ">": "gt",
    ">=": "gte"
};

export function applyFilters(prismaQuery, queryParams) {
    if (!prismaQuery.where) {
        prismaQuery.where = {};
    }

    if (!prismaQuery.where.session) {
        prismaQuery.where.session = {};
    }

    if (queryParams.start_time || queryParams.end_time) {
        prismaQuery.where.session.startTime = {
            gte: queryParams.start_time ? new Date(queryParams.start_time) : undefined,
            lte: queryParams.end_time ? new Date(queryParams.end_time) : undefined,
        };
    }

    if (queryParams.page_url) {
        prismaQuery.where.session.pageVisits = {
            some: {
                pageUrl: { contains: queryParams.page_url, mode: "insensitive" },
            },
        };
    }

    if (queryParams.elapsed_time) {
        const match = queryParams.elapsed_time.match(/(<=?|>=?|=)(\d+)/);
        if (match) {
            const [, operator, value] = match;
            const prismaOperator = operatorMap[operator];
            if (prismaOperator) {
                prismaQuery.where.session.timeSpent = {
                    some: {
                        elapsedTime: { prismaOperator: parseInt(value, 10) },
                    },
                };
            }
        }
    }

    return prismaQuery;
}
