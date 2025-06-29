import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PhoneVerification from "@/components/auth/PhoneVerification";
import SelfieVerification from "@/components/auth/SelfieVerification";
import DriverDocumentUpload from "@/components/auth/DriverDocumentUpload";
import SubscriptionSelection from "@/components/auth/SubscriptionSelection";
import VerificationSteps from "@/components/auth/VerificationSteps";
import { motion } from "framer-motion";

type UserType = "rider" | "driver";
type VerificationStep =
  | "phone"
  | "selfie"
  | "documents"
  | "subscription"
  | "complete";

const Authentication = () => {
  const [userType, setUserType] = useState<UserType>("rider");
  const [currentStep, setCurrentStep] = useState<VerificationStep>("phone");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [selfieVerified, setSelfieVerified] = useState(false);
  const [documentsVerified, setDocumentsVerified] = useState(false);
  const [subscriptionSelected, setSubscriptionSelected] = useState(false);

  const handlePhoneVerificationComplete = () => {
    setPhoneVerified(true);
    setCurrentStep("selfie");
  };

  const handleSelfieVerificationComplete = () => {
    setSelfieVerified(true);
    if (userType === "driver") {
      setCurrentStep("documents");
    } else {
      setCurrentStep("complete");
    }
  };

  const handleDocumentVerificationComplete = () => {
    setDocumentsVerified(true);
    setCurrentStep("subscription");
  };

  const handleSubscriptionComplete = () => {
    setSubscriptionSelected(true);
    setCurrentStep("complete");
  };

  const getSteps = () => {
    if (userType === "rider") {
      return [
        { id: "phone", label: "Phone Verification", completed: phoneVerified },
        {
          id: "selfie",
          label: "Selfie Verification",
          completed: selfieVerified,
        },
        {
          id: "complete",
          label: "Complete",
          completed: currentStep === "complete",
        },
      ];
    } else {
      return [
        { id: "phone", label: "Phone Verification", completed: phoneVerified },
        {
          id: "selfie",
          label: "Selfie Verification",
          completed: selfieVerified,
        },
        {
          id: "documents",
          label: "Document Verification",
          completed: documentsVerified,
        },
        {
          id: "subscription",
          label: "Subscription",
          completed: subscriptionSelected,
        },
        {
          id: "complete",
          label: "Complete",
          completed: currentStep === "complete",
        },
      ];
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "phone":
        return (
          <PhoneVerification onComplete={handlePhoneVerificationComplete} />
        );
      case "selfie":
        return (
          <SelfieVerification onComplete={handleSelfieVerificationComplete} />
        );
      case "documents":
        return (
          <DriverDocumentUpload
            onComplete={handleDocumentVerificationComplete}
          />
        );
      case "subscription":
        return (
          <SubscriptionSelection onComplete={handleSubscriptionComplete} />
        );
      case "complete":
        return (
          <div className="flex flex-col items-center justify-center p-6 text-center bg-green-50 rounded-lg">
            <div className="w-16 h-16 mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              Verification Complete!
            </h3>
            <p className="text-green-600 mb-4">
              {userType === "rider"
                ? "Your account has been successfully verified. You can now start booking rides."
                : "Your account has been successfully verified. You can now start accepting ride requests."}
            </p>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Go to Dashboard
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full bg-white shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center">
              RideConnect
            </CardTitle>
            <CardDescription className="text-center">
              {currentStep === "complete"
                ? "Verification Complete"
                : "Complete your verification to get started"}
            </CardDescription>

            {currentStep === "phone" && (
              <Tabs defaultValue={userType} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="rider"
                    onClick={() => setUserType("rider")}
                  >
                    Rider
                  </TabsTrigger>
                  <TabsTrigger
                    value="driver"
                    onClick={() => setUserType("driver")}
                  >
                    Driver
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </CardHeader>

          <CardContent>
            <VerificationSteps steps={getSteps()} currentStep={currentStep} />

            <div className="mt-6">{renderCurrentStep()}</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Authentication;
