// routes/statistics.js
const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prismaClient');
const { applyFilters } = require('../utils/filter'); // Ensure this path is correct

// (Keep the /statistics route as it was, assuming its logic is handled by imported functions)
router.get('/statistics', async (req, res) => {
    // ... unchanged ...
    // NOTE: Make sure the imported functions in utils/metrics also correctly handle filtering
    //       if req.query might contain filters when calling this endpoint.
    try {
        const userId = req.query.userId;
        if (!userId) { return res.status(400).json({ error: 'Invalid userId', message: 'Provide userId.' }); }
        const metrics = require('../utils/metrics'); // Lazy load might avoid issues if file changes often

        const mostTraffic = await metrics.getMostTraffic(userId, 5, req.query); // Request top 5
        const leastTraffic = await metrics.getLeastTraffic(userId, 5, req.query); // Request bottom 5
        const totalSessions = await metrics.getTotalSession(userId, req.query);
        const avgPagesPerSession = await metrics.getAveragePagesPerSession(userId, req.query);
        const liveUsers = await metrics.getLiveUsers(userId, req.query);
        const avgTotalTime = await metrics.getAverageTotalTime(userId, req.query);
        const clickStatistics = await metrics.getClickStatistics(userId, req.query);
        const avgTimePerPage = await metrics.getAverageTimePerPage(userId, req.query);
        const extraData = await metrics.getExtraData(userId, req.query);

        res.json({
            mostTraffic, leastTraffic, totalSessions, avgPagesPerSession,
            liveUsers, avgTotalTime, clickStatistics, avgTimePerPage, extraData
        });
    } catch (error) {
        console.error('Error /statistics:', error);
        res.status(500).json({ error: 'Failed', message: error.message });
    }
});


