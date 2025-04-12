"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  User,
  Bot,
  ImageIcon,
  Mic,
  MicOff,
  Video,
  X,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Globe,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MessageMedia = {
  type: "image" | "audio" | "video";
  url: string;
  thumbnail?: string;
};

type Rating = {
  aspect: string;
  score: number;
  timestamp: Date;
};

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  media?: MessageMedia;
  language?: string;
  severity?: "critical" | "high" | "medium" | "low" | "positive";
  ratings?: Rating[];
};

type ConversationContext = {
  stage:
    | "greeting"
    | "initial_feedback"
    | "follow_up"
    | "specific_details"
    | "closing";
  sentiment?: "positive" | "negative" | "neutral";
  topics: string[];
  lastMentioned?: string;
  feedbackDetails: Record<string, string>;
  overallSeverity?: "critical" | "high" | "medium" | "low" | "positive";
  usedServices: string[];
  ratedServices: string[];
  shouldPromptRating: boolean;
};

const initialMessages: Message[] = [
  {
    id: "1",
    content:
      "Hello! I'd love to hear about your experience with us today. You can type your feedback, or use the buttons below to share images, voice recordings, or videos. What aspects of your visit would you like to share feedback about?",
    sender: "bot",
    timestamp: new Date(),
  },
];

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
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

