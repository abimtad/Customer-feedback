"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { FeedbackKiosk } from "@/components/feedback-kiosk";
import { StaffDashboard } from "@/components/staff-dashboard";
import { ChatbotFeedback } from "@/components/chatbot-feedback";

export default function DemoPage() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

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
          <h1 className="text-3xl font-bold mt-4">Interactive Demo</h1>
          <p className="text-gray-600">
            Experience the Smart Feedback Hub in action
          </p>
        </div>

        {!activeDemo ? (
          <div className="grid md:grid-cols-3 gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveDemo("chatbot")}
            >
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>AI Chatbot</CardTitle>
                <CardDescription>
                  Experience our conversational feedback collection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Our AI chatbot engages guests in natural conversation to
                  collect detailed feedback about their experience.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Try Demo</Button>
              </CardFooter>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveDemo("kiosk")}
            >
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <ThumbsUp className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Digital Kiosk</CardTitle>
                <CardDescription>
                  Quick and easy feedback collection interface
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Digital kiosks placed at strategic locations offer quick pulse
                  checks on the guest experience.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Try Demo</Button>
              </CardFooter>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setActiveDemo("dashboard")}
            >
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <ThumbsDown className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Staff Dashboard</CardTitle>
                <CardDescription>
                  See how staff respond to and manage feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  The staff dashboard shows real-time feedback, escalations, and
                  response tracking.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Try Demo</Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={() => setActiveDemo(null)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Demo Selection
              </Button>

              <Link href="/advanced-features">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Advanced Features
                </Button>
              </Link>
            </div>

            {activeDemo === "chatbot" && <ChatbotFeedback />}
            {activeDemo === "kiosk" && <FeedbackKiosk />}
            {activeDemo === "dashboard" && <StaffDashboard />}
          </div>
        )}
      </div>
    </div>
  );
}
