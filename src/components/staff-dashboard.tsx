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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  Clock,
  MessageSquare,
  ThumbsDown,
  ThumbsUp,
  User,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Globe,
  Star,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Update the FeedbackItem type to include ratings
type Rating = {
  aspect: string;
  score: number;
};

type FeedbackItem = {
  id: string;
  guest: {
    name: string;
    avatar?: string;
  };
  content: string;
  sentiment: "positive" | "negative" | "neutral";
  source: "chatbot" | "kiosk" | "survey";
  status: "new" | "in_progress" | "resolved";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  timestamp: string;
  media?: {
    type: "image" | "audio" | "video";
    url: string;
  };
  language?: string;
  ratings?: Rating[];
};

const mockFeedbackData: FeedbackItem[] = [
  {
    id: "0",
    guest: {
      name: "Robert Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "There's a water leak in the bathroom ceiling of room 405! Water is dripping onto the floor creating a hazard.",
    sentiment: "negative",
    source: "chatbot",
    status: "new",
    priority: "critical",
    category: "Safety",
    timestamp: "5 minutes ago",
    media: {
      type: "image",
      url: "/placeholder.svg?height=200&width=300",
    },
  },
  {
    id: "1",
    guest: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "The room was not properly cleaned when I arrived. There were stains on the carpet and the bathroom had hair in the shower.",
    sentiment: "negative",
    source: "chatbot",
    status: "new",
    priority: "high",
    category: "Cleanliness",
    timestamp: "10 minutes ago",
    ratings: [
      { aspect: "cleanliness", score: 1 },
      { aspect: "room", score: 2 },
    ],
  },
  {
    id: "2",
    guest: {
      name: "Michael Brown",
    },
    content:
      "The staff at the front desk was extremely helpful and friendly. They made check-in a breeze!",
    sentiment: "positive",
    source: "kiosk",
    status: "new",
    priority: "low",
    category: "Service",
    timestamp: "25 minutes ago",
    ratings: [{ aspect: "service", score: 5 }],
  },
  {
    id: "3",
    guest: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "The breakfast buffet had limited options for vegetarians. Would appreciate more variety.",
    sentiment: "neutral",
    source: "survey",
    status: "in_progress",
    priority: "medium",
    category: "Food & Beverage",
    timestamp: "1 hour ago",
    ratings: [{ aspect: "food", score: 3 }],
  },
  {
    id: "4",
    guest: {
      name: "David Lee",
    },
    content:
      "The air conditioning in my room (302) is not working properly. It's very hot and uncomfortable.",
    sentiment: "negative",
    source: "chatbot",
    status: "in_progress",
    priority: "high",
    category: "Room Maintenance",
    timestamp: "2 hours ago",
    ratings: [
      { aspect: "room", score: 2 },
      { aspect: "value", score: 1 },
    ],
  },
  {
    id: "5",
    guest: {
      name: "Jennifer Adams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content:
      "Excellent service at the restaurant last night. The chef came out to discuss my food allergies personally.",
    sentiment: "positive",
    source: "kiosk",
    status: "resolved",
    priority: "medium",
    category: "Food & Beverage",
    timestamp: "1 day ago",
    ratings: [
      { aspect: "food", score: 5 },
      { aspect: "service", score: 5 },
    ],
  },
];

// Service categories that can be rated
const serviceCategories = [
  { id: "room", label: "Room" },
  { id: "service", label: "Staff & Service" },
  { id: "food", label: "Food & Dining" },
  { id: "cleanliness", label: "Cleanliness" },
  { id: "amenities", label: "Amenities" },
  { id: "value", label: "Value for Money" },
  { id: "location", label: "Location" },
  { id: "wifi", label: "WiFi" },
];

export function StaffDashboard() {
  const [feedbackItems, setFeedbackItems] =
    useState<FeedbackItem[]>(mockFeedbackData);
  const [selectedItem, setSelectedItem] = useState<FeedbackItem | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const updateFeedbackStatus = (
    id: string,
    status: "new" | "in_progress" | "resolved"
  ) => {
    setFeedbackItems(
      feedbackItems.map((item) => (item.id === id ? { ...item, status } : item))
    );

    if (selectedItem && selectedItem.id === id) {
      setSelectedItem({ ...selectedItem, status });
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Add this function to your component to render severity icons
  const getSeverityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  // Update your getPriorityBadge function to include critical
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="destructive" className="bg-red-600">
            Critical
          </Badge>
        );
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return (
          <Badge variant="default" className="bg-orange-500">
            Medium
          </Badge>
        );
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            New
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "chatbot":
        return <MessageSquare className="h-4 w-4" />;
      case "kiosk":
        return <User className="h-4 w-4" />;
      case "survey":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Calculate average ratings for each service category
  const calculateAverageRatings = () => {
    const ratings: Record<string, { total: number; count: number }> = {};

    // Initialize all service categories
    serviceCategories.forEach((category) => {
      ratings[category.id] = { total: 0, count: 0 };
    });

    // Sum up all ratings
    feedbackItems.forEach((item) => {
      if (item.ratings) {
        item.ratings.forEach((rating) => {
          if (ratings[rating.aspect]) {
            ratings[rating.aspect].total += rating.score;
            ratings[rating.aspect].count += 1;
          }
        });
      }
    });

    // Calculate averages
    const averages: Record<string, number> = {};
    Object.entries(ratings).forEach(([aspect, data]) => {
      averages[aspect] = data.count > 0 ? data.total / data.count : 0;
    });

    return averages;
  };

  const averageRatings = calculateAverageRatings();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Guest Feedback</CardTitle>
            <CardDescription>
              Monitor and respond to guest feedback in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {feedbackItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedItem?.id === item.id
                        ? "border-purple-500 bg-purple-50"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={item.guest.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {item.guest.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{item.guest.name}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            {getSourceIcon(item.source)}
                            <span className="ml-1 mr-2">{item.source}</span>
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getSeverityIcon(item.priority)}
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    <div className="flex items-start mt-2">
                      <div className="mr-2 mt-1">
                        {getSentimentIcon(item.sentiment)}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {item.content}
                      </p>
                    </div>

                    {item.ratings && item.ratings.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.ratings.map((rating) => (
                          <Badge
                            key={rating.aspect}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {serviceCategories.find(
                              (s) => s.id === rating.aspect
                            )?.label || rating.aspect}
                            :
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= rating.score
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="new" className="space-y-4">
                {feedbackItems
                  .filter((item) => item.status === "new")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 cursor-pointer hover:border-gray-300"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={item.guest.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {item.guest.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.guest.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              {getSourceIcon(item.source)}
                              <span className="ml-1 mr-2">{item.source}</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{item.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(item.priority)}
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <div className="flex items-start mt-2">
                        <div className="mr-2 mt-1">
                          {getSentimentIcon(item.sentiment)}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {item.content}
                        </p>
                      </div>

                      {item.ratings && item.ratings.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.ratings.map((rating) => (
                            <Badge
                              key={rating.aspect}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {serviceCategories.find(
                                (s) => s.id === rating.aspect
                              )?.label || rating.aspect}
                              :
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= rating.score
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </TabsContent>

              {/* Similar content for in_progress and resolved tabs */}
              <TabsContent value="in_progress" className="space-y-4">
                {feedbackItems
                  .filter((item) => item.status === "in_progress")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 cursor-pointer hover:border-gray-300"
                      onClick={() => setSelectedItem(item)}
                    >
                      {/* Similar content structure as above */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={item.guest.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {item.guest.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.guest.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              {getSourceIcon(item.source)}
                              <span className="ml-1 mr-2">{item.source}</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{item.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(item.priority)}
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <div className="flex items-start mt-2">
                        <div className="mr-2 mt-1">
                          {getSentimentIcon(item.sentiment)}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {item.content}
                        </p>
                      </div>

                      {item.ratings && item.ratings.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.ratings.map((rating) => (
                            <Badge
                              key={rating.aspect}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {serviceCategories.find(
                                (s) => s.id === rating.aspect
                              )?.label || rating.aspect}
                              :
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= rating.score
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="resolved" className="space-y-4">
                {feedbackItems
                  .filter((item) => item.status === "resolved")
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 cursor-pointer hover:border-gray-300"
                      onClick={() => setSelectedItem(item)}
                    >
                      {/* Similar content structure as above */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={item.guest.avatar || "/placeholder.svg"}
                            />
                            <AvatarFallback>
                              {item.guest.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{item.guest.name}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              {getSourceIcon(item.source)}
                              <span className="ml-1 mr-2">{item.source}</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{item.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSeverityIcon(item.priority)}
                          {getPriorityBadge(item.priority)}
                          {getStatusBadge(item.status)}
                        </div>
                      </div>
                      <div className="flex items-start mt-2">
                        <div className="mr-2 mt-1">
                          {getSentimentIcon(item.sentiment)}
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {item.content}
                        </p>
                      </div>

                      {item.ratings && item.ratings.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {item.ratings.map((rating) => (
                            <Badge
                              key={rating.aspect}
                              variant="outline"
                              className="flex items-center gap-1"
                            >
                              {serviceCategories.find(
                                (s) => s.id === rating.aspect
                              )?.label || rating.aspect}
                              :
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= rating.score
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </TabsContent>

              {/* Ratings summary tab */}
              <TabsContent value="ratings" className="space-y-6">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">
                    Average Ratings by Category
                  </h3>

                  {serviceCategories.map((category) => {
                    const avgRating = averageRatings[category.id] || 0;
                    const ratingCount = feedbackItems.filter((item) =>
                      item.ratings?.some((r) => r.aspect === category.id)
                    ).length;

                    return (
                      <div key={category.id} className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{category.label}</span>
                          <div className="flex items-center">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= Math.round(avgRating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium">
                              {avgRating.toFixed(1)} ({ratingCount})
                            </span>
                          </div>
                        </div>
                        <Progress value={avgRating * 20} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="text-lg font-medium mb-4">Recent Ratings</h3>

                  <div className="space-y-4">
                    {feedbackItems
                      .filter((item) => item.ratings && item.ratings.length > 0)
                      .slice(0, 5)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="border-b pb-3 last:border-0"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage
                                  src={item.guest.avatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {item.guest.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">
                                {item.guest.name}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">
                              {item.timestamp}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {item.ratings.map((rating) => (
                              <Badge
                                key={rating.aspect}
                                variant="outline"
                                className="flex items-center gap-1"
                              >
                                {serviceCategories.find(
                                  (s) => s.id === rating.aspect
                                )?.label || rating.aspect}
                                :
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-3 w-3 ${
                                        star <= rating.score
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </Badge>
                            ))}
                          </div>

                          <p className="text-sm text-gray-700 mt-2">
                            {item.content}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div>
        {selectedItem ? (
          <Card>
            <CardHeader>
              <CardTitle>Feedback Details</CardTitle>
              <CardDescription>
                Review and respond to guest feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage
                      src={selectedItem.guest.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {selectedItem.guest.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedItem.guest.name}</p>
                    <p className="text-sm text-gray-500">
                      {selectedItem.timestamp}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 my-3">
                  {getSeverityIcon(selectedItem.priority)}
                  {getPriorityBadge(selectedItem.priority)}
                  {getStatusBadge(selectedItem.status)}
                  <Badge variant="outline">{selectedItem.category}</Badge>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg my-4">
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      {getSentimentIcon(selectedItem.sentiment)}
                    </div>
                    <p className="text-gray-700">{selectedItem.content}</p>
                  </div>
                </div>

                {selectedItem.ratings && selectedItem.ratings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Ratings</h4>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      {selectedItem.ratings.map((rating) => (
                        <div
                          key={rating.aspect}
                          className="flex justify-between items-center mb-2 last:mb-0"
                        >
                          <span>
                            {serviceCategories.find(
                              (s) => s.id === rating.aspect
                            )?.label || rating.aspect}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= rating.score
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedItem?.media && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Attached Media</h4>
                    {selectedItem.media.type === "image" && (
                      <img
                        src={selectedItem.media.url || "/placeholder.svg"}
                        alt="Guest shared image"
                        className="max-w-full rounded-md border border-gray-200"
                      />
                    )}
                    {selectedItem.media.type === "audio" && (
                      <audio
                        src={selectedItem.media.url}
                        controls
                        className="w-full"
                      />
                    )}
                    {selectedItem.media.type === "video" && (
                      <video
                        src={selectedItem.media.url}
                        controls
                        className="max-w-full rounded-md"
                      />
                    )}
                  </div>
                )}

                {selectedItem?.language && (
                  <div className="mt-2">
                    <Badge variant="outline">
                      <Globe className="h-3 w-3 mr-1" />
                      Non-English Feedback
                    </Badge>
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="font-medium mb-2">AI Analysis</h4>
                  <div className="bg-purple-50 p-3 rounded-lg text-sm">
                    <p className="mb-2">
                      <span className="font-medium">Sentiment:</span>{" "}
                      {selectedItem.sentiment === "positive"
                        ? "Positive feedback about our service"
                        : selectedItem.sentiment === "negative"
                        ? "Negative feedback requiring attention"
                        : "Neutral feedback with suggestions"}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Key Issues:</span>{" "}
                      {selectedItem.category}
                    </p>
                    <p>
                      <span className="font-medium">Recommended Action:</span>{" "}
                      {selectedItem.priority === "critical"
                        ? "Immediate action required - escalate to management"
                        : selectedItem.priority === "high"
                        ? "Urgent response required within 1 hour"
                        : selectedItem.priority === "medium"
                        ? "Address within 2 hours"
                        : "Standard follow-up"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch space-y-2">
              {selectedItem.status === "new" && (
                <Button
                  onClick={() =>
                    updateFeedbackStatus(selectedItem.id, "in_progress")
                  }
                  className="w-full"
                >
                  Start Handling
                </Button>
              )}
              {selectedItem.status === "in_progress" && (
                <Button
                  onClick={() =>
                    updateFeedbackStatus(selectedItem.id, "resolved")
                  }
                  className="w-full"
                >
                  Mark as Resolved
                </Button>
              )}
              {selectedItem.status === "resolved" && (
                <Button
                  variant="outline"
                  onClick={() =>
                    updateFeedbackStatus(selectedItem.id, "in_progress")
                  }
                  className="w-full"
                >
                  Reopen Issue
                </Button>
              )}
              <Button variant="outline" className="w-full">
                Send Response
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center p-6">
              <div className="bg-gray-100 rounded-full p-4 mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Feedback Selected</h3>
              <p className="text-gray-500 mb-4">
                Select a feedback item from the list to view details and take
                action.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
