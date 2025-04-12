"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Bell,
  Clock,
  CheckCircle2,
  X,
  MessageSquare,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BranchSelector, type Branch } from "@/components/branch-selector";

type EscalationRule = {
  id: string;
  name: string;
  conditions: {
    severity: string[];
    services: string[];
    keywords: string[];
  };
  actions: {
    notifyRoles: string[];
    responseTime: number;
    autoReply: boolean;
  };
  status: "active" | "inactive";
};

type EscalationAlert = {
  id: string;
  branchId: string;
  branchName: string;
  serviceId: string;
  serviceName: string;
  content: string;
  severity: "critical" | "high" | "medium" | "low";
  timestamp: string;
  status: "new" | "assigned" | "resolved";
  assignedTo?: string;
  responseTime?: number;
};

const mockEscalationRules: EscalationRule[] = [
  {
    id: "rule1",
    name: "Critical Safety Issues",
    conditions: {
      severity: ["critical"],
      services: ["all"],
      keywords: [
        "emergency",
        "safety",
        "danger",
        "accident",
        "injury",
        "fire",
        "security",
      ],
    },
    actions: {
      notifyRoles: ["manager", "security", "maintenance"],
      responseTime: 15,
      autoReply: true,
    },
    status: "active",
  },
  {
    id: "rule2",
    name: "Room Maintenance Issues",
    conditions: {
      severity: ["high", "medium"],
      services: ["accommodation"],
      keywords: [
        "broken",
        "not working",
        "leak",
        "air conditioning",
        "heating",
        "toilet",
        "shower",
      ],
    },
    actions: {
      notifyRoles: ["maintenance", "housekeeping"],
      responseTime: 30,
      autoReply: true,
    },
    status: "active",
  },
  {
    id: "rule3",
    name: "Dining Complaints",
    conditions: {
      severity: ["high"],
      services: ["dining"],
      keywords: [
        "food",
        "service",
        "wait",
        "order",
        "restaurant",
        "meal",
        "drink",
      ],
    },
    actions: {
      notifyRoles: ["restaurant_manager", "chef"],
      responseTime: 20,
      autoReply: true,
    },
    status: "active",
  },
  {
    id: "rule4",
    name: "Spa Service Issues",
    conditions: {
      severity: ["high", "medium"],
      services: ["spa"],
      keywords: ["massage", "treatment", "therapist", "appointment", "spa"],
    },
    actions: {
      notifyRoles: ["spa_manager", "guest_relations"],
      responseTime: 30,
      autoReply: true,
    },
    status: "active",
  },
  {
    id: "rule5",
    name: "VIP Guest Feedback",
    conditions: {
      severity: ["high", "medium", "low"],
      services: ["all"],
      keywords: ["vip", "loyalty", "member", "platinum", "gold"],
    },
    actions: {
      notifyRoles: ["manager", "guest_relations"],
      responseTime: 20,
      autoReply: false,
    },
    status: "active",
  },
];

