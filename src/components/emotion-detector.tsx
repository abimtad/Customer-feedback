"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, AlertTriangle, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

type EmotionResult = {
  dominant:
    | "happy"
    | "sad"
    | "angry"
    | "surprised"
    | "disgusted"
    | "fearful"
    | "neutral";
  scores: {
    happy: number;
    sad: number;
    angry: number;
    surprised: number;
    disgusted: number;
    fearful: number;
    neutral: number;
  };
  confidence: number;
};

export function EmotionDetector({
  onEmotionDetected,
}: {
  onEmotionDetected: (result: EmotionResult) => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [emotionResult, setEmotionResult] = useState<EmotionResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [faceDetected, setFaceDetected] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(
        "Could not access your camera. Please check your browser permissions."
      );
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setCapturedImage(null);
    setFaceDetected(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Simulate face detection
  useEffect(() => {
    if (!isActive) return;

    const checkForFace = setInterval(() => {
      // In a real app, you would use face-api.js to detect faces
      // For this demo, we'll simulate face detection with a random chance
      const detected = Math.random() > 0.3; // 70% chance of detecting a face
      setFaceDetected(detected);
    }, 1000);

    return () => {
      clearInterval(checkForFace);
    };
  }, [isActive]);

  // Capture image from video
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to image URL
    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);

    // Analyze emotion
    analyzeEmotion();
  };

  // Simulate emotion analysis
  const analyzeEmotion = () => {
    setIsAnalyzing(true);

    // In a real app, you would send the image to a server or use face-api.js
    // For this demo, we'll simulate the analysis with a timeout
    setTimeout(() => {
      // Generate random emotion scores
      const happy = Math.random() * 0.7;
      const sad = Math.random() * 0.5;
      const angry = Math.random() * 0.4;
      const surprised = Math.random() * 0.3;
      const disgusted = Math.random() * 0.2;
      const fearful = Math.random() * 0.2;
      const neutral = Math.random() * 0.6;

      // Normalize scores
      const total =
        happy + sad + angry + surprised + disgusted + fearful + neutral;
      const normalizedScores = {
        happy: happy / total,
        sad: sad / total,
        angry: angry / total,
        surprised: surprised / total,
        disgusted: disgusted / total,
        fearful: fearful / total,
        neutral: neutral / total,
      };

      // Determine dominant emotion
      const emotions = Object.entries(normalizedScores) as [
        (
          | "happy"
          | "sad"
          | "angry"
          | "surprised"
          | "disgusted"
          | "fearful"
          | "neutral"
        ),
        number
      ][];
      const dominant = emotions.reduce((a, b) => (a[1] > b[1] ? a : b))[0];

      // Create result
      const result: EmotionResult = {
        dominant,
        scores: normalizedScores,
        confidence: normalizedScores[dominant],
      };

      setEmotionResult(result);
      setIsAnalyzing(false);
      onEmotionDetected(result);
    }, 2000);
  };

  // Reset and try again
  const resetCapture = () => {
    setCapturedImage(null);
    setEmotionResult(null);
  };

  // Get color for emotion
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return "bg-green-100 text-green-800 border-green-300";
      case "sad":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "angry":
        return "bg-red-100 text-red-800 border-red-300";
      case "surprised":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "disgusted":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "fearful":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Detection</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Camera controls */}
          <div className="flex justify-center">
            {!isActive ? (
              <Button
                onClick={startCamera}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            ) : (
              <Button onClick={stopCamera} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Stop Camera
              </Button>
            )}
          </div>

          {/* Video preview */}
          <div className="relative rounded-lg overflow-hidden bg-black">
            {isActive && !capturedImage && (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-[240px] object-cover"
                />
                {faceDetected && (
                  <div className="absolute top-2 left-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      Face Detected
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-2 right-2">
                  <Button
                    onClick={captureImage}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!faceDetected}
                  >
                    Capture
                  </Button>
                </div>
              </>
            )}

            {capturedImage && (
              <div className="relative">
                <img
                  src={capturedImage || "/placeholder.svg"}
                  alt="Captured"
                  className="w-full h-[240px] object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Button
                    onClick={resetCapture}
                    size="sm"
                    variant="outline"
                    className="bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Analysis status */}
          {isAnalyzing && (
            <div className="text-center py-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
              <div className="mt-2 text-sm">Analyzing facial expression...</div>
            </div>
          )}

          {/* Emotion results */}
          {emotionResult && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {emotionResult.dominant === "happy" ||
                  emotionResult.dominant === "surprised" ? (
                    <Info className="h-5 w-5 text-green-500" />
                  ) : emotionResult.dominant === "angry" ||
                    emotionResult.dominant === "disgusted" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                  <span className="ml-2 font-medium">Detected Emotion</span>
                </div>
                <Badge
                  variant="outline"
                  className={`${getEmotionColor(emotionResult.dominant)}`}
                >
                  {emotionResult.dominant.charAt(0).toUpperCase() +
                    emotionResult.dominant.slice(1)}
                </Badge>
              </div>

              <div className="space-y-3">
                {Object.entries(emotionResult.scores).map(
                  ([emotion, score]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{emotion}</span>
                        <span>{Math.round(score * 100)}%</span>
                      </div>
                      <Progress value={score * 100} className="h-2" />
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
