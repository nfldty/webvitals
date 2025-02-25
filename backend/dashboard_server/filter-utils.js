function applyFiltersToPrismaQuery(prismaQuery, query) {
    if (query.start_time && query.end_time) {
        prismaQuery.where.timestamp = {
            gte: new Date(query.start_time),
            lte: new Date(query.end_time)
        };
    } else if (query.start_time) {
        prismaQuery.where.timestamp = { gte: new Date(query.start_time) };
    } else if (query.end_time) {
        prismaQuery.where.timestamp = { lte: new Date(query.end_time) };
    }

    if (query.page_url) {
        try {
            prismaQuery.where.page_url = { matches: new RegExp(query.page_url) };
        } catch (error) {
            console.error("Invalid regex for page_url", error);
        }
    }

    if (query.elapsed_time) {
        const match = query.elapsed_time.match(/(>=|<=|>|<|=)(\d+)/);
        if (match) {
            const operatorMap = {
                '>': 'gt',
                '>=': 'gte',
                '<': 'lt',
                '<=': 'lte',
                '=': 'equals'
            };
            prismaQuery.where.elapsed_time = { [operatorMap[match[1]]]: parseInt(match[2], 10) };
        }
    }

    return prismaQuery;
}

export { getFilteredResults };