const mockEscalationAlerts: EscalationAlert[] = [
  {
    id: "alert1",
    branchId: "bishoftu",
    branchName: "Kuriftu Bishoftu",
    serviceId: "accommodation",
    serviceName: "Accommodation",
    content:
      "There's a water leak in the bathroom ceiling of room 405! Water is dripping onto the floor creating a hazard.",
    severity: "critical",
    timestamp: "2023-06-15T14:32:00Z",
    status: "new",
  },
  {
    id: "alert2",
    branchId: "entoto",
    branchName: "Kuriftu Entoto",
    serviceId: "dining",
    serviceName: "Dining",
    content:
      "Waited over 45 minutes for our food and still haven't received it. Several tables that came after us have been served already.",
    severity: "high",
    timestamp: "2023-06-15T19:15:00Z",
    status: "assigned",
    assignedTo: "Restaurant Manager",
  },
  {
    id: "alert3",
    branchId: "bishoftu",
    branchName: "Kuriftu Bishoftu",
    serviceId: "spa",
    serviceName: "Spa & Wellness",
    content:
      "My scheduled massage therapist didn't show up for my appointment and I've been waiting for 20 minutes.",
    severity: "high",
    timestamp: "2023-06-15T16:45:00Z",
    status: "assigned",
    assignedTo: "Spa Manager",
  },
  {
    id: "alert4",
    branchId: "langano",
    branchName: "Kuriftu Langano",
    serviceId: "waterpark",
    serviceName: "Waterpark",
    content:
      "One of the lifeguards is not paying attention to the deep end of the pool. There are children swimming unsupervised.",
    severity: "critical",
    timestamp: "2023-06-15T13:20:00Z",
    status: "resolved",
    assignedTo: "Waterpark Manager",
    responseTime: 8,
  },
  {
    id: "alert5",
    branchId: "bahirdar",
    branchName: "Kuriftu Bahir Dar",
    serviceId: "accommodation",
    serviceName: "Accommodation",
    content:
      "The air conditioning in my room (302) is not working properly. It's very hot and uncomfortable.",
    severity: "medium",
    timestamp: "2023-06-15T20:10:00Z",
    status: "new",
  },
];