export function ChatbotFeedback() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [mediaPreview, setMediaPreview] = useState<{
    file: File | null;
    type: string;
    preview: string | null;
  }>({
    file: null,
    type: "",
    preview: null,
  });
  const [showRatingPrompt, setShowRatingPrompt] = useState(false);
  const [currentRatingService, setCurrentRatingService] = useState<
    string | null
  >(null);
  const [currentRating, setCurrentRating] = useState<number | null>(null);
  const [conversationContext, setConversationContext] =
    useState<ConversationContext>({
      stage: "greeting",
      topics: [],
      feedbackDetails: {},
      usedServices: [],
      ratedServices: [],
      shouldPromptRating: false,
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showRatingPrompt]);

  // Check if we should prompt for ratings
  useEffect(() => {
    if (
      conversationContext.shouldPromptRating &&
      conversationContext.usedServices.length > 0 &&
      !showRatingPrompt &&
      !isTyping
    ) {
      // Find a service that hasn't been rated yet
      const unratedService = conversationContext.usedServices.find(
        (service) => !conversationContext.ratedServices.includes(service)
      );

      if (unratedService) {
        setCurrentRatingService(unratedService);
        setShowRatingPrompt(true);
      }
    }
  }, [conversationContext, showRatingPrompt, isTyping]);

  // Clean up recording resources when component unmounts
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview({
        file,
        type: "image",
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview({
        file,
        type: "video",
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        const audioUrl = URL.createObjectURL(audioBlob);

        setMediaPreview({
          file: new File([audioBlob], "voice-feedback.wav", {
            type: "audio/wav",
          }),
          type: "audio",
          preview: audioUrl,
        });

        // Release the microphone
        stream.getTracks().forEach((track) => track.stop());

        // Reset recording state
        setIsRecording(false);
        setRecordingTime(0);
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current);
          recordingTimerRef.current = null;
        }
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert(
        "Could not access your microphone. Please check your browser permissions."
      );
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
  };

  const clearMediaPreview = () => {
    if (mediaPreview.preview) {
      URL.revokeObjectURL(mediaPreview.preview);
    }
    setMediaPreview({ file: null, type: "", preview: null });

    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleRatingSubmit = () => {
    if (!currentRatingService || currentRating === null) return;

    // Find the service label
    const serviceLabel =
      serviceCategories.find((s) => s.id === currentRatingService)?.label ||
      currentRatingService;

    // Create a rating message
    const ratingMessage: Message = {
      id: Date.now().toString(),
      content: `I rate ${serviceLabel} as ${currentRating} out of 5 stars.`,
      sender: "user",
      timestamp: new Date(),
      ratings: [
        {
          aspect: currentRatingService,
          score: currentRating,
          timestamp: new Date(),
        },
      ],
    };

    setMessages((prev) => [...prev, ratingMessage]);

    // Update conversation context
    setConversationContext((prev) => ({
      ...prev,
      ratedServices: [...prev.ratedServices, currentRatingService],
    }));

    // Reset rating state
    setShowRatingPrompt(false);
    setCurrentRating(null);

    // Generate a response to the rating
    handleRatingResponse(currentRatingService, currentRating);
  };

  const handleRatingResponse = async (service: string, rating: number) => {
    setIsTyping(true);

    try {
      // Find the service label
      const serviceLabel =
        serviceCategories.find((s) => s.id === service)?.label || service;

      // Generate response based on rating
      let response = "";
      if (rating >= 4) {
        response = `Thank you for your positive rating of our ${serviceLabel.toLowerCase()}! We're delighted that you enjoyed this aspect of your stay. Is there anything specific about our ${serviceLabel.toLowerCase()} that you particularly appreciated?`;
      } else if (rating === 3) {
        response = `Thank you for rating our ${serviceLabel.toLowerCase()}. We appreciate your feedback and would love to know what we could improve to make your experience with our ${serviceLabel.toLowerCase()} even better next time.`;
      } else {
        response = `We appreciate your honest feedback about our ${serviceLabel.toLowerCase()}. We're sorry it didn't meet your expectations. Could you share more details about what specifically disappointed you so we can address these issues?`;
      }

      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Check if there are more services to rate
      const nextUnratedService = conversationContext.usedServices.find(
        (s) => !conversationContext.ratedServices.includes(s) && s !== service
      );

      if (nextUnratedService) {
        // Wait a moment before showing the next rating prompt
        setTimeout(() => {
          setCurrentRatingService(nextUnratedService);
          setShowRatingPrompt(true);
        }, 1000);
      }
    } catch (error) {
      console.error("Error generating rating response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const skipRating = () => {
    if (!currentRatingService) return;

    // Update conversation context to mark this service as rated (skipped)
    setConversationContext((prev) => ({
      ...prev,
      ratedServices: [...prev.ratedServices, currentRatingService],
    }));

    // Reset rating state
    setShowRatingPrompt(false);
    setCurrentRating(null);

    // Check if there are more services to rate
    const nextUnratedService = conversationContext.usedServices.find(
      (s) =>
        !conversationContext.ratedServices.includes(s) &&
        s !== currentRatingService
    );

    if (nextUnratedService) {
      // Show the next rating prompt
      setTimeout(() => {
        setCurrentRatingService(nextUnratedService);
        setShowRatingPrompt(true);
      }, 500);
    }
  };

  async function handleSendMessage() {
    if (!input.trim() && !mediaPreview.file) return;

    // Create user message content
    let userContent = input.trim();
    let userMedia: MessageMedia | undefined = undefined;

    // Process media if present
    if (mediaPreview.file) {
      // In a real app, you would upload the file to a storage service
      // and get back a URL. For this demo, we'll use the object URL.
      const mediaUrl = mediaPreview.preview || "";

      userMedia = {
        type: mediaPreview.type as "image" | "audio" | "video",
        url: mediaUrl,
      };

      // Add description of the media to the message content
      if (!userContent) {
        userContent = `[Shared a ${mediaPreview.type}]`;
      }
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userContent,
      sender: "user",
      timestamp: new Date(),
      media: userMedia,
      language: selectedLanguage !== "en" ? selectedLanguage : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    clearMediaPreview();
    setIsTyping(true);

    // Analyze the user input to update conversation context
    updateConversationContext(userContent, "", userMedia?.type);

    try {
      // Generate AI response based on the updated context and user input
      const { response, severity } = await generateResponse(
        userContent,
        userMedia?.type
      );

      // Add severity to the user's message retrospectively
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMessage.id ? { ...msg, severity } : msg
        )
      );

      // Add bot message
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // After a few messages, start prompting for ratings if we've detected used services
      if (messages.length > 3 && conversationContext.usedServices.length > 0) {
        setConversationContext((prev) => ({
          ...prev,
          shouldPromptRating: true,
        }));
      }
    } catch (error) {
      console.error("Error generating response:", error);

      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble processing your feedback right now. Could you please try again?",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  const updateConversationContext = (
    userInput: string,
    botResponse: string,
    mediaType?: string
  ) => {
    // Simple sentiment analysis
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "amazing",
      "love",
      "enjoyed",
      "perfect",
      "wonderful",
    ];
    const negativeWords = [
      "bad",
      "poor",
      "terrible",
      "awful",
      "disappointed",
      "issue",
      "problem",
      "unhappy",
      "dirty",
    ];
    const criticalWords = [
      "emergency",
      "dangerous",
      "unsafe",
      "urgent",
      "immediately",
      "hazard",
      "broken",
      "leaking",
    ];

    const lowerInput = userInput.toLowerCase();

    // Check for sentiment
    let sentiment = conversationContext.sentiment;
    if (!sentiment) {
      const hasPositive = positiveWords.some((word) =>
        lowerInput.includes(word)
      );
      const hasNegative = negativeWords.some((word) =>
        lowerInput.includes(word)
      );
      const hasCritical = criticalWords.some((word) =>
        lowerInput.includes(word)
      );

      if (hasCritical) sentiment = "negative";
      else if (hasPositive && !hasNegative) sentiment = "positive";
      else if (hasNegative && !hasPositive) sentiment = "negative";
      else if (hasPositive && hasNegative) sentiment = "neutral";
    }

    // Identify topics and used services
    const topicKeywords = {
      room: [
        "room",
        "bed",
        "sleep",
        "accommodation",
        "suite",
        "pillow",
        "mattress",
      ],
      service: [
        "service",
        "staff",
        "employee",
        "waiter",
        "receptionist",
        "concierge",
        "attendant",
      ],
      food: [
        "food",
        "meal",
        "breakfast",
        "lunch",
        "dinner",
        "restaurant",
        "dish",
        "menu",
        "taste",
      ],
      cleanliness: [
        "clean",
        "dirty",
        "hygiene",
        "dust",
        "stain",
        "spotless",
        "tidy",
      ],
      amenities: ["amenity", "facility", "pool", "gym", "spa"],
      wifi: ["wifi", "internet", "connection", "online"],
      value: ["price", "cost", "expensive", "cheap", "value", "worth", "money"],
      location: ["location", "area", "neighborhood", "distance", "nearby"],
      safety: [
        "safe",
        "unsafe",
        "security",
        "emergency",
        "danger",
        "accident",
        "injury",
      ],
    };

    const newTopics = conversationContext.topics.slice();
    const usedServices = [...conversationContext.usedServices];

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (
        !newTopics.includes(topic) &&
        keywords.some((keyword) => lowerInput.includes(keyword))
      ) {
        newTopics.push(topic);

        // If this is a service category that can be rated and not already in usedServices
        if (
          serviceCategories.some((s) => s.id === topic) &&
          !usedServices.includes(topic)
        ) {
          usedServices.push(topic);
        }
      }
    });

    // Media might indicate certain topics
    if (mediaType === "image" || mediaType === "video") {
      // Images/videos often show physical issues
      if (!newTopics.includes("cleanliness")) {
        newTopics.push("cleanliness");
        if (!usedServices.includes("cleanliness")) {
          usedServices.push("cleanliness");
        }
      }
    }

    // Determine conversation stage
    let stage = conversationContext.stage;

    if (stage === "greeting") {
      stage = "initial_feedback";
    } else if (stage === "initial_feedback" && newTopics.length > 0) {
      stage = "follow_up";
    } else if (stage === "follow_up" && messages.length > 5) {
      stage = "specific_details";
    } else if (stage === "specific_details" && messages.length > 8) {
      stage = "closing";
    }

    // Determine overall severity based on content and media
    let overallSeverity = conversationContext.overallSeverity;

    if (criticalWords.some((word) => lowerInput.includes(word))) {
      overallSeverity = "critical";
    } else if (mediaType && sentiment === "negative") {
      // Media with negative sentiment often indicates higher severity
      overallSeverity = "high";
    } else if (
      sentiment === "negative" &&
      (newTopics.includes("safety") || newTopics.includes("cleanliness"))
    ) {
      overallSeverity = "high";
    } else if (sentiment === "negative") {
      overallSeverity = "medium";
    } else if (sentiment === "positive") {
      overallSeverity = "positive";
    } else {
      overallSeverity = "low";
    }

    // Update the conversation context
    setConversationContext({
      stage,
      sentiment,
      topics: newTopics,
      lastMentioned: newTopics[newTopics.length - 1],
      overallSeverity,
      usedServices,
      ratedServices: conversationContext.ratedServices,
      shouldPromptRating: conversationContext.shouldPromptRating,
      feedbackDetails: {
        ...conversationContext.feedbackDetails,
        // Store specific details about topics
        ...(newTopics.length > 0 && {
          [newTopics[newTopics.length - 1]]: userInput,
        }),
      },
    });
  };

  const generateResponse = async (
    userInput: string,
    mediaType?: string
  ): Promise<{
    response: string;
    severity: "critical" | "high" | "medium" | "low" | "positive";
  }> => {
    const lowerInput = userInput.toLowerCase();

    // Determine severity based on content and context
    let severity: "critical" | "high" | "medium" | "low" | "positive" = "low";

    const criticalWords = [
      "emergency",
      "dangerous",
      "unsafe",
      "urgent",
      "immediately",
      "hazard",
      "broken",
      "leaking",
    ];
    const highSeverityWords = [
      "very bad",
      "terrible",
      "awful",
      "disgusting",
      "unacceptable",
      "furious",
      "angry",
    ];
    const mediumSeverityWords = [
      "disappointed",
      "unhappy",
      "issue",
      "problem",
      "not good",
      "poor",
    ];
    const positiveWords = [
      "excellent",
      "amazing",
      "outstanding",
      "perfect",
      "wonderful",
      "fantastic",
    ];

    if (criticalWords.some((word) => lowerInput.includes(word))) {
      severity = "critical";
    } else if (highSeverityWords.some((word) => lowerInput.includes(word))) {
      severity = "high";
    } else if (mediumSeverityWords.some((word) => lowerInput.includes(word))) {
      severity = "medium";
    } else if (positiveWords.some((word) => lowerInput.includes(word))) {
      severity = "positive";
    }

    // Media might indicate higher severity for negative feedback
    if (mediaType && severity !== "positive" && severity !== "critical") {
      severity = "high"; // Upgrade severity if media is attached to negative feedback
    }

    // Get current conversation state
    const { stage, topics, sentiment } = conversationContext;

    // Handle multilingual input
    let responsePrefix = "";
    if (selectedLanguage !== "en") {
      const languageName =
        languages.find((l) => l.code === selectedLanguage)?.name ||
        "non-English";
      responsePrefix = `I notice you're writing in ${languageName}. I'll do my best to understand. `;
    }

    // Media-specific responses
    if (mediaType === "image") {
      return {
        response: `${responsePrefix}Thank you for sharing that image. This visual helps us understand your feedback better. Could you please tell me more about what this image shows and why it's important to your experience?`,
        severity,
      };
    } else if (mediaType === "audio") {
      return {
        response: `${responsePrefix}Thank you for your voice feedback. It's helpful to hear your tone and explanation directly. Is there anything specific about what you mentioned in your recording that you'd like me to focus on?`,
        severity,
      };
    } else if (mediaType === "video") {
      return {
        response: `${responsePrefix}Thank you for sharing this video. Visual evidence like this is extremely valuable for us to understand your experience. Could you highlight the key aspects you wanted to show in this video?`,
        severity,
      };
    }

    // Severity-specific responses
    if (severity === "critical") {
      return {
        response: `${responsePrefix}I understand this is an urgent matter that requires immediate attention. I'm escalating this issue to our management team right away. Could you provide any additional details that would help us address this situation immediately?`,
        severity,
      };
    }

    // Default responses based on conversation stage
    if (stage === "greeting" || stage === "initial_feedback") {
      if (
        lowerInput.includes("good") ||
        lowerInput.includes("great") ||
        lowerInput.includes("excellent")
      ) {
        return {
          response: `${responsePrefix}I'm glad to hear you had a positive experience! Could you tell me more about what specifically you enjoyed during your visit?`,
          severity,
        };
      } else if (
        lowerInput.includes("bad") ||
        lowerInput.includes("poor") ||
        lowerInput.includes("terrible")
      ) {
        return {
          response: `${responsePrefix}I'm sorry to hear that your experience wasn't satisfactory. Could you share more details about what went wrong so we can address these issues?`,
          severity,
        };
      } else if (
        lowerInput.includes("ok") ||
        lowerInput.includes("okay") ||
        lowerInput.includes("fine")
      ) {
        return {
          response: `${responsePrefix}Thank you for sharing. I'd love to hear more specific details about your experience. Was there anything particular that stood out, either positively or negatively?`,
          severity,
        };
      }
    }

    // Topic-specific follow-up questions
    if (topics.includes("room")) {
      return {
        response: `${responsePrefix}Thank you for mentioning your room experience. How would you rate the cleanliness and comfort? Was everything in working order?`,
        severity,
      };
    } else if (topics.includes("food")) {
      return {
        response: `${responsePrefix}I appreciate your feedback about the food. Which dishes did you try, and how was the quality and presentation? Was the menu variety sufficient for your preferences?`,
        severity,
      };
    } else if (topics.includes("service")) {
      return {
        response: `${responsePrefix}Thank you for commenting on our service. How would you describe your interactions with our staff? Were they attentive and helpful throughout your visit?`,
        severity,
      };
    } else if (topics.includes("cleanliness")) {
      return {
        response: `${responsePrefix}Cleanliness is very important to us. Could you share more details about which areas you found clean or unclean? This helps us focus our improvement efforts.`,
        severity,
      };
    } else if (topics.includes("value")) {
      return {
        response: `${responsePrefix}Thank you for mentioning value. Compared to similar establishments you've visited, how would you rate the value for money here? Were there any specific aspects that influenced this perception?`,
        severity,
      };
    } else if (topics.includes("safety")) {
      return {
        response: `${responsePrefix}Thank you for bringing up safety concerns. Your safety is our top priority. Could you provide more specific details about the safety issues you experienced or observed?`,
        severity: "high", // Safety issues are always high priority
      };
    }

    // General follow-up questions based on conversation length
    if (messages.length < 4) {
      return {
        response: `${responsePrefix}Thank you for sharing that. What aspects of your visit would you like to discuss further? For example, your room, our service, food quality, or facilities?`,
        severity,
      };
    } else if (messages.length < 6) {
      return {
        response: `${responsePrefix}I appreciate your detailed feedback. Was there anything specific about your experience that could have been improved?`,
        severity,
      };
    } else if (messages.length < 8) {
      return {
        response: `${responsePrefix}Thank you for all this valuable information. Is there anything else you'd like to share about your experience with us?`,
        severity,
      };
    } else {
      return {
        response: `${responsePrefix}Thank you so much for taking the time to provide such detailed feedback. Your insights are extremely valuable and will help us improve our service. Is there anything else you'd like to add before we conclude?`,
        severity,
      };
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getSeverityIcon = (severity?: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "positive":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Feedback Assistant</CardTitle>
        <CardDescription>
          Share your experience with our AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-md">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex mb-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start max-w-[80%] ${
                  message.sender === "user"
                    ? "bg-purple-600 text-white rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl"
                    : "bg-gray-200 text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl"
                } p-3`}
              >
                <div className="mr-2 mt-1">
                  {message.sender === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {message.language && message.language !== "en" && (
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        <Globe className="h-3 w-3 mr-1" />
                        {languages.find((l) => l.code === message.language)
                          ?.name || message.language}
                      </Badge>
                    )}
                    {message.severity && message.sender === "user" && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="outline"
                              className={`text-xs py-0 h-5 ${
                                message.severity === "critical"
                                  ? "border-red-500 text-red-500"
                                  : message.severity === "high"
                                  ? "border-orange-500 text-orange-500"
                                  : message.severity === "medium"
                                  ? "border-yellow-500 text-yellow-500"
                                  : message.severity === "low"
                                  ? "border-blue-500 text-blue-500"
                                  : "border-green-500 text-green-500"
                              }`}
                            >
                              {getSeverityIcon(message.severity)}
                              <span className="ml-1">
                                {message.severity.charAt(0).toUpperCase() +
                                  message.severity.slice(1)}
                              </span>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Feedback severity level</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p>{message.content}</p>

                  {message.ratings && message.ratings.length > 0 && (
                    <div className="mt-2 flex items-center">
                      <span className="text-sm mr-2">Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= message.ratings![0].score
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {message.media && (
                    <div className="mt-2">
                      {message.media.type === "image" && (
                        <img
                          src={message.media.url || "/placeholder.svg"}
                          alt="User shared image"
                          className="max-w-full rounded-md mt-2 max-h-[200px]"
                        />
                      )}
                      {message.media.type === "audio" && (
                        <audio
                          src={message.media.url}
                          controls
                          className="max-w-full mt-2"
                        />
                      )}
                      {message.media.type === "video" && (
                        <video
                          src={message.media.url}
                          controls
                          className="max-w-full rounded-md mt-2 max-h-[200px]"
                        />
                      )}
                    </div>
                  )}

                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl p-3">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Rating prompt */}
          {showRatingPrompt && currentRatingService && (
            <div className="flex justify-start mb-4">
              <div className="bg-purple-100 text-gray-800 rounded-lg p-4 max-w-[90%]">
                <h4 className="font-medium mb-2">
                  How would you rate our{" "}
                  {serviceCategories.find((s) => s.id === currentRatingService)
                    ?.label || currentRatingService}
                  ?
                </h4>
                <div className="flex items-center mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCurrentRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (currentRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } hover:text-yellow-400 transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={skipRating}>
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRatingSubmit}
                    disabled={currentRating === null}
                  >
                    Submit Rating
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Media preview */}
        {mediaPreview.file && (
          <div className="mb-4 relative">
            <div className="bg-gray-100 p-3 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {mediaPreview.type === "image"
                    ? "Image Preview"
                    : mediaPreview.type === "audio"
                    ? "Audio Recording"
                    : "Video Preview"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={clearMediaPreview}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {mediaPreview.type === "image" && mediaPreview.preview && (
                <img
                  src={mediaPreview.preview || "/placeholder.svg"}
                  alt="Preview"
                  className="max-h-[150px] rounded-md mx-auto"
                />
              )}

              {mediaPreview.type === "audio" && mediaPreview.preview && (
                <audio src={mediaPreview.preview} controls className="w-full" />
              )}

              {mediaPreview.type === "video" && mediaPreview.preview && (
                <video
                  src={mediaPreview.preview}
                  controls
                  className="max-h-[150px] rounded-md mx-auto"
                />
              )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        {/* Language selector */}
        <div className="flex justify-end w-full">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Input area */}
        <div className="w-full">
          <Textarea
            placeholder="Type your feedback here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[80px] resize-none mb-2"
          />

          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {/* Image upload button */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isRecording || !!mediaPreview.file}
              >
                <ImageIcon className="h-4 w-4 mr-1" />
                Image
              </Button>

              {/* Video upload button */}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                ref={videoInputRef}
                onChange={handleVideoUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                disabled={isRecording || !!mediaPreview.file}
              >
                <Video className="h-4 w-4 mr-1" />
                Video
              </Button>

              {/* Voice recording button */}
              {!isRecording ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={startRecording}
                  disabled={!!mediaPreview.file}
                >
                  <Mic className="h-4 w-4 mr-1" />
                  Voice
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={stopRecording}
                >
                  <MicOff className="h-4 w-4 mr-1" />
                  {formatTime(recordingTime)}
                </Button>
              )}
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={(!input.trim() && !mediaPreview.file) || isTyping}
              className="ml-auto"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
