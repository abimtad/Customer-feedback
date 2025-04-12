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
import {
  MessageSquare,
  QrCode,
  Smartphone,
  Tablet,
  Mail,
  Phone,
  Copy,
  Check,
  Share2,
} from "lucide-react";
import { BranchSelector, type Branch } from "@/components/branch-selector";
import { ServiceSelector, type Service } from "@/components/service-selector";

export function FeedbackChannels() {
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState("qr");
  const [copied, setCopied] = useState(false);

  const handleBranchChange = (branch: Branch) => {
    setSelectedBranch(branch);
    setSelectedService(null);
  };

  const handleServiceChange = (service: Service | null) => {
    setSelectedService(service);
  };

  const handleCopyLink = () => {
    const feedbackUrl = `https://feedback.kuriftu.com/${
      selectedBranch?.id || "main"
    }${selectedService ? `/${selectedService.id}` : ""}`;
    navigator.clipboard.writeText(feedbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFeedbackUrl = () => {
    return `https://feedback.kuriftu.com/${selectedBranch?.id || "main"}${
      selectedService ? `/${selectedService.id}` : ""
    }`;
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

      <Card>
        <CardHeader>
          <CardTitle>Feedback Collection Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qr" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="qr">QR Codes</TabsTrigger>
              <TabsTrigger value="kiosk">Digital Kiosks</TabsTrigger>
              <TabsTrigger value="mobile">Mobile App</TabsTrigger>
              <TabsTrigger value="other">Other Channels</TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">
                    QR Code for Guest Feedback
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Place these QR codes in strategic locations to collect
                    feedback from guests. Customize the QR code for specific
                    branches and services.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Feedback URL
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={getFeedbackUrl()}
                          readOnly
                          className="flex-1 p-2 border rounded-l-md text-sm bg-gray-50"
                        />
                        <Button
                          variant="outline"
                          className="rounded-l-none"
                          onClick={handleCopyLink}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Link
                      </Button>
                      <Button variant="outline" size="sm">
                        Download QR
                      </Button>
                      <Button variant="outline" size="sm">
                        Print QR Codes
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 border border-dashed">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {selectedBranch ? selectedBranch.name : "All Branches"}
                    {selectedService ? ` • ${selectedService.name}` : ""}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kiosk" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Digital Kiosk Setup</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Configure digital kiosks placed at strategic locations
                    throughout your property. These kiosks provide a quick and
                    easy way for guests to leave feedback.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Kiosk Mode URL
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={`${getFeedbackUrl()}/kiosk`}
                          readOnly
                          className="flex-1 p-2 border rounded-l-md text-sm bg-gray-50"
                        />
                        <Button
                          variant="outline"
                          className="rounded-l-none"
                          onClick={handleCopyLink}
                        >
                          {copied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Recommended Kiosk Locations:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                        <li>Lobby / Reception area</li>
                        <li>Restaurant exit</li>
                        <li>Spa reception</li>
                        <li>Conference/Event spaces</li>
                        <li>Near elevators on accommodation floors</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 border border-dashed">
                  <Tablet className="h-32 w-32 text-gray-400 mb-4" />
                  <p className="text-center text-sm text-gray-600 mb-2">
                    Kiosk Mode Preview
                  </p>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Launch Kiosk Demo
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mobile" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Mobile App Integration</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Integrate feedback collection into the Kuriftu Resort mobile
                    app. Guests can provide feedback directly through the app
                    during or after their stay.
                  </p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Key Features:</h4>
                      <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                        <li>In-app notifications to request feedback</li>
                        <li>Offline feedback collection (syncs when online)</li>
                        <li>Photo and video attachment capability</li>
                        <li>Location-aware prompts based on guest movement</li>
                        <li>Feedback history and response tracking</li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">
                        Integration Options:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          API Documentation
                        </Button>
                        <Button variant="outline" size="sm">
                          SDK Download
                        </Button>
                        <Button variant="outline" size="sm">
                          Developer Guide
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6 border border-dashed">
                  <Smartphone className="h-32 w-32 text-gray-400 mb-4" />
                  <p className="text-center text-sm text-gray-600 mb-2">
                    Mobile App Integration
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      iOS Demo
                    </Button>
                    <Button size="sm" variant="outline">
                      Android Demo
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="other" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                      AI Chatbot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Conversational AI chatbot that can be embedded on your
                      website or deployed via WhatsApp and Telegram.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5 mb-4">
                      <li>Natural conversation flow</li>
                      <li>Multi-language support</li>
                      <li>24/7 availability</li>
                      <li>Seamless handoff to staff</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure Chatbot
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-purple-600" />
                      Email Surveys
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Automated post-stay email surveys sent to guests after
                      checkout to collect comprehensive feedback.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5 mb-4">
                      <li>Customizable templates</li>
                      <li>Scheduled sending</li>
                      <li>Smart follow-ups</li>
                      <li>Response analytics</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Email Surveys
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-purple-600" />
                      SMS Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      SMS-based feedback collection with quick rating options
                      and follow-up questions via text message.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5 mb-4">
                      <li>High response rates</li>
                      <li>Simple user experience</li>
                      <li>Works on any phone</li>
                      <li>Automated workflows</li>
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Setup SMS Campaigns
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
