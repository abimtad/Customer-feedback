"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User } from "lucide-react";

type FeedbackItem = {
  id: string;
  content: string;
  timestamp: string;
  status: "submitted" | "in_progress" | "resolved";
  responseTime?: string;
  response?: string;
  category: string;
};

const mockFeedbackHistory: FeedbackItem[] = [
  {
    id: "1",
    content:
      "The air conditioning in my room (302) is not working properly. It's very hot and uncomfortable.",
    timestamp: "2023-06-15 14:32",
    status: "resolved",
    responseTime: "22 minutes",
    response:
      "Our maintenance team fixed the AC unit. We also provided a complimentary drink for the inconvenience.",
    category: "Room Maintenance",
  },
  {
    id: "2",
    content:
      "Breakfast was excellent today! The chef made a special vegetarian option for me when I asked.",
    timestamp: "2023-06-14 09:15",
    status: "resolved",
    responseTime: "15 minutes",
    response:
      "Thank you for your kind feedback! We've shared your comments with our chef and kitchen staff.",
    category: "Food & Beverage",
  },
  {
    id: "3",
    content:
      "The WiFi signal is very weak in the conference room area. We're having trouble connecting for our meeting.",
    timestamp: "2023-06-13 11:45",
    status: "in_progress",
    category: "Amenities",
  },
  {
    id: "4",
    content:
      "I found a stain on the bedsheet in my room 405. Could someone please change it?",
    timestamp: "2023-06-10 20:10",
    status: "resolved",
    responseTime: "12 minutes",
    response:
      "Our housekeeping team changed your bedding immediately and performed a thorough room inspection.",
    category: "Housekeeping",
  },
  {
    id: "5",
    content:
      "The gym equipment needs maintenance. The treadmill is making a loud noise when used.",
    timestamp: "2023-06-08 16:22",
    status: "submitted",
    category: "Facilities",
  },
];

export function FeedbackTimeline() {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "submitted":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "in_progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
        );
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Your Feedback History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockFeedbackHistory.map((item) => (
            <div key={item.id} className="relative">
              {/* Timeline connector */}
              <div className="absolute top-0 left-6 w-px bg-gray-200 h-full"></div>

              <div className="flex">
                {/* Status icon */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-gray-200">
                  {getStatusIcon(item.status)}
                </div>

                {/* Content */}
                <div className="flex-1 ml-4">
                  <div
                    className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(item.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">
                          {item.timestamp}
                        </div>
                        <div className="font-medium">{item.category}</div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>

                    <p className="text-gray-700 mb-2">{item.content}</p>

                    {item.status !== "submitted" && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>
                          Response time: {item.responseTime || "Pending"}
                        </span>
                      </div>
                    )}

                    {expandedItem === item.id && item.response && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-1 text-purple-600" />
                          <span className="text-sm font-medium">
                            Staff Response
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                          {item.response}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
