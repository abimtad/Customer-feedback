"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { VoiceSentimentAnalyzer } from "@/components/voice-sentiment-analyzer";
import { EmotionDetector } from "@/components/emotion-detector";
import { SentimentHeatmap } from "@/components/sentiment-heatmap";
import { FeedbackGamification } from "@/components/feedback-gamification";
import { SmartRecommendations } from "@/components/smart-recommendations";
import { FeedbackTimeline } from "@/components/feedback-timeline";
import { MultiLanguageSupport } from "@/components/multi-language-support";
import { WeeklyReportGenerator } from "@/components/weekly-report-generator";

export default function AdvancedFeaturesPage() {
  const [activeTab, setActiveTab] = useState("voice");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/demo"
            className="inline-flex items-center text-purple-700 hover:text-purple-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Demo
          </Link>
          <h1 className="text-3xl font-bold mt-4">Advanced Features</h1>
          <p className="text-gray-600">
            Experience the cutting-edge capabilities of Smart Feedback Hub
          </p>
        </div>

        <Tabs defaultValue="voice" onValueChange={setActiveTab}>
          <div className="mb-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="voice">Voice & Emotion</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="reporting">Reporting</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="voice" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <VoiceSentimentAnalyzer
                onAnalysisComplete={(result) => console.log(result)}
              />
              <EmotionDetector
                onEmotionDetected={(result) => console.log(result)}
              />
            </div>
          </TabsContent>

          <TabsContent value="visualization" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <SentimentHeatmap />
              <Card>
                <CardHeader>
                  <CardTitle>Feature Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The Sentiment Heatmap provides a visual representation of
                    guest feedback across different locations and services in
                    your property. This helps you quickly identify problem areas
                    and excellence zones.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-2"></div>
                      <span>
                        Green zones indicate areas with consistently positive
                        feedback
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2 mr-2"></div>
                      <span>
                        Yellow zones show areas with mixed or neutral feedback
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2 mr-2"></div>
                      <span>
                        Red zones highlight areas requiring immediate attention
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <FeedbackGamification />
              <div className="space-y-6">
                <MultiLanguageSupport />
                <FeedbackTimeline />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reporting" className="mt-0">
            <div className="grid md:grid-cols-2 gap-6">
              <SmartRecommendations />
              <WeeklyReportGenerator />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