// Route to get filtered statistics for a specific user
router.get('/filteredStatistics', async (req, res) => {
    console.log("FILTER STATS: Received query:", req.query); // Log received filters
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId', message: 'Provide userId.' });
        }

        // 1. Apply filters suitable for the SESSION model
        let sessionBaseQuery = { where: { userId } };
        const filteredSessionQuery = applyFilters({ ...sessionBaseQuery }, req.query); // Use corrected applyFilters for sessions
        console.log("FILTER STATS: Session WHERE:", JSON.stringify(filteredSessionQuery.where, null, 2));

        // Find session IDs that match the filters
        const filteredSessionIds = (await prisma.session.findMany({
            where: filteredSessionQuery.where,
            select: { id: true } // Only select IDs
        })).map(s => s.id);

        const totalSessions = filteredSessionIds.length;
        console.log(`FILTER STATS: Found ${totalSessions} matching sessions.`);

        // Exit early if no sessions match
        if (totalSessions === 0) {
             console.log("FILTER STATS: No matching sessions, returning zeros.");
             return res.json({
                 totalSessions: 0, avgPagesPerSession: 0, mostTraffic: [], leastTraffic: [],
                 liveUsers: 0, avgTotalTime: 0, avgTimePerPage: 0, clickStatistics: null, extraData: null
             });
        }


        // 2. Build a WHERE clause suitable for PAGE VISITS associated with the *filtered session IDs*
        const pageVisitWhereClause = {
            sessionId: { in: filteredSessionIds } // Core filter: page visits belonging to filtered sessions
        };

        // Add time range filter based on PageVisit's 'visitedAt' field *if provided*
        const dateFilter = {};
        if (req.query.start_time && req.query.start_time.trim() !== "") {
             try { dateFilter.gte = new Date(req.query.start_time); } catch (e) { /* ignore */ }
        }
        if (req.query.end_time && req.query.end_time.trim() !== "") {
             try { dateFilter.lte = new Date(req.query.end_time); } catch (e) { /* ignore */ }
        }
        if (Object.keys(dateFilter).length > 0) {
            pageVisitWhereClause.visitedAt = dateFilter;
        }

        // Add pageUrl filter *if provided*
        if (req.query.page_url && req.query.page_url.trim() !== "") {
            pageVisitWhereClause.pageUrl = { contains: req.query.page_url, mode: "insensitive" };
        }
        console.log("FILTER STATS: PageVisit WHERE:", JSON.stringify(pageVisitWhereClause, null, 2));


        // 3. Calculate metrics using the correct queries

        // Total pages from filtered visits
        const totalPages = await prisma.pageVisit.count({ where: pageVisitWhereClause });
        console.log(`FILTER STATS: Found ${totalPages} matching page visits.`);
        const avgPagesPerSession = totalPages / totalSessions; // Safe because totalSessions > 0 here


        // Most/Least Traffic (Grouping on page visits matching the pageVisitWhereClause)
        const mostTrafficResults = await prisma.pageVisit.groupBy({
            by: ['pageUrl'], where: pageVisitWhereClause, _count: { pageUrl: true },
            orderBy: { _count: { pageUrl: 'desc' } }, take: 5,
        });
        const mostTraffic = mostTrafficResults.map(item => ({ pageUrl: item.pageUrl, count: item._count.pageUrl }));

        const leastTrafficResults = await prisma.pageVisit.groupBy({
            by: ['pageUrl'], where: pageVisitWhereClause, _count: { pageUrl: true },
            orderBy: { _count: { pageUrl: 'asc' } }, take: 5,
        });
        const leastTraffic = leastTrafficResults.map(item => ({ pageUrl: item.pageUrl, count: item._count.pageUrl }));


        // Live Users (Check recent MouseMovement for *any* user - maybe refine later if needed)
        // Note: Filtering this by filteredSessionIds might be slow / less useful.
        //       Consider a global live count or session heartbeats if performance is critical.
        const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
        const liveUserMovementCount = await prisma.mouseMovement.count({
            where: { createdAt: { gte: thirtySecondsAgo }, userId: userId }, // Count movements for THIS user in last 30s
            // Using distinct on sessionId here might be more accurate for "live sessions" count
            // distinct: ['sessionId'] // If you uncomment, the result might not be a simple number - adjust handling
        });
         // This 'liveUsers' definition is approximate. Revisit if needed.
         const liveUsers = liveUserMovementCount > 0 ? 1 : 0; // Simplistic: 1 if any movement, else 0


        // Average total time (Summing elapsedTime from TimeSpent records linked to filtered sessions)
        const timeSpentRecords = await prisma.timeSpent.findMany({
            where: { sessionId: { in: filteredSessionIds } }, // Get all time records for the matched sessions
            select: { elapsedTime: true }
        });
        const totalTimeSpentSum = timeSpentRecords.reduce((sum, record) => sum + record.elapsedTime, 0);
        const avgTotalTime = totalTimeSpentSum / totalSessions; // Avg time across matched sessions
        console.log(`FILTER STATS: TotalTimeSum=${totalTimeSpentSum}, AvgTotalTime=${avgTotalTime}`);


        // Average time per page for FILTERED visits where leftAt is not null
        const pageVisitTimeWhere = { ...pageVisitWhereClause, leftAt: { not: null } };
        const pageVisitsWithTime = await prisma.pageVisit.findMany({
             where: pageVisitTimeWhere,
             select: { visitedAt: true, leftAt: true }
        });
        let totalDurationPerPage = 0;
        pageVisitsWithTime.forEach(visit => {
            if (visit.leftAt && visit.visitedAt) {
                const duration = new Date(visit.leftAt).getTime() - new Date(visit.visitedAt).getTime();
                if (duration >= 0) totalDurationPerPage += duration;
            }
        });
        const avgTimePerPage = pageVisitsWithTime.length === 0 ? 0 : (totalDurationPerPage / pageVisitsWithTime.length) / 1000;
        console.log(`FILTER STATS: Found ${pageVisitsWithTime.length} visits with duration, AvgTimePerPage=${avgTimePerPage}`);


        // Placeholder for potentially filtered click/extra data
        const clickStatistics = null; // TODO
        const extraData = null; // TODO


        const finalStats = {
            totalSessions, avgPagesPerSession, mostTraffic, leastTraffic,
            liveUsers, avgTotalTime, avgTimePerPage, clickStatistics, extraData
        };
        console.log("FILTER STATS: Sending final stats:", JSON.stringify(finalStats, null, 2));
        res.json(finalStats);

    } catch (error) {
        console.error('Error /filteredStatistics:', error);
        // Send detailed error in development, generic in production
        res.status(500).json({ error: 'Failed to fetch filtered statistics', message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined });
    }
});

// (Keep /sessions and /sessions/:sessionId/events routes as they were)
router.get('/sessions', /* ...unchanged... */ );
router.get('/sessions/:sessionId/events', /* ...unchanged... */ );


module.exports = router;