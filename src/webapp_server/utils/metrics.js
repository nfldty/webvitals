const prisma = require('../prisma/prismaClient');

// Define the individual statistics functions

async function getMostTraffic(userId, takeNum) {
  try {
    const result = await prisma.pageVisit.groupBy({
      by: ['pageUrl'],
      where: { userId: userId },  // userId is expected to be a string
      _count: { pageUrl: true },
      orderBy: { _count: { pageUrl: 'desc' } },
      take: takeNum,
    });
    return result;
  } catch (error) {
    console.error('Error fetching most traffic pages for user:', error);
    throw error;
  }
}

async function getLeastTraffic(userId, takeNum) {
  try {
    const result = await prisma.pageVisit.groupBy({
      by: ['pageUrl'],
      where: { userId: userId }, // Filter by userId
      _count: { pageUrl: true },
      orderBy: { _count: { pageUrl: 'asc' } },
      take: takeNum,
    });
    return result;
  } catch (error) {
    console.error('Error fetching least traffic pages for user:', error);
    throw error;
  }
}

async function getTotalSession(userId) {
  try {
    const result = await prisma.session.count({
      where: { userId: userId }, // Filter by userId
    });
    return result;
  } catch (error) {
    console.error('Error fetching total sessions for user:', error);
    throw error;
  }
}

async function getAveragePagesPerSession(userId) {
  try {
    // Count the total number of pages (total page visits) for a specific user
    const totalPages = await prisma.pageVisit.count({
      where: { userId: userId }, // Filter by userId
    });

    // Count the total number of sessions for the specific user
    const totalSessions = await prisma.session.count({
      where: { userId: userId }, // Filter by userId
    });

    // Calculate the average pages per session
    const averagePagesPerSession = totalSessions === 0 ? 0 : totalPages / totalSessions;

    return averagePagesPerSession;
  } catch (error) {
    console.error('Error fetching average pages per session for user:', error);
    throw error;
  }
}

async function getLiveUsers(userId) {
  try {
    const sessions = await prisma.session.findMany({
      where: { userId: userId }
    });
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
async function getAverageTimePerPage(userId) {
  try {
    const pageVisits = await prisma.pageVisit.findMany({
      where: {
        userId: userId, // Filter by userId
        leftAt: {
          not: null, // Only consider visits where the user left the page
        },
      },
    });

    let totalTime = 0;
    let totalVisits = 0;

    pageVisits.forEach(visit => {
      const timeSpent = visit.leftAt - visit.visitedAt; // Calculate time spent in milliseconds
      totalTime += timeSpent;
      totalVisits += 1;
    });

    const averageTime = totalVisits === 0 ? 0 : totalTime / totalVisits; // Return average time
    return averageTime / 1000; // Return time in seconds
  } catch (error) {
    console.error('Error fetching average time per page for user:', error);
    throw error;
  }
}

// Function to get the average total time spent for a specific user
async function getAverageTotalTime(userId) {
  try {
    const timeRecords = await prisma.timeSpent.findMany({
      where: {
        userId: userId, // Filter by userId
      },
    });

    let totalTime = 0;
    let totalRecords = 0;

    timeRecords.forEach(record => {
      totalTime += record.elapsedTime; // Add up elapsed time
      totalRecords += 1;
    });

    const averageTime = totalRecords === 0 ? 0 : totalTime / totalRecords;
    return averageTime; // This will return average time in the units defined in your model (e.g., seconds)
  } catch (error) {
    console.error('Error fetching average total time for user:', error);
    throw error;
  }
}

async function getClickStatistics(userId) {
  try {
    
    const clicks = await prisma.mouseClick.count({
      where: { userId: userId },
    });
    
    const rageClicks = await prisma.mouseClick.count({
      where: { userId: userId, isRage: true },
    });
    
    const deadClicks = await prisma.mouseClick.count({
      where: { userId: userId, isDead: true },
    });
    
    const quickBack = await prisma.mouseClick.count({
      where: { userId: userId, isQuickBack: true },
    });
    
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

async function getExtraData(userId) {
  try {
    const totalCount = await prisma.extraData.count({
      where: { userId },
    });
  
    // Function to get grouped data and format with count & percentage
    async function getGroupedData(field) {
      const groupedData = await prisma.extraData.groupBy({
        by: [field],
        where: { userId },
        _count: { [field]: true },
      });
  
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
  getExtraData
};
