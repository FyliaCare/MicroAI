"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  BookOpen,
  Zap,
  Target,
  Users,
  TrendingUp,
  Award,
  FileText,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function SalesToolsPage() {
  const [templates, setTemplates] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [playbooks, setPlaybooks] = useState([]);
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchToolsData();
  }, []);

  const fetchToolsData = async () => {
    try {
      setLoading(true);
      const [templatesRes, scriptsRes, playbooksRes, automationsRes] =
        await Promise.all([
          fetch("/api/sales/tools/email-templates"),
          fetch("/api/sales/tools/call-scripts"),
          fetch("/api/sales/tools/playbooks"),
          fetch("/api/sales/tools/automations"),
        ]);

      const [templatesData, scriptsData, playbooksData, automationsData] =
        await Promise.all([
          templatesRes.json(),
          scriptsRes.json(),
          playbooksRes.json(),
          automationsRes.json(),
        ]);

      setTemplates(templatesData.templates || []);
      setScripts(scriptsData.scripts || []);
      setPlaybooks(playbooksData.playbooks || []);
      setAutomations(automationsData.automations || []);
    } catch (error) {
      console.error("Error fetching tools data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toolCategories = [
    {
      title: "Email Templates",
      description: "Pre-built email templates for every scenario",
      icon: Mail,
      color: "bg-blue-500",
      count: templates.length,
      link: "/admin/sales/tools/email-templates",
    },
    {
      title: "Call Scripts",
      description: "Proven scripts for different call types",
      icon: Phone,
      color: "bg-green-500",
      count: scripts.length,
      link: "/admin/sales/tools/call-scripts",
    },
    {
      title: "Sales Playbooks",
      description: "Best practices and processes",
      icon: BookOpen,
      color: "bg-purple-500",
      count: playbooks.length,
      link: "/admin/sales/tools/playbooks",
    },
    {
      title: "Automations",
      description: "Automated workflows and sequences",
      icon: Zap,
      color: "bg-yellow-500",
      count: automations.length,
      link: "/admin/sales/tools/automations",
    },
    {
      title: "Sales Targets",
      description: "Set and track team goals",
      icon: Target,
      color: "bg-red-500",
      count: 0,
      link: "/admin/sales/tools/targets",
    },
    {
      title: "Team Management",
      description: "Organize and manage your team",
      icon: Users,
      color: "bg-indigo-500",
      count: 0,
      link: "/admin/sales/tools/teams",
    },
    {
      title: "Leaderboards",
      description: "Track top performers",
      icon: Award,
      color: "bg-orange-500",
      count: 0,
      link: "/admin/sales/tools/leaderboards",
    },
    {
      title: "Competitors",
      description: "Competitive intelligence",
      icon: TrendingUp,
      color: "bg-pink-500",
      count: 0,
      link: "/admin/sales/tools/competitors",
    },
    {
      title: "Reports",
      description: "Custom sales reports",
      icon: FileText,
      color: "bg-teal-500",
      count: 0,
      link: "/admin/sales/reports",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Sales Tools</h1>
            <p className="text-gray-600 mt-2">
              Everything your sales team needs to succeed
            </p>
          </div>
          <Link
            href="/admin/sales"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {toolCategories.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <Link
              key={index}
              href={tool.link}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${tool.color} p-4 rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                {tool.count > 0 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                    {tool.count}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-gray-600">{tool.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Templates</p>
              <p className="text-3xl font-bold text-gray-900">
                {templates.filter((t: any) => t.isActive).length}
              </p>
            </div>
            <Mail className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Call Scripts</p>
              <p className="text-3xl font-bold text-gray-900">
                {scripts.filter((s: any) => s.isActive).length}
              </p>
            </div>
            <Phone className="w-12 h-12 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Playbooks</p>
              <p className="text-3xl font-bold text-gray-900">
                {playbooks.filter((p: any) => p.isActive).length}
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-purple-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Automations</p>
              <p className="text-3xl font-bold text-gray-900">
                {automations.filter((a: any) => a.isActive).length}
              </p>
            </div>
            <Zap className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Recent Templates */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Popular Email Templates
          </h2>
          <Link
            href="/admin/sales/tools/email-templates"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.slice(0, 6).map((template: any) => (
            <div
              key={template.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {template.category || "General"}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {template.description || template.subject}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Used {template.usageCount} times
                </span>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Scripts */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Call Scripts</h2>
          <Link
            href="/admin/sales/tools/call-scripts"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scripts.slice(0, 6).map((script: any) => (
            <div
              key={script.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{script.name}</h3>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded capitalize">
                  {script.scriptType}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {script.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {script.usageCount} uses
                  </span>
                  {script.successRate && (
                    <span className="text-xs text-green-600 font-medium">
                      {script.successRate}% success
                    </span>
                  )}
                </div>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                  View Script
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Automations */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Active Automations
          </h2>
          <Link
            href="/admin/sales/tools/automations"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Manage all →
          </Link>
        </div>
        <div className="space-y-4">
          {automations.slice(0, 5).map((automation: any) => (
            <div
              key={automation.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-yellow-500 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {automation.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {automation.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Executed {automation.executionCount} times
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    automation.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {automation.isActive ? "Active" : "Inactive"}
                </span>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
