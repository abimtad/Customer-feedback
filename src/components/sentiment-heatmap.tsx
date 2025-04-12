"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, ThumbsDown, AlertTriangle, Info } from "lucide-react";

type LocationData = {
  id: string;
  name: string;
  sentiment: "positive" | "negative" | "neutral" | "critical";
  feedbackCount: number;
  score: number;
};

const mockLocationData: Record<string, LocationData[]> = {
  floors: [
    {
      id: "floor1",
      name: "1st Floor",
      sentiment: "positive",
      feedbackCount: 24,
      score: 4.2,
    },
    {
      id: "floor2",
      name: "2nd Floor",
      sentiment: "neutral",
      feedbackCount: 18,
      score: 3.5,
    },
    {
      id: "floor3",
      name: "3rd Floor",
      sentiment: "negative",
      feedbackCount: 31,
      score: 2.1,
    },
    {
      id: "floor4",
      name: "4th Floor",
      sentiment: "critical",
      feedbackCount: 12,
      score: 1.8,
    },
    {
      id: "floor5",
      name: "5th Floor",
      sentiment: "positive",
      feedbackCount: 15,
      score: 4.5,
    },
  ],
  areas: [
    {
      id: "lobby",
      name: "Lobby",
      sentiment: "positive",
      feedbackCount: 42,
      score: 4.3,
    },
    {
      id: "restaurant",
      name: "Restaurant",
      sentiment: "negative",
      feedbackCount: 28,
      score: 2.4,
    },
    {
      id: "pool",
      name: "Pool Area",
      sentiment: "positive",
      feedbackCount: 35,
      score: 4.7,
    },
    {
      id: "gym",
      name: "Fitness Center",
      sentiment: "neutral",
      feedbackCount: 19,
      score: 3.6,
    },
    {
      id: "spa",
      name: "Spa",
      sentiment: "positive",
      feedbackCount: 22,
      score: 4.1,
    },
    {
      id: "conference",
      name: "Conference Rooms",
      sentiment: "negative",
      feedbackCount: 15,
      score: 2.8,
    },
    {
      id: "parking",
      name: "Parking",
      sentiment: "critical",
      feedbackCount: 23,
      score: 1.9,
    },
  ],
  services: [
    {
      id: "frontdesk",
      name: "Front Desk",
      sentiment: "positive",
      feedbackCount: 38,
      score: 4.4,
    },
    {
      id: "housekeeping",
      name: "Housekeeping",
      sentiment: "negative",
      feedbackCount: 45,
      score: 2.3,
    },
    {
      id: "roomservice",
      name: "Room Service",
      sentiment: "neutral",
      feedbackCount: 27,
      score: 3.2,
    },
    {
      id: "concierge",
      name: "Concierge",
      sentiment: "positive",
      feedbackCount: 31,
      score: 4.0,
    },
    {
      id: "wifi",
      name: "WiFi Service",
      sentiment: "negative",
      feedbackCount: 52,
      score: 2.1,
    },
    {
      id: "breakfast",
      name: "Breakfast",
      sentiment: "positive",
      feedbackCount: 43,
      score: 4.2,
    },
  ],
};

export function SentimentHeatmap() {
  const [activeTab, setActiveTab] = useState("floors");

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-500";
      case "neutral":
        return "bg-yellow-400";
      case "negative":
        return "bg-red-400";
      case "critical":
        return "bg-red-600";
      default:
        return "bg-gray-300";
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-600" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="floors" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="floors">Floors</TabsTrigger>
            <TabsTrigger value="areas">Areas</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>

          {Object.entries(mockLocationData).map(([key, locations]) => (
            <TabsContent key={key} value={key} className="mt-0">
              <div className="grid grid-cols-1 gap-4">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="border rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-full min-h-[40px] ${getSentimentColor(
                          location.sentiment
                        )} rounded-l-md -ml-3 mr-3`}
                      ></div>
                      <div>
                        <h3 className="font-medium">{location.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{location.feedbackCount} feedbacks</span>
                          <span className="mx-2">•</span>
                          <span>Score: {location.score.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        variant="outline"
                        className={`flex items-center gap-1 ${
                          location.sentiment === "positive"
                            ? "border-green-300 text-green-700"
                            : location.sentiment === "negative"
                            ? "border-red-300 text-red-700"
                            : location.sentiment === "critical"
                            ? "border-red-500 text-red-800"
                            : "border-yellow-300 text-yellow-700"
                        }`}
                      >
                        {getSentimentIcon(location.sentiment)}
                        <span className="capitalize">{location.sentiment}</span>
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
