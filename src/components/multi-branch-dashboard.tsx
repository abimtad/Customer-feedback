"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BranchSelector, type Branch } from "@/components/branch-selector";
import { ServiceSelector, type Service } from "@/components/service-selector";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Clock,
  RefreshCw,
  MapPin,
  BarChart2,
  PieChart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Star,
  MessageSquare,
} from "lucide-react";

// Mock data types
type FeedbackSummary = {
  total: number;
  positive: number;
  negative: number;
  neutral: number;
  critical: number;
  responseTime: number; // in minutes
  resolutionRate: number; // percentage
};

type ServiceRating = {
  serviceId: string;
  serviceName: string;
  icon: string;
  rating: number;
  feedbackCount: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
};

type RecentFeedback = {
  id: string;
  branchId: string;
  serviceId: string;
  content: string;
  sentiment: "positive" | "negative" | "neutral" | "critical";
  timestamp: string;
  status: "new" | "in_progress" | "resolved";
  responseTime?: number; // in minutes
};

type BranchComparison = {
  branchId: string;
  branchName: string;
  overallRating: number;
  feedbackVolume: number;
  responseTime: number;
  resolutionRate: number;
};

// Mock data generator functions
const generateMockFeedbackSummary = (
  branchId: string,
  serviceId: string | null
): FeedbackSummary => {
  // Generate different data based on branch and service
  const baseTotal =
    branchId === "bishoftu" ? 120 : branchId === "entoto" ? 85 : 60;
  const multiplier =
    serviceId === "spa" ? 0.7 : serviceId === "dining" ? 1.2 : 1;

  const total = Math.floor(baseTotal * multiplier);
  const positive = Math.floor(total * (0.6 + Math.random() * 0.2));
  const negative = Math.floor(total * (0.1 + Math.random() * 0.1));
  const neutral = Math.floor(total * (0.1 + Math.random() * 0.1));
  const critical = total - positive - negative - neutral;

  return {
    total,
    positive,
    negative,
    neutral,
    critical,
    responseTime: Math.floor(15 + Math.random() * 20),
    resolutionRate: Math.floor(75 + Math.random() * 20),
  };
};

const generateMockServiceRatings = (branchId: string): ServiceRating[] => {
  // Get services available at this branch
  const availableServices = [
    { id: "accommodation", name: "Accommodation", icon: "🏨" },
    { id: "spa", name: "Spa & Wellness", icon: "💆" },
    { id: "dining", name: "Dining", icon: "🍽️" },
    { id: "events", name: "Events", icon: "🎪" },
    { id: "waterpark", name: "Waterpark", icon: "🌊" },
    { id: "adventure", name: "Adventure", icon: "🧗" },
  ].filter((service) => {
    if (branchId === "bishoftu")
      return ["accommodation", "spa", "dining", "events"].includes(service.id);
    if (branchId === "entoto")
      return ["accommodation", "spa", "dining", "events", "adventure"].includes(
        service.id
      );
    if (branchId === "langano")
      return ["accommodation", "waterpark", "dining"].includes(service.id);
    return true;
  });

  return availableServices.map((service) => ({
    serviceId: service.id,
    serviceName: service.name,
    icon: service.icon,
    rating: 3 + Math.random() * 2,
    feedbackCount: Math.floor(20 + Math.random() * 80),
    trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)] as
      | "up"
      | "down"
      | "stable",
    trendValue: Math.floor(Math.random() * 15),
  }));
};

