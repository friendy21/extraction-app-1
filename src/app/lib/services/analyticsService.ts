// lib/services/analyticsService.ts

import { 
    ResponsivenessData, 
    CommunicationMetrics, 
    PerformanceMetrics, 
    EngagementData 
  } from '../types';
  
  // Mock data generators - in a real application, these would fetch from an API
  const generateResponsivenessData = (): ResponsivenessData => {
    return {
      excellent: Math.floor(Math.random() * 30) + 20, // 20-50 employees
      good: Math.floor(Math.random() * 40) + 30,      // 30-70 employees
      average: Math.floor(Math.random() * 30) + 10,   // 10-40 employees
      poor: Math.floor(Math.random() * 20) + 5,       // 5-25 employees
      overallQuality: Math.floor(Math.random() * 20) + 75, // 75-95%
      followupRate: Math.floor(Math.random() * 30) + 60,   // 60-90%
    };
  };
  
  const generateHourlyDistribution = () => {
    const distribution = [];
    // Generate realistic work hour distribution with peak times
    for (let hour = 0; hour < 24; hour++) {
      let count;
      if (hour >= 9 && hour <= 11) {
        // Morning peak
        count = Math.floor(Math.random() * 50) + 100; // 100-150 messages
      } else if (hour >= 13 && hour <= 15) {
        // Afternoon peak
        count = Math.floor(Math.random() * 60) + 90; // 90-150 messages
      } else if (hour >= 7 && hour <= 18) {
        // Regular work hours
        count = Math.floor(Math.random() * 50) + 40; // 40-90 messages
      } else {
        // Off hours
        count = Math.floor(Math.random() * 20); // 0-20 messages
      }
      distribution.push({ hour, count });
    }
    return distribution;
  };
  
  const generateChannelDistribution = () => {
    return [
      { channel: 'Email', count: Math.floor(Math.random() * 300) + 400 },
      { channel: 'Chat', count: Math.floor(Math.random() * 200) + 300 },
      { channel: 'Meetings', count: Math.floor(Math.random() * 100) + 100 },
      { channel: 'Phone', count: Math.floor(Math.random() * 80) + 50 },
      { channel: 'Collaboration Tools', count: Math.floor(Math.random() * 150) + 200 },
    ];
  };
  
  const generateCommunicationMetrics = (): CommunicationMetrics => {
    const hourlyDistribution = generateHourlyDistribution();
    const channelDistribution = generateChannelDistribution();
    const totalMessages = channelDistribution.reduce((sum, item) => sum + item.count, 0);
    
    return {
      hourlyDistribution,
      channelDistribution,
      totalMessages,
      crossTeamRate: Math.floor(Math.random() * 30) + 40, // 40-70%
      afterHoursRate: Math.floor(Math.random() * 15) + 5, // 5-20%
      responseRate: Math.floor(Math.random() * 20) + 75,  // 75-95%
      avgThreadLength: Math.floor(Math.random() * 4) + 3, // 3-7 messages
    };
  };
  
  const generateMonthlyProductivity = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const productivityData = [];
    
    let productivity = 75 + Math.floor(Math.random() * 10); // Starting value between 75-85%
    
    for (const month of months) {
      // Fluctuate productivity within reasonable bounds
      const change = Math.floor(Math.random() * 10) - 4; // -4 to +5
      productivity = Math.min(Math.max(productivity + change, 65), 95); // Keep between 65-95%
      
      productivityData.push({
        month,
        productivity,
      });
    }
    
    return productivityData;
  };
  
  const generatePerformanceDistribution = () => {
    return [
      { 
        level: 'Exceptional', 
        count: Math.floor(Math.random() * 15) + 5, 
        percentage: 0, // Will be calculated
        avgResponseTime: Math.floor(Math.random() * 5) + 3 // 3-8 minutes
      },
      { 
        level: 'Exceeds Expectations', 
        count: Math.floor(Math.random() * 25) + 15, 
        percentage: 0,
        avgResponseTime: Math.floor(Math.random() * 7) + 8 // 8-15 minutes
      },
      { 
        level: 'Meets Expectations', 
        count: Math.floor(Math.random() * 40) + 30, 
        percentage: 0,
        avgResponseTime: Math.floor(Math.random() * 10) + 15 // 15-25 minutes
      },
      { 
        level: 'Needs Improvement', 
        count: Math.floor(Math.random() * 15) + 5, 
        percentage: 0,
        avgResponseTime: Math.floor(Math.random() * 15) + 25 // 25-40 minutes
      },
      { 
        level: 'Unsatisfactory', 
        count: Math.floor(Math.random() * 5) + 1, 
        percentage: 0,
        avgResponseTime: Math.floor(Math.random() * 20) + 40 // 40-60 minutes
      }
    ];
  };
  
  const generatePerformanceData = (): PerformanceMetrics => {
    const tasksCompleted = Math.floor(Math.random() * 200) + 500; // 500-700 tasks
    const totalTasks = tasksCompleted + Math.floor(Math.random() * 100) + 50; // 50-150 incomplete tasks
    const taskCompletionRate = Math.round((tasksCompleted / totalTasks) * 100);
    
    const monthlyProductivity = generateMonthlyProductivity();
    
    let distributionByPerformance = generatePerformanceDistribution();
    const totalEmployees = distributionByPerformance.reduce((sum, item) => sum + item.count, 0);
    
    // Calculate percentages
    distributionByPerformance = distributionByPerformance.map(item => ({
      ...item,
      percentage: Math.round((item.count / totalEmployees) * 100)
    }));
    
    return {
      taskCompletionRate,
      tasksCompleted,
      totalTasks,
      qualityScore: Math.floor(Math.random() * 3) + 7, // 7-10
      reviewCount: Math.floor(Math.random() * 50) + 100, // 100-150 reviews
      knowledgeSharingScore: Math.floor(Math.random() * 4) + 6, // 6-10
      documentationContributions: Math.floor(Math.random() * 40) + 20, // 20-60 contributions
      initiativeScore: Math.floor(Math.random() * 5) + 5, // 5-10
      selfStartedProjects: Math.floor(Math.random() * 10) + 5, // 5-15 projects
      monthlyProductivity,
      distributionByPerformance,
    };
  };
  
  const generateMeetingParticipation = () => {
    const departments = ['Engineering', 'Marketing', 'Sales', 'Product', 'Customer Support', 'HR'];
    return departments.map(department => ({
      department,
      attendanceRate: Math.floor(Math.random() * 20) + 80, // 80-100%
      participationRate: Math.floor(Math.random() * 40) + 50, // 50-90%
    }));
  };
  
  const generateEngagementData = (): EngagementData => {
    const meetingParticipation = generateMeetingParticipation();
    
    return {
      meetingParticipation,
      avgMeetingContribution: Math.floor(Math.random() * 3) + 7, // 7-10
      avgMeetingContributionChange: Math.floor(Math.random() * 20) - 5, // -5% to +15%
      knowledgeSharingRate: Math.floor(Math.random() * 30) + 60, // 60-90%
      knowledgeSharingChange: Math.floor(Math.random() * 25) - 10, // -10% to +15%
      peerFeedbackScore: Math.floor(Math.random() * 3) + 7, // 7-10
      peerFeedbackChange: Math.floor(Math.random() * 20) - 5, // -5% to +15%
      mentorshipScore: Math.floor(Math.random() * 4) + 6, // 6-10
      mentorshipChange: Math.floor(Math.random() * 20) - 5, // -5% to +15%
    };
  };
  
  // Main service
  class AnalyticsService {
    // Cache values to maintain consistency between renders
    private _avgResponseTime: number | null = null;
    private _communicationVolume: number | null = null;
    private _responsivenessData: ResponsivenessData | null = null;
    private _communicationMetrics: CommunicationMetrics | null = null;
    private _performanceData: PerformanceMetrics | null = null;
    private _engagementData: EngagementData | null = null;
  
    // Simulates API call to get average response time
    async getAverageResponseTime(): Promise<number> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (!this._avgResponseTime) {
        this._avgResponseTime = Math.floor(Math.random() * 15) + 10; // 10-25 minutes
      }
      
      return this._avgResponseTime;
    }
  
    // Simulates API call to get daily communication volume
    async getCommunicationVolume(): Promise<number> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 150));
      
      if (!this._communicationVolume) {
        this._communicationVolume = Math.floor(Math.random() * 500) + 1000; // 1000-1500 messages
      }
      
      return this._communicationVolume;
    }
  
    // Simulates API call to get responsiveness data
    async getResponsivenessData(): Promise<ResponsivenessData> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!this._responsivenessData) {
        this._responsivenessData = generateResponsivenessData();
      }
      
      return this._responsivenessData;
    }
  
    // Simulates API call to get communication metrics
    async getCommunicationMetrics(): Promise<CommunicationMetrics> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (!this._communicationMetrics) {
        this._communicationMetrics = generateCommunicationMetrics();
      }
      
      return this._communicationMetrics;
    }
  
    // Simulates API call to get performance data
    async getPerformanceData(): Promise<PerformanceMetrics> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 350));
      
      if (!this._performanceData) {
        this._performanceData = generatePerformanceData();
      }
      
      return this._performanceData;
    }
  
    // Simulates API call to get engagement data
    async getEngagementData(): Promise<EngagementData> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 250));
      
      if (!this._engagementData) {
        this._engagementData = generateEngagementData();
      }
      
      return this._engagementData;
    }
  
    // Refresh all analytics data (useful after major changes)
    async refreshAllAnalytics(): Promise<void> {
      this._avgResponseTime = null;
      this._communicationVolume = null;
      this._responsivenessData = null;
      this._communicationMetrics = null;
      this._performanceData = null;
      this._engagementData = null;
      
      // Pre-load all data
      await Promise.all([
        this.getAverageResponseTime(),
        this.getCommunicationVolume(),
        this.getResponsivenessData(),
        this.getCommunicationMetrics(),
        this.getPerformanceData(),
        this.getEngagementData()
      ]);
    }
  
    // Get employee-specific analytics
    async getEmployeeAnalytics(employeeId: string): Promise<{
      responseTime: number;
      messageVolume: number;
      taskCompletion: number;
      qualityScore: number;
      peerRating: number;
      engagementScore: number;
      channelPreference: { channel: string, percentage: number }[];
      responseTimeHistory: { date: string, value: number }[];
    }> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate realistic employee analytics
      const responseTime = Math.floor(Math.random() * 25) + 5; // 5-30 minutes
      const messageVolume = Math.floor(Math.random() * 60) + 20; // 20-80 daily messages
      const taskCompletion = Math.floor(Math.random() * 30) + 70; // 70-100%
      const qualityScore = Math.floor(Math.random() * 3) + 7; // 7-10
      const peerRating = (Math.random() * 3 + 7).toFixed(1); // 7.0-10.0
      const engagementScore = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      // Channel preference with realistic distribution
      const channelPreference = [
        { channel: 'Email', percentage: Math.floor(Math.random() * 40) + 20 },
        { channel: 'Chat', percentage: Math.floor(Math.random() * 30) + 15 },
        { channel: 'Meetings', percentage: Math.floor(Math.random() * 20) + 10 },
        { channel: 'Phone', percentage: Math.floor(Math.random() * 15) + 5 }
      ];
      
      // Make sure percentages add up to 100%
      const totalPercentage = channelPreference.reduce((sum, item) => sum + item.percentage, 0);
      channelPreference.forEach(item => {
        item.percentage = Math.round((item.percentage / totalPercentage) * 100);
      });
      
      // Generate response time history for the last 7 days
      const responseTimeHistory = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        
        // Base value with some randomization for trend
        let baseValue = responseTime;
        if (i > 4) baseValue += Math.floor(Math.random() * 10) + 5; // Higher (worse) in the past
        else baseValue -= Math.floor(Math.random() * 5); // Improving trend
        
        // Daily fluctuation
        const dailyVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5
        const value = Math.max(3, baseValue + dailyVariation); // Minimum 3 minutes
        
        responseTimeHistory.push({ date: formattedDate, value });
      }
      
      return {
        responseTime,
        messageVolume,
        taskCompletion,
        qualityScore,
        peerRating: parseFloat(peerRating),
        engagementScore,
        channelPreference,
        responseTimeHistory
      };
    }
  
    // Get department-specific analytics
    async getDepartmentAnalytics(departmentName: string): Promise<{
      avgResponseTime: number;
      avgMessageVolume: number;
      avgTaskCompletion: number;
      avgQualityScore: number;
      crossTeamCollaboration: number;
      employeeCount: number;
      performanceDistribution: { level: string, percentage: number }[];
    }> {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Generate department analytics with realistic values
      return {
        avgResponseTime: Math.floor(Math.random() * 20) + 8, // 8-28 minutes
        avgMessageVolume: Math.floor(Math.random() * 30) + 40, // 40-70 messages
        avgTaskCompletion: Math.floor(Math.random() * 15) + 80, // 80-95%
        avgQualityScore: (Math.random() * 2 + 7.5).toFixed(1), // 7.5-9.5
        crossTeamCollaboration: Math.floor(Math.random() * 30) + 40, // 40-70%
        employeeCount: Math.floor(Math.random() * 50) + 10, // 10-60 employees
        performanceDistribution: [
          { level: 'Exceptional', percentage: Math.floor(Math.random() * 15) + 5 },
          { level: 'Exceeds Expectations', percentage: Math.floor(Math.random() * 20) + 15 },
          { level: 'Meets Expectations', percentage: Math.floor(Math.random() * 30) + 40 },
          { level: 'Needs Improvement', percentage: Math.floor(Math.random() * 15) + 5 },
          { level: 'Unsatisfactory', percentage: Math.floor(Math.random() * 5) + 1 }
        ]
      };
    }
  }
  
  // Export a singleton instance
  export const analyticsService = new AnalyticsService();