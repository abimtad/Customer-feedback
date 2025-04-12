"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Gift,
  RefreshCw,
  Trophy,
  Sparkles,
  Coffee,
  Utensils,
  Percent,
} from "lucide-react";
import confetti from "canvas-confetti";

type Reward = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  probability: number;
  color: string;
};

const rewards: Reward[] = [
  {
    id: "discount10",
    name: "10% Discount",
    description: "10% off your next stay",
    icon: <Percent className="h-6 w-6" />,
    probability: 0.25,
    color: "bg-blue-500",
  },
  {
    id: "discount20",
    name: "20% Discount",
    description: "20% off your next stay",
    icon: <Percent className="h-6 w-6" />,
    probability: 0.15,
    color: "bg-indigo-500",
  },
  {
    id: "freeDrink",
    name: "Free Drink",
    description: "Enjoy a complimentary drink at our bar",
    icon: <Coffee className="h-6 w-6" />,
    probability: 0.2,
    color: "bg-amber-500",
  },
  {
    id: "freeDessert",
    name: "Free Dessert",
    description: "Complimentary dessert with your next meal",
    icon: <Utensils className="h-6 w-6" />,
    probability: 0.2,
    color: "bg-pink-500",
  },
  {
    id: "loyaltyPoints",
    name: "100 Loyalty Points",
    description: "Extra points added to your loyalty account",
    icon: <Trophy className="h-6 w-6" />,
    probability: 0.15,
    color: "bg-purple-500",
  },
  {
    id: "vipUpgrade",
    name: "VIP Upgrade",
    description: "One-time room upgrade on your next stay",
    icon: <Sparkles className="h-6 w-6" />,
    probability: 0.05,
    color: "bg-yellow-500",
  },
];

export function FeedbackGamification() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

  const spinWheel = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSelectedReward(null);

    // Calculate a random number of full rotations (2-5) plus a random position
    const fullRotations = 2 + Math.floor(Math.random() * 3); // 2-4 full rotations
    const extraDegrees = Math.floor(Math.random() * 360);
    const totalDegrees = fullRotations * 360 + extraDegrees;

    setRotationDegrees(totalDegrees);

    // Determine the winning reward based on the final position
    setTimeout(() => {
      const normalizedDegrees = extraDegrees;
      const segmentSize = 360 / rewards.length;
      const winningIndex = Math.floor(normalizedDegrees / segmentSize);
      const reward = rewards[winningIndex];

      setSelectedReward(reward);
      setShowConfetti(true);

      // Trigger confetti
      if (confettiCanvasRef.current) {
        const myConfetti = confetti.create(confettiCanvasRef.current, {
          resize: true,
          useWorker: true,
        });

        myConfetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: [reward.color.replace("bg-", ""), "#ffffff", "#gold"],
        });
      }
    }, 5000); // Wait for the wheel to stop spinning
  };

  const resetWheel = () => {
    setIsSpinning(false);
    setSelectedReward(null);
    setRotationDegrees(0);
    setShowConfetti(false);
  };

  // Clean up confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Gift className="h-5 w-5 mr-2" />
          Spin to Win
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Confetti canvas */}
        <canvas
          ref={confettiCanvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${
            showConfetti ? "block" : "hidden"
          }`}
        />

        {/* Prize wheel */}
        <div className="relative w-64 h-64 mb-6">
          {/* Center pin */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-800 z-10"></div>

          {/* Pointer */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[20px] border-l-transparent border-r-transparent border-b-gray-800 z-10"></div>

          {/* Wheel */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full overflow-hidden border-4 border-gray-300 relative transition-transform duration-5000 ease-out"
            style={{
              transform: `rotate(${rotationDegrees}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
                : "none",
            }}
          >
            {/* Wheel segments */}
            {rewards.map((reward, index) => {
              const segmentSize = 360 / rewards.length;
              const rotation = index * segmentSize;

              return (
                <div
                  key={reward.id}
                  className={`absolute w-full h-full ${reward.color} flex items-center justify-center`}
                  style={{
                    clipPath: `polygon(50% 50%, 50% 0%, ${
                      50 +
                      50 * Math.cos(((rotation + segmentSize) * Math.PI) / 180)
                    }% ${
                      50 +
                      50 * Math.sin(((rotation + segmentSize) * Math.PI) / 180)
                    }%, 50% 50%)`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  <div
                    className="text-white font-bold text-xs absolute"
                    style={{
                      transform: `rotate(${
                        90 + segmentSize / 2
                      }deg) translateY(-32px)`,
                      width: "60px",
                      textAlign: "center",
                    }}
                  >
                    {reward.icon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reward display */}
        {selectedReward ? (
          <div className="text-center bg-gray-50 p-4 rounded-lg w-full">
            <div
              className={`${selectedReward.color} text-white rounded-full p-3 inline-flex mb-2`}
            >
              {selectedReward.icon}
            </div>
            <h3 className="font-bold text-lg mb-1">Congratulations!</h3>
            <p className="font-medium text-gray-800 mb-1">
              {selectedReward.name}
            </p>
            <p className="text-sm text-gray-600">
              {selectedReward.description}
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-4">
            {isSpinning
              ? "Spinning the wheel..."
              : "Thank you for your feedback! Spin the wheel to win a prize."}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {!isSpinning && !selectedReward ? (
          <Button
            onClick={spinWheel}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Spin the Wheel
          </Button>
        ) : selectedReward ? (
          <Button
            onClick={resetWheel}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Spin Again
          </Button>
        ) : (
          <Button disabled>Spinning...</Button>
        )}
      </CardFooter>
    </Card>
  );
}