const generateMockRecentFeedback = (
  branchId: string,
  serviceId: string | null
): RecentFeedback[] => {
  const feedbackTemplates = [
    {
      content: "The staff was extremely helpful and friendly.",
      sentiment: "positive",
    },
    {
      content: "Room was not properly cleaned when I arrived.",
      sentiment: "negative",
    },
    { content: "Food at the restaurant was excellent!", sentiment: "positive" },
    {
      content: "Spa treatment was relaxing but a bit overpriced.",
      sentiment: "neutral",
    },
    {
      content: "There's a water leak in the bathroom ceiling!",
      sentiment: "critical",
    },
    {
      content: "Check-in process was smooth and efficient.",
      sentiment: "positive",
    },
    {
      content: "WiFi connection was very slow throughout my stay.",
      sentiment: "negative",
    },
    {
      content: "Beautiful views from the room balcony.",
      sentiment: "positive",
    },
    {
      content: "The air conditioning wasn't working properly.",
      sentiment: "negative",
    },
    {
      content: "Breakfast buffet had limited options for vegetarians.",
      sentiment: "neutral",
    },
  ];

  // Generate 5-10 random feedback items
  const count = 5 + Math.floor(Math.random() * 5);
  const result: RecentFeedback[] = [];

  for (let i = 0; i < count; i++) {
    const template =
      feedbackTemplates[Math.floor(Math.random() * feedbackTemplates.length)];
    const status = ["new", "in_progress", "resolved"][
      Math.floor(Math.random() * 3)
    ] as "new" | "in_progress" | "resolved";

    result.push({
      id: `feedback-${branchId}-${i}`,
      branchId,
      serviceId:
        serviceId ||
        ["accommodation", "spa", "dining", "events"][
          Math.floor(Math.random() * 4)
        ],
      content: template.content,
      sentiment: template.sentiment as
        | "positive"
        | "negative"
        | "neutral"
        | "critical",
      timestamp: new Date(
        Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      status,
      responseTime:
        status !== "new" ? Math.floor(5 + Math.random() * 55) : undefined,
    });
  }

  return result;
};

const generateMockBranchComparison = (): BranchComparison[] => {
  const branches = [
    { id: "bishoftu", name: "Bishoftu" },
    { id: "entoto", name: "Entoto" },
    { id: "awash", name: "Awash Falls" },
    { id: "bahirdar", name: "Bahir Dar" },
    { id: "langano", name: "Langano" },
  ];

  return branches.map((branch) => ({
    branchId: branch.id,
    branchName: branch.name,
    overallRating: 3 + Math.random() * 2,
    feedbackVolume: Math.floor(50 + Math.random() * 150),
    responseTime: Math.floor(10 + Math.random() * 30),
    resolutionRate: Math.floor(70 + Math.random() * 25),
  }));
};

export function MultiBranchDashboard() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data states
  const [feedbackSummary, setFeedbackSummary] =
    useState<FeedbackSummary | null>(null);
  const [serviceRatings, setServiceRatings] = useState<ServiceRating[]>([]);
  const [recentFeedback, setRecentFeedback] = useState<RecentFeedback[]>([]);
  const [branchComparison, setBranchComparison] = useState<BranchComparison[]>(
    []
  );

  // Load data when branch or service changes
  useEffect(() => {
    if (selectedBranch) {
      setIsLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        setFeedbackSummary(
          generateMockFeedbackSummary(
            selectedBranch.id,
            selectedService?.id || null
          )
        );
        setServiceRatings(generateMockServiceRatings(selectedBranch.id));
        setRecentFeedback(
          generateMockRecentFeedback(
            selectedBranch.id,
            selectedService?.id || null
          )
        );
        setBranchComparison(generateMockBranchComparison());
        setIsLoading(false);
      }, 800);
    }
  }, [selectedBranch, selectedService]);

  const handleBranchChange = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedService(null);
  };

  const handleServiceChange = (service: Service | null) => {
    setSelectedService(service);
  };

  const refreshData = () => {
    if (selectedBranch) {
      setIsLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        setFeedbackSummary(
          generateMockFeedbackSummary(
            selectedBranch.id,
            selectedService?.id || null
          )
        );
        setServiceRatings(generateMockServiceRatings(selectedBranch.id));
        setRecentFeedback(
          generateMockRecentFeedback(
            selectedBranch.id,
            selectedService?.id || null
          )
        );
        setBranchComparison(generateMockBranchComparison());
        setIsLoading(false);
      }, 800);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            New
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 border-yellow-300"
          >
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/2">
          <BranchSelector onBranchChange={handleBranchChange} />
        </div>
        <div className="w-full md:w-1/2">
          {selectedBranch && (
            <ServiceSelector
              branchId={selectedBranch.id}
              onServiceChange={handleServiceChange}
              includeAllOption={true}
            />
          )}
        </div>
      </div>

      {selectedBranch && (
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-purple-600" />
            <h2 className="text-xl font-semibold">
              {selectedBranch.name}
              {selectedService && (
                <span className="ml-2 text-gray-500">
                  • {selectedService.icon} {selectedService.name}
                </span>
              )}
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      )}

      {selectedBranch && (
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="feedback">Recent Feedback</TabsTrigger>
            <TabsTrigger value="comparison">Branch Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            {feedbackSummary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Total Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {feedbackSummary.total}
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-1">
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1 bg-green-500 mb-1"></div>
                        <div className="text-xs">
                          {Math.round(
                            (feedbackSummary.positive / feedbackSummary.total) *
                              100
                          )}
                          %
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1 bg-yellow-500 mb-1"></div>
                        <div className="text-xs">
                          {Math.round(
                            (feedbackSummary.neutral / feedbackSummary.total) *
                              100
                          )}
                          %
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1 bg-red-400 mb-1"></div>
                        <div className="text-xs">
                          {Math.round(
                            (feedbackSummary.negative / feedbackSummary.total) *
                              100
                          )}
                          %
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-full h-1 bg-red-600 mb-1"></div>
                        <div className="text-xs">
                          {Math.round(
                            (feedbackSummary.critical / feedbackSummary.total) *
                              100
                          )}
                          %
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Sentiment Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <span className="text-sm">Positive</span>
                        </div>
                        <span className="font-medium">
                          {feedbackSummary.positive}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <span className="text-sm">Neutral</span>
                        </div>
                        <span className="font-medium">
                          {feedbackSummary.neutral}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                          <span className="text-sm">Negative</span>
                        </div>
                        <span className="font-medium">
                          {feedbackSummary.negative}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
                          <span className="text-sm">Critical</span>
                        </div>
                        <span className="font-medium">
                          {feedbackSummary.critical}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Avg. Response Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {feedbackSummary.responseTime} min
                    </div>
                    <Progress
                      value={100 - (feedbackSummary.responseTime / 60) * 100}
                      className="h-2 mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Target: <span className="font-medium">30 min</span>
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Resolution Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {feedbackSummary.resolutionRate}%
                    </div>
                    <Progress
                      value={feedbackSummary.resolutionRate}
                      className="h-2 mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Target: <span className="font-medium">85%</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                    Feedback Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-300">
                    <div className="text-center p-6">
                      <BarChart2 className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium text-gray-600">
                        Feedback Volume Over Time
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Daily and weekly trends would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                    Top Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {serviceRatings.slice(0, 4).map((service, index) => (
                      <div
                        key={service.serviceId}
                        className="flex items-center"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-lg">{service.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">
                              {service.serviceName}
                            </span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                              <span className="text-sm">
                                {service.rating.toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={service.rating * 20}
                            className="h-1"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {serviceRatings.map((service) => (
                <Card key={service.serviceId}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <span className="text-xl">{service.icon}</span>
                        </div>
                        <CardTitle>{service.serviceName}</CardTitle>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {service.rating.toFixed(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Rating</span>
                          <span className="font-medium">
                            {service.rating.toFixed(1)}/5.0
                          </span>
                        </div>
                        <Progress value={service.rating * 20} className="h-2" />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {service.feedbackCount} feedbacks
                          </span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600 mr-1">
                            Trend:
                          </span>
                          <div className="flex items-center">
                            {getTrendIcon(service.trend)}
                            <span
                              className={`text-sm ${
                                service.trend === "up"
                                  ? "text-green-600"
                                  : service.trend === "down"
                                  ? "text-red-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {service.trend === "stable"
                                ? "Stable"
                                : `${service.trendValue}%`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFeedback.map((feedback) => (
                    <div key={feedback.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {getSentimentIcon(feedback.sentiment)}
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(feedback.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(feedback.status)}
                        </div>
                      </div>
                      <p className="text-gray-800 mb-2">{feedback.content}</p>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-500">Service: </span>
                          <Badge variant="outline" className="ml-2">
                            {feedback.serviceId.charAt(0).toUpperCase() +
                              feedback.serviceId.slice(1)}
                          </Badge>
                        </div>
                        {feedback.responseTime && (
                          <div className="flex items-center text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Response: {feedback.responseTime} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                  Branch Performance Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Overall Rating</h3>
                    <div className="space-y-3">
                      {branchComparison.map((branch) => (
                        <div
                          key={branch.branchId}
                          className="flex items-center"
                        >
                          <div className="w-24 md:w-32 text-sm">
                            {branch.branchName}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-3 w-3 ${
                                      star <= Math.round(branch.overallRating)
                                        ? "text-yellow-500 fill-yellow-500"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>{branch.overallRating.toFixed(1)}</span>
                            </div>
                            <Progress
                              value={branch.overallRating * 20}
                              className={`h-2 ${
                                branch.branchId === selectedBranch?.id
                                  ? "bg-purple-100"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">
                      Response Time (minutes)
                    </h3>
                    <div className="space-y-3">
                      {branchComparison.map((branch) => (
                        <div
                          key={branch.branchId}
                          className="flex items-center"
                        >
                          <div className="w-24 md:w-32 text-sm">
                            {branch.branchName}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Average</span>
                              <span>{branch.responseTime} min</span>
                            </div>
                            <Progress
                              value={100 - (branch.responseTime / 60) * 100}
                              className={`h-2 ${
                                branch.branchId === selectedBranch?.id
                                  ? "bg-purple-100"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Resolution Rate (%)</h3>
                    <div className="space-y-3">
                      {branchComparison.map((branch) => (
                        <div
                          key={branch.branchId}
                          className="flex items-center"
                        >
                          <div className="w-24 md:w-32 text-sm">
                            {branch.branchName}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Resolved</span>
                              <span>{branch.resolutionRate}%</span>
                            </div>
                            <Progress
                              value={branch.resolutionRate}
                              className={`h-2 ${
                                branch.branchId === selectedBranch?.id
                                  ? "bg-purple-100"
                                  : ""
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
