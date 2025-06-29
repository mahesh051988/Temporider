import React, { useState } from "react";
import {
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface VerificationStepsProps {
  userType: "rider" | "driver" | "admin";
  onComplete: (verificationData: any) => void;
  onBack: () => void;
}

const VerificationSteps = ({
  userType = "rider",
  onComplete = () => {},
  onBack = () => {},
}: VerificationStepsProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationData, setVerificationData] = useState<any>({
    selfie: null,
    license: null,
    rc: null,
    vehiclePhotos: [],
  });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  // Define steps based on user type
  const steps =
    userType === "rider"
      ? ["Selfie Verification"]
      : [
          "Selfie Verification",
          "License Verification",
          "RC Verification",
          "Vehicle Photos",
        ];

  const handleCaptureSelfie = () => {
    // Simulate selfie capture
    setProcessing(true);
    setTimeout(() => {
      setVerificationData({
        ...verificationData,
        selfie: "data:image/jpeg;base64,/9j/selfie-placeholder",
      });
      setProcessing(false);
    }, 1500);
  };

  const handleUploadDocument = (documentType: "license" | "rc") => {
    // Simulate document upload
    setProcessing(true);
    setTimeout(() => {
      setVerificationData({
        ...verificationData,
        [documentType]: `data:image/jpeg;base64,/9j/${documentType}-placeholder`,
      });
      setProcessing(false);
    }, 1500);
  };

  const handleAddVehiclePhoto = () => {
    // Simulate adding a vehicle photo
    setProcessing(true);
    setTimeout(() => {
      setVerificationData({
        ...verificationData,
        vehiclePhotos: [
          ...verificationData.vehiclePhotos,
          `data:image/jpeg;base64,/9j/vehicle-photo-${verificationData.vehiclePhotos.length + 1}`,
        ],
      });
      setProcessing(false);
    }, 1500);
  };

  const validateCurrentStep = () => {
    setError(null);

    switch (steps[currentStep]) {
      case "Selfie Verification":
        if (!verificationData.selfie) {
          setError("Please capture your selfie");
          return false;
        }
        break;
      case "License Verification":
        if (!verificationData.license) {
          setError("Please upload your driving license");
          return false;
        }
        break;
      case "RC Verification":
        if (!verificationData.rc) {
          setError("Please upload your RC document");
          return false;
        }
        break;
      case "Vehicle Photos":
        if (verificationData.vehiclePhotos.length < 1) {
          setError("Please add at least one vehicle photo");
          return false;
        }
        break;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Simulate AI validation for the final step
      setProcessing(true);
      setTimeout(() => {
        setProcessing(false);
        setVerificationSuccess(true);
        setTimeout(() => {
          onComplete(verificationData);
        }, 1000);
      }, 2000);
    }
  };

  const renderStepContent = () => {
    const currentStepName = steps[currentStep];

    switch (currentStepName) {
      case "Selfie Verification":
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center overflow-hidden">
              {verificationData.selfie ? (
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  alt="Selfie Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera size={64} className="text-muted-foreground" />
              )}
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Please take a clear selfie in good lighting. Make sure your face
                is clearly visible.
              </p>

              <Button
                onClick={handleCaptureSelfie}
                disabled={processing}
                className="w-full"
              >
                {verificationData.selfie ? "Retake Selfie" : "Capture Selfie"}
              </Button>
            </div>
          </div>
        );

      case "License Verification":
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center overflow-hidden">
              {verificationData.license ? (
                <img
                  src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80"
                  alt="License Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload size={64} className="text-muted-foreground" />
              )}
            </div>

            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground mb-4">
                Upload a clear photo of your driving license. All details should
                be clearly visible.
              </p>

              <Button
                onClick={() => handleUploadDocument("license")}
                disabled={processing}
                className="w-full"
              >
                {verificationData.license
                  ? "Replace License Photo"
                  : "Upload License"}
              </Button>
            </div>
          </div>
        );

      case "RC Verification":
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center overflow-hidden">
              {verificationData.rc ? (
                <img
                  src="https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&q=80"
                  alt="RC Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload size={64} className="text-muted-foreground" />
              )}
            </div>

            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground mb-4">
                Upload a clear photo of your vehicle's Registration Certificate
                (RC).
              </p>

              <Button
                onClick={() => handleUploadDocument("rc")}
                disabled={processing}
                className="w-full"
              >
                {verificationData.rc ? "Replace RC Photo" : "Upload RC"}
              </Button>
            </div>
          </div>
        );

      case "Vehicle Photos":
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="grid grid-cols-2 gap-2 w-full">
              {verificationData.vehiclePhotos.map(
                (photo: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-md flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=300&q=80`}
                      alt={`Vehicle Photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ),
              )}

              {verificationData.vehiclePhotos.length < 4 && (
                <div
                  className="aspect-square bg-muted rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={handleAddVehiclePhoto}
                >
                  <Upload size={32} className="text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    Add Photo
                  </span>
                </div>
              )}
            </div>

            <div className="text-center w-full">
              <p className="text-sm text-muted-foreground mb-4">
                Upload clear photos of your vehicle from different angles
                (front, back, sides).
              </p>

              <p className="text-xs text-muted-foreground">
                {verificationData.vehiclePhotos.length}/4 photos added
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (verificationSuccess) {
    return (
      <Card className="w-full bg-background">
        <CardContent className="pt-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Verification Successful!
            </h2>
            <p className="text-muted-foreground mb-6">
              {userType === "rider"
                ? "Your profile has been verified successfully."
                : "Your documents have been verified successfully."}
            </p>
            <Button
              onClick={() => onComplete(verificationData)}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-background">
      <CardHeader>
        <CardTitle>Verification</CardTitle>
        <CardDescription>
          {userType === "rider"
            ? "Complete your profile verification"
            : "Complete your driver verification"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <Progress
            value={((currentStep + 1) / steps.length) * 100}
            className="h-2"
          />
        </div>

        {/* Error message */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Processing indicator */}
        {processing && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 rounded-md">
            <div className="flex flex-col items-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm font-medium">Processing...</p>
            </div>
          </div>
        )}

        {/* Step content */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          {renderStepContent()}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={
            currentStep === 0 ? onBack : () => setCurrentStep(currentStep - 1)
          }
          disabled={processing}
        >
          {currentStep === 0 ? "Back" : "Previous"}
        </Button>

        <Button onClick={handleNext} disabled={processing}>
          {currentStep === steps.length - 1 ? "Submit" : "Next"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerificationSteps;
