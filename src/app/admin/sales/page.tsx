"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Activity,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import Link from "next/link";

interface DashboardData {
  overview: {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    totalOpportunities: number;
    wonOpportunities: number;
    lostOpportunities: number;
    pipelineValue: number;
    wonValue: number;
    conversionRate: number;
    avgDealSize: number;
    winRate: number;
  };
  charts: {
    leadsByStatus: any[];
    leadsBySource: any[];
    opportunitiesByStage: any[];
  };
  activities: {
    recent: any[];
    upcomingTasks: any[];
  };
  performance: {
    team: any[];
  };
}

export default function SalesDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // days

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await fetch(
        `/api/sales/analytics/dashboard?startDate=${startDate.toISOString()}&endDate=${new Date().toISOString()}`
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center text-gray-500">
          Failed to load dashboard data
        </div>
      </div>
    );
  }

  const { overview, charts, activities, performance } = data;

  const statCards = [
    {
      title: "Pipeline Value",
      value: `$${overview.pipelineValue.toLocaleString()}`,
      change: "+12.5%",
      trending: "up",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Won Revenue",
      value: `$${overview.wonValue.toLocaleString()}`,
      change: "+8.3%",
      trending: "up",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Active Leads",
      value: overview.totalLeads.toLocaleString(),
      change: `+${overview.newLeads}`,
      trending: "up",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Opportunities",
      value: overview.totalOpportunities.toLocaleString(),
      change: `${overview.wonOpportunities} won`,
      trending: "up",
      icon: Target,
      color: "bg-orange-500",
    },
    {
      title: "Conversion Rate",
      value: `${overview.conversionRate.toFixed(1)}%`,
      change: "+2.1%",
      trending: "up",
      icon: Activity,
      color: "bg-indigo-500",
    },
    {
      title: "Win Rate",
      value: `${overview.winRate.toFixed(1)}%`,
      change: "+5.4%",
      trending: "up",
      icon: CheckCircle,
      color: "bg-teal-500",
    },
    {
      title: "Avg Deal Size",
      value: `$${overview.avgDealSize.toLocaleString()}`,
      change: "+3.2%",
      trending: "up",
      icon: BarChart3,
      color: "bg-pink-500",
    },
    {
      title: "Qualified Leads",
      value: overview.qualifiedLeads.toLocaleString(),
      change: `${((overview.qualifiedLeads / overview.totalLeads) * 100).toFixed(1)}%`,
      trending: "up",
      icon: Target,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Sales Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Complete overview of your sales performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <Link
              href="/admin/sales/leads"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View All Leads
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Leads by Status */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Leads by Status</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {charts.leadsByStatus.map((item: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.status}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {item._count.status}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(item._count.status / overview.totalLeads) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by Source */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Top Lead Sources
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {charts.leadsBySource.slice(0, 5).map((item: any, index: number) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item.source || "Unknown"}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {item._count.source}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${(item._count.source / overview.totalLeads) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Sales Pipeline</h2>
          <LineChart className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {charts.opportunitiesByStage.map((stage: any, index: number) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-2 capitalize">
                {stage.stage.replace("-", " ")}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stage._count.stage}
              </p>
              <p className="text-sm text-gray-600">
                ${(stage._sum.value || 0).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Activities
            </h2>
            <Link
              href="/admin/sales/activities"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {activities.recent.slice(0, 5).map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0">
                  {activity.activityType === "call" && (
                    <Phone className="w-5 h-5 text-blue-600" />
                  )}
                  {activity.activityType === "email" && (
                    <Mail className="w-5 h-5 text-green-600" />
                  )}
                  {activity.activityType === "meeting" && (
                    <Calendar className="w-5 h-5 text-purple-600" />
                  )}
                  {activity.activityType === "task" && (
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.subject}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {activity.SalesLead
                      ? `${activity.SalesLead.firstName} ${activity.SalesLead.lastName}`
                      : activity.SalesOpportunity?.name || "Unknown"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                    activity.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Tasks</h2>
            <Link
              href="/admin/sales/tasks"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {activities.upcomingTasks.slice(0, 5).map((task: any) => (
              <div
                key={task.id}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {task.SalesLead
                      ? `${task.SalesLead.firstName} ${task.SalesLead.lastName}`
                      : task.SalesOpportunity?.name || "No context"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                    task.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : task.priority === "normal"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Team Performance</h2>
          <Link
            href="/admin/sales/team"
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            View details
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opportunities
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Deal Size
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performance.team.slice(0, 5).map((member: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {member.assignedTo?.charAt(0) || "U"}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.assignedTo || "Unassigned"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {member._count.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${(member._sum.value || 0).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      $
                      {Math.round(
                        (member._sum.value || 0) / member._count.id
                      ).toLocaleString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <Link
          href="/admin/sales/leads/new"
          className="flex items-center justify-center gap-2 p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Users className="w-5 h-5" />
          Add New Lead
        </Link>
        <Link
          href="/admin/sales/opportunities/new"
          className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Target className="w-5 h-5" />
          Create Opportunity
        </Link>
        <Link
          href="/admin/sales/activities/new"
          className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Activity className="w-5 h-5" />
          Log Activity
        </Link>
        <Link
          href="/admin/sales/reports"
          className="flex items-center justify-center gap-2 p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          View Reports
        </Link>
      </div>
    </div>
  );
}
