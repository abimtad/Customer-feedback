"use client";

import type React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Check, Star } from "lucide-react";

type FeedbackCategory = "room" | "service" | "food" | "cleanliness" | "value";

type FeedbackState = {
  rating: number | null;
  categories: FeedbackCategory[];
  comment: string;
  step: number;
  submitted: boolean;
};

export function FeedbackKiosk() {
  const [feedback, setFeedback] = useState<FeedbackState>({
    rating: null,
    categories: [],
    comment: "",
    step: 1,
    submitted: false,
  });

  const handleRatingChange = (rating: number) => {
    setFeedback({ ...feedback, rating });
  };

  const handleCategoryToggle = (category: FeedbackCategory) => {
    const updatedCategories = feedback.categories.includes(category)
      ? feedback.categories.filter((c) => c !== category)
      : [...feedback.categories, category];

    setFeedback({ ...feedback, categories: updatedCategories });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback({ ...feedback, comment: e.target.value });
  };

  const nextStep = () => {
    setFeedback({ ...feedback, step: feedback.step + 1 });
  };

  const prevStep = () => {
    setFeedback({ ...feedback, step: feedback.step - 1 });
  };

  const handleSubmit = () => {
    // In a real app, you would send this data to your backend
    console.log("Feedback submitted:", feedback);
    setFeedback({ ...feedback, submitted: true });
  };

  const resetForm = () => {
    setFeedback({
      rating: null,
      categories: [],
      comment: "",
      step: 1,
      submitted: false,
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Quick Feedback</CardTitle>
        <CardDescription>Help us improve your experience</CardDescription>
      </CardHeader>
      <CardContent>
        {feedback.submitted ? (
          <div className="text-center py-8">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-600 mb-6">
              Your feedback has been submitted and will help us improve our
              service.
            </p>
            <Button onClick={resetForm}>Submit Another Response</Button>
          </div>
        ) : (
          <>
            {feedback.step === 1 && (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  How would you rate your overall experience?
                </h3>
                <div className="flex justify-center space-x-4 mb-6">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleRatingChange(rating)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                        feedback.rating === rating
                          ? "bg-purple-100 scale-110"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          feedback.rating !== null && rating <= feedback.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                      <span className="text-sm mt-1">{rating}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {feedback.step === 2 && (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  What aspects of your experience would you like to highlight?
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { id: "room", label: "Room Quality" },
                    { id: "service", label: "Staff & Service" },
                    { id: "food", label: "Food & Beverage" },
                    { id: "cleanliness", label: "Cleanliness" },
                    { id: "value", label: "Value for Money" },
                  ].map((category) => (
                    <div
                      key={category.id}
                      onClick={() =>
                        handleCategoryToggle(category.id as FeedbackCategory)
                      }
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        feedback.categories.includes(
                          category.id as FeedbackCategory
                        )
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Label className="cursor-pointer" htmlFor={category.id}>
                        {category.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {feedback.step === 3 && (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  Would you like to share any additional comments?
                </h3>
                <Textarea
                  placeholder="Tell us more about your experience..."
                  value={feedback.comment}
                  onChange={handleCommentChange}
                  className="min-h-[150px]"
                />
              </div>
            )}
          </>
        )}
      </CardContent>
      {!feedback.submitted && (
        <CardFooter className="flex justify-between">
          {feedback.step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
          )}
          {feedback.step < 3 ? (
            <Button
              onClick={nextStep}
              disabled={feedback.step === 1 && feedback.rating === null}
              className={feedback.step === 1 ? "ml-auto" : ""}
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Feedback</Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
