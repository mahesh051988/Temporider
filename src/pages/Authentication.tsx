import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PhoneVerification from "@/components/auth/PhoneVerification";
import SelfieVerification from "@/components/auth/SelfieVerification";
import DriverDocumentUpload from "@/components/auth/DriverDocumentUpload";
import SubscriptionSelection from "@/components/auth/SubscriptionSelection";
import VerificationSteps from "@/components/auth/VerificationSteps";
import { motion } from "framer-motion";
import { CheckCircle, User, Car, Shield } from "lucide-react";

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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                type: "spring",
                bounce: 0.4,
              }}
              className="w-20 h-20 mb-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="text-2xl font-bold text-green-800 mb-3"
            >
              Verification Complete!
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-green-700 mb-6 text-base leading-relaxed"
            >
              {userType === "rider"
                ? "🎉 Your account has been successfully verified! You can now start booking rides and enjoy seamless travel experiences."
                : "🚗 Your driver account has been successfully verified! You can now start accepting ride requests and begin earning."}
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Get Started →
            </motion.button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            RideConnect
          </h1>
          <p className="text-gray-600 text-lg">
            Your trusted ride-sharing platform
          </p>
        </motion.div>
      </div>

      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          <Card className="w-full bg-white/80 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
            <CardHeader className="pb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                {userType === "rider" ? (
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                ) : (
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                )}
              </div>

              <CardTitle className="text-2xl font-bold text-gray-800">
                {currentStep === "complete"
                  ? "🎉 Welcome to RideConnect!"
                  : `${userType === "rider" ? "Rider" : "Driver"} Verification`}
              </CardTitle>

              <CardDescription className="text-gray-600 text-base">
                {currentStep === "complete"
                  ? "Your account is ready to use"
                  : "Complete your verification to get started"}
              </CardDescription>

              {currentStep === "phone" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="mt-6"
                >
                  <Tabs defaultValue={userType} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                      <TabsTrigger
                        value="rider"
                        onClick={() => setUserType("rider")}
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Rider
                      </TabsTrigger>
                      <TabsTrigger
                        value="driver"
                        onClick={() => setUserType("driver")}
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200"
                      >
                        <Car className="h-4 w-4 mr-2" />
                        Driver
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </motion.div>
              )}
            </CardHeader>

            <CardContent className="px-6 pb-6">
              {/* Progress Steps */}
              {currentStep !== "complete" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-between mb-4">
                    {getSteps().map((step, index) => (
                      <div key={step.id} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            step.completed
                              ? "bg-green-500 text-white"
                              : currentStep === step.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        {index < getSteps().length - 1 && (
                          <div
                            className={`w-12 h-0.5 mx-2 transition-all duration-300 ${
                              step.completed ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      Step{" "}
                      {getSteps().findIndex((s) => s.id === currentStep) +
                        1} of {getSteps().length}
                    </Badge>
                  </div>
                </motion.div>
              )}

              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500 text-sm">
        <p>Secure • Fast • Reliable</p>
      </div>
    </div>
  );
};

export default Authentication;
