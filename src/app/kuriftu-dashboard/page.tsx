"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MultiBranchDashboard } from "@/components/multi-branch-dashboard";
import { FeedbackChannels } from "@/components/feedback-channels";
import { EscalationSystem } from "@/components/escalation-system";

export default function KuriftuDashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mt-4">
            Kuriftu Resort Feedback Hub
          </h1>
          <p className="text-gray-600">
            Multi-branch feedback management and service optimization
          </p>
        </div>

        <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="dashboard">Analytics Dashboard</TabsTrigger>
              <TabsTrigger value="channels">Feedback Channels</TabsTrigger>
              <TabsTrigger value="escalation">Escalation System</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <MultiBranchDashboard />
          </TabsContent>

          <TabsContent value="channels" className="mt-0">
            <FeedbackChannels />
          </TabsContent>

          <TabsContent value="escalation" className="mt-0">
            <EscalationSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
