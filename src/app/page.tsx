import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, BarChart3, MessageSquare, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-purple-700 to-violet-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:mr-8 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Smart Feedback Hub
              </h1>
              <p className="text-xl md:text-2xl mb-6 max-w-2xl">
                Real-time guest feedback collection and response system powered
                by AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-purple-900 hover:bg-gray-100"
                >
                  <Link href="/demo">See Demo</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 max-w-md">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">AI-Powered Feedback</h3>
                      <p className="text-sm text-purple-100">
                        Intelligent collection and analysis
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Real-Time Responses</h3>
                      <p className="text-sm text-purple-100">
                        Instant issue resolution
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-purple-500/20 p-3 rounded-full mr-4">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">Actionable Insights</h3>
                      <p className="text-sm text-purple-100">
                        Data-driven operational improvements
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Smart Collection</CardTitle>
                <CardDescription>
                  Multiple touchpoints for gathering guest feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    AI chatbots for conversational feedback
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    Digital kiosks at strategic locations
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    QR code-based mobile surveys
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Intelligent Analysis</CardTitle>
                <CardDescription>
                  Real-time processing of guest sentiments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    Sentiment analysis with priority scoring
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    Issue categorization and routing
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    Trend identification and pattern recognition
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-purple-700" />
                </div>
                <CardTitle>Automated Response</CardTitle>
                <CardDescription>
                  Swift action on feedback for better guest experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    Smart escalation to appropriate staff
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    Automated follow-up and resolution tracking
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="h-4 w-4 text-purple-700 mr-2" />
                    Staff training recommendations
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <MessageSquare className="h-5 w-5 text-purple-700" />
                  </div>
                  AI-Powered Feedback Collection
                </h3>
                <p className="text-gray-600 mb-4">
                  Our intelligent chatbots engage guests in natural
                  conversations to gather detailed feedback without feeling like
                  a survey. Digital kiosks placed at strategic locations offer
                  quick pulse checks on the guest experience.
                </p>
                <Button variant="link" className="text-purple-700 p-0">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <BarChart3 className="h-5 w-5 text-purple-700" />
                  </div>
                  Real-Time Sentiment Analysis
                </h3>
                <p className="text-gray-600 mb-4">
                  Advanced NLP algorithms analyze feedback in real-time,
                  categorizing issues by urgency and sentiment. The system
                  identifies patterns across feedback channels to spot recurring
                  issues before they become trends.
                </p>
                <Button variant="link" className="text-purple-700 p-0">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Zap className="h-5 w-5 text-purple-700" />
                  </div>
                  Smart Escalation System
                </h3>
                <p className="text-gray-600 mb-4">
                  Urgent issues are automatically routed to the appropriate
                  staff member based on issue type and severity. The system
                  tracks response times and resolution rates, ensuring no
                  feedback falls through the cracks.
                </p>
                <Button variant="link" className="text-purple-700 p-0">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Users className="h-5 w-5 text-purple-700" />
                  </div>
                  Staff Training Integration
                </h3>
                <p className="text-gray-600 mb-4">
                  Feedback insights are automatically converted into
                  personalized training recommendations for staff. Performance
                  metrics track improvement over time, creating a continuous
                  feedback loop for operational excellence.
                </p>
                <Button variant="link" className="text-purple-700 p-0">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-xl font-bold mb-4">Smart Feedback Hub</h3>
              <p className="text-gray-400 max-w-md">
                Revolutionizing how businesses collect and respond to customer
                feedback with AI-powered solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Us</h4>
              <p className="text-gray-400">info@smartfeedbackhub.com</p>
              <p className="text-gray-400">+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
            <p>
              © {new Date().getFullYear()} Smart Feedback Hub. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
