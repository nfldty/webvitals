const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prismaClient');
const { applyFilters } = require('../utils/filter'); // Filter function for SESSIONS
// Removed unused metric functions for filtered route as calculations are now inline
// const { getMostTraffic, ... } = require('../utils/metrics');


// Route to fetch overall statistics for a specific user (Unchanged - assumes metrics functions handle filtering or no filtering needed)
router.get('/statistics', async (req, res) => {
    // This route appears to rely on the functions from '../utils/metrics'
    // Make sure those functions correctly handle potential 'req.query' filters if needed
    // or are only intended for non-filtered stats. We leave this route as is based on current structure.
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId', message: 'Please provide a valid userId.' });
        }
        // Lazy-load metric functions only if needed or make sure they exist
        const metrics = require('../utils/metrics');

        const mostTraffic = await metrics.getMostTraffic(userId, 1, req.query);
        const leastTraffic = await metrics.getLeastTraffic(userId, 1, req.query);
        const totalSessions = await metrics.getTotalSession(userId, req.query);
        const avgPagesPerSession = await metrics.getAveragePagesPerSession(userId, req.query);
        const liveUsers = await metrics.getLiveUsers(userId, req.query);
        const avgTotalTime = await metrics.getAverageTotalTime(userId, req.query);
        const clickStatistics = await metrics.getClickStatistics(userId, req.query);
        const avgTimePerPage = await metrics.getAverageTimePerPage(userId, req.query);
        const extraData = await metrics.getExtraData(userId, req.query);

        res.json({
            mostTraffic,
            leastTraffic,
            totalSessions,
            avgPagesPerSession,
            liveUsers,
            avgTotalTime,
            clickStatistics,
            avgTimePerPage,
            extraData
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
    }
});

