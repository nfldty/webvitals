const prisma = require('../prisma/prismaClient');
const filterUtil = require('./filter').applyFilters;

// Define the individual statistics functions

async function getMostTraffic(userId, takeNum, filter) {
  try {
    const result = await prisma.pageVisit.groupBy(filterUtil({
      by: ['pageUrl'],
      where: { userId: userId },  // userId is expected to be a string
      _count: { pageUrl: true },
      orderBy: { _count: { pageUrl: 'desc' } },
      take: takeNum,
    }, filter));
    return result;
  } catch (error) {
    console.error('Error fetching most traffic pages for user:', error);
    throw error;
  }
}

async function getLeastTraffic(userId, takeNum, filter) {
  try {
    const result = await prisma.pageVisit.groupBy(filterUtil({
      by: ['pageUrl'],
      where: { userId: userId }, // Filter by userId
      _count: { pageUrl: true },
      orderBy: { _count: { pageUrl: 'asc' } },
      take: takeNum,
    }, filter));
    return result;
  } catch (error) {
    console.error('Error fetching least traffic pages for user:', error);
    throw error;
  }
}

async function getTotalSession(userId, filter) {
  try {
    const result = await prisma.session.count(filterUtil({
      where: { userId: userId }, // Filter by userId
    }, filter, true));
    return result;
  } catch (error) {
    console.error('Error fetching total sessions for user:', error);
    throw error;
  }
}

async function getAveragePagesPerSession(userId, filter) {
  try {
    // Count the total number of pages (total page visits) for a specific user
    const totalPages = await prisma.pageVisit.count(filterUtil({
      where: { userId: userId }, // Filter by userId
    }, filter));

    // Count the total number of sessions for the specific user
    const totalSessions = await prisma.session.count(filterUtil({
      where: { userId: userId }, // Filter by userId
    }, filter, true));

    // Calculate the average pages per session
    const averagePagesPerSession = totalSessions === 0 ? 0 : totalPages / totalSessions;

    return averagePagesPerSession < 1 ? 1 : averagePagesPerSession.toFixed(); // Ensure at least 1 page per session
  } catch (error) {
    console.error('Error fetching average pages per session for user:', error);
    throw error;
  }
}

async function getLiveUsers(userId, filter) {
  try {
    const sessions = await prisma.session.findMany(filterUtil({
      where: { userId: userId }
    }, filter, true));
    let liveSessions = 0;
    for (const session of sessions) {
      const latestMovement = await prisma.mouseMovement.findFirst({
        where: { sessionId: session.id },
        orderBy: { createdAt: 'desc' }
      });
      if (latestMovement && (new Date() - latestMovement.createdAt) / 1000 < 300) {
        liveSessions++; 
      }
    }
    return liveSessions; 
  } catch (error) {
    console.error('Error fetching current live users for user:', error);
    throw error;
  }
}

// Function to get average time spent per page for a specific user
async function getAverageTimePerPage(userId, filter) {
  try {
    const pageVisits = await prisma.pageVisit.findMany(filterUtil({
      where: {
        userId: userId, // Filter by userId
        leftAt: {
          not: null, // Only consider visits where the user left the page
        },
      },
    }, filter));

    let totalTime = 0;
    let totalVisits = 0;

    pageVisits.forEach(visit => {
      const timeSpent = visit.leftAt - visit.visitedAt; // Calculate time spent in milliseconds
      totalTime += timeSpent;
      totalVisits += 1;
    });

    const averageTime = totalVisits === 0 ? 0 : totalTime / totalVisits; // Return average time
    return (averageTime / 1000).toFixed(2); // Return time in seconds
  } catch (error) {
    console.error('Error fetching average time per page for user:', error);
    throw error;
  }
}

// Function to get the average total time spent for a specific user
async function getAverageTotalTime(userId, filter) {
  try {
    const timeRecords = await prisma.pageVisit.findMany(filterUtil({
      where: {
        userId: userId, // Filter by userId
        leftAt: {
          not: null, // Only consider visits where the user left the page
        },
      },
    }, filter));

    const totalPageTime = timeRecords.reduce((sum, record) => sum + (((record.leftAt - record.visitedAt) || 0) / 1000), 0);

    // Get unique session count
    const uniqueSessions = new Set(timeRecords.map(record => record.sessionId)).size;
    
    // Calculate average time per session
    const averageTimePerSession = uniqueSessions > 0 ? totalPageTime / uniqueSessions : 0;

    return averageTimePerSession.toFixed(2)
  } catch (error) {
    console.error('Error fetching average total time for user:', error);
    throw error;
  }
}

async function getClickStatistics(userId, filter) {
  try {
    
    const clicks = await prisma.mouseClick.count(filterUtil({
      where: { userId: userId },
    }, filter));
    
    const rageClicks = await prisma.mouseClick.count(filterUtil({
      where: { userId: userId, isRage: true },
    }, filter));
    
    const deadClicks = await prisma.mouseClick.count(filterUtil({
      where: { userId: userId, isDead: true },
    }, filter));
    
    const quickBack = await prisma.mouseClick.count(filterUtil({
      where: { userId: userId, isQuickBack: true },
    }, filter));
    
    const ragePercent = clicks === 0 ? '0.00%' : ((rageClicks / clicks) * 100).toFixed(2) + '%';
    const deadPercent = clicks === 0 ? '0.00%' : ((deadClicks / clicks) * 100).toFixed(2) + '%';
    const quickBackPercent = clicks === 0 ? '0.00%' : ((quickBack / clicks) * 100).toFixed(2) + '%';
    
    return {
      rage_click: {
        count: rageClicks,
        percentage: ragePercent,
      },
      dead_click: {
        count: deadClicks,
        percentage: deadPercent,
      },
      quick_back: {
        count: quickBack,
        percentage: quickBackPercent,
      },
    };
    
  } catch (error) {
    
    console.error('Error fetching mouse click statistics for user:', userId, error);
    throw error;
    
  }
}

async function getExtraData(userId, filter) {
  try {
    const totalCount = await prisma.extraData.count(filterUtil({
      where: { userId },
    }, filter));
  
    // Function to get grouped data and format with count & percentage
    async function getGroupedData(field) {
      const groupedData = await prisma.extraData.groupBy(filterUtil({
        by: [field],
        where: { userId },
        _count: { [field]: true },
      }, filter));
  
      return groupedData.map(item => ({
        [field]: item[field],
        count: item._count[field],
        percentage: ((item._count[field] / totalCount) * 100).toFixed(2) + '%',
      }));
    }

    const [browserData, osData, mobileData, referrerData] = await Promise.all([
      getGroupedData('browserName'),
      getGroupedData('operatingSystem'),
      getGroupedData('isMobile'),
      getGroupedData('referrer'),
    ]);

    return {
      browserUsage: browserData,
      operatingSystemUsage: osData,
      isMobileUsage: mobileData,
      referrerUsage: referrerData,
    };
  } catch (error) {
    console.error('Error fetching extra data:', error);
  }
}

module.exports = {
  getMostTraffic,
  getLeastTraffic,
  getTotalSession,
  getAveragePagesPerSession,
  getLiveUsers,
  getAverageTimePerPage,
  getAverageTotalTime,
  getClickStatistics,
  getExtraData
};
