"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
  status: "new" | "in_progress" | "implemented";
  category: string;
  source: {
    feedbackCount: number;
    averageRating: number;
  };
};

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    title: "Extend breakfast hours",
    description:
      "80% of guests mentioned breakfast timing issues. Consider extending breakfast hours by 1 hour.",
    impact: "high",
    confidence: 0.92,
    status: "new",
    category: "Food & Beverage",
    source: {
      feedbackCount: 42,
      averageRating: 2.3,
    },
  },
  {
    id: "2",
    title: "Upgrade WiFi infrastructure",
    description:
      "Multiple complaints about slow WiFi, especially during peak hours. Consider upgrading bandwidth.",
    impact: "high",
    confidence: 0.88,
    status: "in_progress",
    category: "Amenities",
    source: {
      feedbackCount: 37,
      averageRating: 1.8,
    },
  },
  {
    id: "3",
    title: "Add more vegetarian options",
    description:
      "Growing trend of requests for more vegetarian menu options, especially for dinner.",
    impact: "medium",
    confidence: 0.76,
    status: "new",
    category: "Food & Beverage",
    source: {
      feedbackCount: 23,
      averageRating: 3.1,
    },
  },
  {
    id: "4",
    title: "Improve check-in process",
    description:
      "Guests report average wait time of 12 minutes during peak check-in hours. Consider adding self-check-in kiosks.",
    impact: "high",
    confidence: 0.85,
    status: "implemented",
    category: "Service",
    source: {
      feedbackCount: 31,
      averageRating: 2.7,
    },
  },
  {
    id: "5",
    title: "Enhance room soundproofing",
    description:
      "Noise complaints are concentrated on rooms facing the street. Consider enhanced soundproofing.",
    impact: "medium",
    confidence: 0.79,
    status: "new",
    category: "Room",
    source: {
      feedbackCount: 18,
      averageRating: 2.5,
    },
  },
];

export function SmartRecommendations() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredRecommendations =
    activeFilter === "all"
      ? mockRecommendations
      : mockRecommendations.filter((rec) => rec.status === activeFilter);

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            High Impact
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
            Medium Impact
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Low Impact
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            New
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            In Progress
          </Badge>
        );
      case "implemented":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Implemented
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Lightbulb className="h-5 w-5 text-purple-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "implemented":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-purple-600" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("all")}
            className={
              activeFilter === "all" ? "bg-purple-600 hover:bg-purple-700" : ""
            }
          >
            All
          </Button>
          <Button
            variant={activeFilter === "new" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("new")}
            className={
              activeFilter === "new" ? "bg-purple-600 hover:bg-purple-700" : ""
            }
          >
            New
          </Button>
          <Button
            variant={activeFilter === "in_progress" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("in_progress")}
            className={
              activeFilter === "in_progress"
                ? "bg-purple-600 hover:bg-purple-700"
                : ""
            }
          >
            In Progress
          </Button>
          <Button
            variant={activeFilter === "implemented" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter("implemented")}
            className={
              activeFilter === "implemented"
                ? "bg-purple-600 hover:bg-purple-700"
                : ""
            }
          >
            Implemented
          </Button>
        </div>

        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  {getStatusIcon(recommendation.status)}
                  <h3 className="font-medium ml-2">{recommendation.title}</h3>
                </div>
                <div className="flex space-x-2">
                  {getImpactBadge(recommendation.impact)}
                  {getStatusBadge(recommendation.status)}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">
                {recommendation.description}
              </p>

              <div className="bg-gray-50 p-3 rounded-md mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">AI Confidence</span>
                  <span className="font-medium">
                    {Math.round(recommendation.confidence * 100)}%
                  </span>
                </div>
                <Progress
                  value={recommendation.confidence * 100}
                  className="h-2"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  <span>
                    Based on {recommendation.source.feedbackCount} feedbacks
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-800 p-0"
                >
                  View Details <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