// Route to get filtered statistics for a specific user
router.get('/filteredStatistics', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'Invalid userId', message: 'Please provide a valid userId.' });
        }

        // 1. Apply filters suitable for the SESSION model
        let sessionBaseQuery = { where: { userId } };
        const filteredSessionQuery = applyFilters({ ...sessionBaseQuery }, req.query); // Pass a copy to avoid mutation if needed

        // Fetch filtered sessions first, including timeSpent if using OPTION A for avgTotalTime below
        const filteredSessions = await prisma.session.findMany({
            where: filteredSessionQuery.where,
            select: {
                id: true,
                timeSpent: true // Include timeSpent if it's a direct field used below
            }
        });
        const totalSessions = filteredSessions.length; // Count from the results

        // 2. Build a separate WHERE clause suitable for the PAGE VISIT model
        const pageVisitWhereClause = { userId }; // Start with base userId filter

        // Add time range filter based on PageVisit's 'visitedAt' field
        const dateFilter = {};
        if (req.query.start_time && req.query.start_time.trim() !== "") {
             try { dateFilter.gte = new Date(req.query.start_time); } catch (e) { /* handle error */ }
        }
        if (req.query.end_time && req.query.end_time.trim() !== "") {
             try { dateFilter.lte = new Date(req.query.end_time); } catch (e) { /* handle error */ }
        }
        if (Object.keys(dateFilter).length > 0) {
            pageVisitWhereClause.visitedAt = dateFilter; // Filter on visitedAt
        }

        // Add pageUrl filter if present (directly on PageVisit)
        if (req.query.page_url && req.query.page_url.trim() !== "") {
            pageVisitWhereClause.pageUrl = { contains: req.query.page_url, mode: "insensitive" };
        }


        // 3. Calculate metrics using the appropriate queries

        // Total pages using the pageVisitWhereClause
        const totalPages = await prisma.pageVisit.count({ where: pageVisitWhereClause });

        const avgPagesPerSession = totalSessions === 0 ? 0 : totalPages / totalSessions;

        // Most traffic using the pageVisitWhereClause
        const mostTrafficResults = await prisma.pageVisit.groupBy({
            by: ['pageUrl'],
            where: pageVisitWhereClause,
            _count: { pageUrl: true },
            orderBy: { _count: { pageUrl: 'desc' } },
            take: 5, // Fetch top 5 for better overview
        });
        // Format result
         const mostTraffic = mostTrafficResults.map(item => ({ pageUrl: item.pageUrl, count: item._count.pageUrl }));


        // Least traffic using the pageVisitWhereClause
        const leastTrafficResults = await prisma.pageVisit.groupBy({
            by: ['pageUrl'],
            where: pageVisitWhereClause,
            _count: { pageUrl: true },
            orderBy: { _count: { pageUrl: 'asc' } },
            take: 5, // Fetch bottom 5
        });
         const leastTraffic = leastTrafficResults.map(item => ({ pageUrl: item.pageUrl, count: item._count.pageUrl }));

        // Live users: check sessions with recent mouse movements (Uses filtered session IDs)
        // This seems complex and potentially slow. Consider alternative 'heartbeat' approach if performance issues arise.
        let liveUsers = 0;
        const sessionIds = filteredSessions.map(s => s.id);
        if (sessionIds.length > 0) {
            const thirtySecondsAgo = new Date(Date.now() - 30 * 1000); // Reduced time window for "live"
            // Find sessions that had a movement recently
            const liveSessionIds = await prisma.mouseMovement.findMany({
                 where: {
                      sessionId: { in: sessionIds },
                      createdAt: { gte: thirtySecondsAgo }
                 },
                 distinct: ['sessionId'] // Count each session only once
            });
            liveUsers = liveSessionIds.length;

            // If no mouse movements, maybe check session endTime or last pageVisit leftAt? Depends on definition of 'live'.
        }

        // Average total time: Calculate from the 'timeSpent' field of the FILTERED SESSIONS
        // ASSUMPTION: 'timeSpent' is a numeric field directly on the Session model.
        let totalTimeSpentSum = 0;
        filteredSessions.forEach(session => {
             // Ensure timeSpent is a number and not null/undefined
             if (typeof session.timeSpent === 'number') {
                  totalTimeSpentSum += session.timeSpent;
             }
        });
        const avgTotalTime = totalSessions === 0 ? 0 : totalTimeSpentSum / totalSessions;
        // If 'timeSpent' is a relation, you'd need a different approach, maybe summing related records.


        // Average time per page for FILTERED visits where leftAt is not null
        const pageVisitTimeWhere = {
            ...pageVisitWhereClause, // Use the PageVisit filters
            leftAt: { not: null }   // Add the condition for calculation
        };
        const pageVisitsWithTime = await prisma.pageVisit.findMany({
             where: pageVisitTimeWhere,
             select: { visitedAt: true, leftAt: true } // Select only needed fields
        });

        let totalDurationPerPage = 0;
        pageVisitsWithTime.forEach(visit => {
            // Ensure dates are valid before calculating difference
            if (visit.leftAt && visit.visitedAt) {
                const duration = new Date(visit.leftAt).getTime() - new Date(visit.visitedAt).getTime();
                if (duration >= 0) { // Avoid negative durations
                     totalDurationPerPage += duration;
                }
            }
        });
        const avgTimePerPage = pageVisitsWithTime.length === 0 ? 0 : (totalDurationPerPage / pageVisitsWithTime.length) / 1000; // In seconds


        // Click statistics and extra data might also need filtering logic based on sessions or page visits
        // For now, setting them to null as the filtering logic isn't specified
        const clickStatistics = null; // TODO: Implement filtered click stats if needed
        const extraData = null; // TODO: Implement filtered extra data if needed

        res.json({
            totalSessions,
            avgPagesPerSession,
            mostTraffic,
            leastTraffic,
            liveUsers,
            avgTotalTime,
            avgTimePerPage,
            clickStatistics, // Include potentially null values
            extraData
        });
    } catch (error) {
        console.error('Error fetching filtered statistics:', error);
        res.status(500).json({ error: 'Failed to fetch filtered statistics', message: error.message });
    }
});


// --- Other routes (sessions, events) remain unchanged ---
router.get('/sessions', async (req, res) => {
    try {
      const userId = req.query.userId; // userId is expected to be a string
      if (!userId) {
        return res.status(400).json({
          error: 'Invalid userId',
          message: 'Please provide a valid userId in the query string.'
        });
      }
      const sessions = await prisma.session.findMany({
        where: { userId },
        orderBy: { startTime: 'desc' }
      });
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      res.status(500).json({
        error: 'Failed to fetch sessions',
        message: error.message,
      });
    }
  });


  router.get('/sessions/:sessionId/events', async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      if (!sessionId) {
        return res.status(400).json({
          error: 'Invalid sessionId',
          message: 'Please provide a valid sessionId.'
        });
      }
      const mouseMovements = await prisma.mouseMovement.findMany({
        where: { sessionId: sessionId }
      });
      const mouseClicks = await prisma.mouseClick.findMany({
        where: { sessionId: sessionId }
      });
      const movementEvents = mouseMovements.map(m => ({
        type: 'mousemove',
        x: m.xCoord,
        y: m.yCoord,
        timestamp: new Date(m.createdAt).getTime()
      }));
      const clickEvents = mouseClicks.map(c => ({
        type: 'click',
        x: c.xCoord,
        y: c.yCoord,
        timestamp: new Date(c.createdAt).getTime()
      }));
      const events = [...movementEvents, ...clickEvents].sort((a, b) => a.timestamp - b.timestamp);
      res.json(events);
    } catch (error) {
      console.error('Error fetching session events:', error);
      res.status(500).json({
        error: 'Failed to fetch session events',
        message: error.message,
      });
    }
  });


module.exports = router;