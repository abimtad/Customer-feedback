"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Calendar,
  BarChart2,
  PieChart,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function WeeklyReportGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [reportPeriod, setReportPeriod] = useState("this-week");

  const generateReport = () => {
    setIsGenerating(true);

    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2500);
  };

  const resetGenerator = () => {
    setReportGenerated(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Weekly Feedback Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!reportGenerated ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Report Contents</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <BarChart2 className="h-4 w-4 mr-2 text-purple-600" />
                  Feedback volume and trends
                </li>
                <li className="flex items-center text-sm">
                  <PieChart className="h-4 w-4 mr-2 text-purple-600" />
                  Sentiment distribution analysis
                </li>
                <li className="flex items-center text-sm">
                  <ThumbsUp className="h-4 w-4 mr-2 text-purple-600" />
                  Top positive feedback categories
                </li>
                <li className="flex items-center text-sm">
                  <ThumbsDown className="h-4 w-4 mr-2 text-purple-600" />
                  Key issues requiring attention
                </li>
                <li className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  Day-by-day performance metrics
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Report Period
                </label>
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-two-weeks">
                      Last Two Weeks
                    </SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Report Format
                </label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-28 bg-red-100 flex items-center justify-center rounded-lg mb-4 relative">
              <FileText className="h-10 w-10 text-red-500" />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                <CheckCircle className="h-4 w-4" />
              </div>
            </div>
            <h3 className="font-medium text-lg mb-1">Report Generated!</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your weekly feedback report is ready to download
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {!reportGenerated ? (
          <Button
            onClick={generateReport}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>Generate Report</>
            )}
          </Button>
        ) : (
          <Button variant="outline" onClick={resetGenerator}>
            Generate Another Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