export function EscalationSystem() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [activeTab, setActiveTab] = useState("alerts");
  const [escalationRules, setEscalationRules] =
    useState<EscalationRule[]>(mockEscalationRules);
  const [escalationAlerts, setEscalationAlerts] =
    useState<EscalationAlert[]>(mockEscalationAlerts);

  const handleBranchChange = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  const toggleRuleStatus = (ruleId: string) => {
    setEscalationRules((rules) =>
      rules.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              status: rule.status === "active" ? "inactive" : "active",
            }
          : rule
      )
    );
  };

  const updateAlertStatus = (
    alertId: string,
    newStatus: "new" | "assigned" | "resolved"
  ) => {
    setEscalationAlerts((alerts) =>
      alerts.map((alert) =>
        alert.id === alertId
          ? {
              ...alert,
              status: newStatus,
              assignedTo:
                newStatus === "assigned" ? "Current User" : alert.assignedTo,
              responseTime: newStatus === "resolved" ? 15 : alert.responseTime,
            }
          : alert
      )
    );
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Critical
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-orange-300">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            Low
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
          <Badge className="bg-blue-100 text-blue-800 border-blue-300">
            New
          </Badge>
        );
      case "assigned":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Assigned
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter alerts based on selected branch
  const filteredAlerts = selectedBranch
    ? escalationAlerts.filter((alert) => alert.branchId === selectedBranch.id)
    : escalationAlerts;

  return (
    <div className="space-y-6">
      <div className="w-full md:w-1/2">
        <BranchSelector onBranchChange={handleBranchChange} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-purple-600" />
            Escalation System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="alerts" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
              <TabsTrigger value="rules">Escalation Rules</TabsTrigger>
              <TabsTrigger value="settings">Notification Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="mt-0">
              <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                    <Bell className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-600 mb-1">
                      No Active Alerts
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedBranch
                        ? `There are no active alerts for ${selectedBranch.name} at this time.`
                        : "Select a branch to view its alerts or view all branches."}
                    </p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <AlertTriangle
                            className={`h-5 w-5 mr-2 ${
                              alert.severity === "critical"
                                ? "text-red-600"
                                : alert.severity === "high"
                                ? "text-orange-600"
                                : alert.severity === "medium"
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          />
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">
                                {alert.branchName}
                              </span>
                              <span className="mx-2">•</span>
                              <span>{alert.serviceName}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(alert.timestamp)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getSeverityBadge(alert.severity)}
                          {getStatusBadge(alert.status)}
                        </div>
                      </div>
                      <p className="text-gray-800 mb-3">{alert.content}</p>

                      {alert.status === "assigned" && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <User className="h-4 w-4 mr-1" />
                          <span>Assigned to: {alert.assignedTo}</span>
                        </div>
                      )}

                      {alert.status === "resolved" && alert.responseTime && (
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            Response time: {alert.responseTime} minutes
                          </span>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        {alert.status === "new" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateAlertStatus(alert.id, "assigned")
                            }
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Assign to Me
                          </Button>
                        )}

                        {alert.status === "assigned" && (
                          <Button
                            size="sm"
                            onClick={() =>
                              updateAlertStatus(alert.id, "resolved")
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Mark Resolved
                          </Button>
                        )}

                        {alert.status === "resolved" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateAlertStatus(alert.id, "new")}
                          >
                            Reopen
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="rules" className="mt-0">
              <div className="space-y-4">
                {escalationRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <Switch
                          checked={rule.status === "active"}
                          onCheckedChange={() => toggleRuleStatus(rule.id)}
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Conditions
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-500">
                                Severity Levels
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rule.conditions.severity.map((severity) => (
                                  <Badge
                                    key={severity}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {severity.charAt(0).toUpperCase() +
                                      severity.slice(1)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs text-gray-500">
                                Services
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rule.conditions.services.map((service) => (
                                  <Badge
                                    key={service}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {service === "all"
                                      ? "All Services"
                                      : service.charAt(0).toUpperCase() +
                                        service.slice(1)}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs text-gray-500">
                                Keywords
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rule.conditions.keywords
                                  .slice(0, 5)
                                  .map((keyword) => (
                                    <Badge
                                      key={keyword}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {keyword}
                                    </Badge>
                                  ))}
                                {rule.conditions.keywords.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{rule.conditions.keywords.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Actions</h4>
                          <div className="space-y-3">
                            <div>
                              <Label className="text-xs text-gray-500">
                                Notify Roles
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {rule.actions.notifyRoles.map((role) => (
                                  <Badge
                                    key={role}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {role
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs text-gray-500">
                                Response Time Target
                              </Label>
                              <div className="flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1 text-gray-500" />
                                <span className="text-sm">
                                  {rule.actions.responseTime} minutes
                                </span>
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs text-gray-500">
                                Auto Reply
                              </Label>
                              <div className="flex items-center mt-1">
                                {rule.actions.autoReply ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                ) : (
                                  <X className="h-3 w-3 mr-1 text-red-500" />
                                )}
                                <span className="text-sm">
                                  {rule.actions.autoReply
                                    ? "Enabled"
                                    : "Disabled"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Edit Rule
                      </Button>
                    </CardFooter>
                  </Card>
                ))}

                <div className="flex justify-center">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Create New Rule
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="h-5 w-5 mr-3 text-purple-600" />
                        <div>
                          <h4 className="font-medium">In-App Notifications</h4>
                          <p className="text-sm text-gray-500">
                            Receive alerts in the dashboard
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-3 text-purple-600" />
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-gray-500">
                            Receive alerts via email
                          </p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-3 text-purple-600" />
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-sm text-gray-500">
                            Receive alerts via SMS
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Minimum Severity Level</Label>
                      <Select defaultValue="high">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="critical">
                            Critical Only
                          </SelectItem>
                          <SelectItem value="high">High and Above</SelectItem>
                          <SelectItem value="medium">
                            Medium and Above
                          </SelectItem>
                          <SelectItem value="all">All Severities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Working Hours</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <Select defaultValue="9">
                          <SelectTrigger>
                            <SelectValue placeholder="Start time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i === 0
                                  ? "12 AM"
                                  : i < 12
                                  ? `${i} AM`
                                  : i === 12
                                  ? "12 PM"
                                  : `${i - 12} PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select defaultValue="17">
                          <SelectTrigger>
                            <SelectValue placeholder="End time" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }).map((_, i) => (
                              <SelectItem key={i} value={i.toString()}>
                                {i === 0
                                  ? "12 AM"
                                  : i < 12
                                  ? `${i} AM`
                                  : i === 12
                                  ? "12 PM"
                                  : `${i - 12} PM`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">
                          After Hours Notifications
                        </h4>
                        <p className="text-sm text-gray-500">
                          Receive critical alerts outside working hours
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
