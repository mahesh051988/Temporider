import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Phone,
  Send,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import VerificationSteps from "./VerificationSteps";

interface AuthenticationFlowProps {
  userType?: "rider" | "driver" | "admin";
  onComplete?: (userData: any) => void;
}

const AuthenticationFlow = ({
  userType = "rider",
  onComplete = () => {},
}: AuthenticationFlowProps) => {
  const [stage, setStage] = useState<"phone" | "otp" | "verification">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const progressValue = {
    phone: 33,
    otp: 66,
    verification: 100,
  }[stage];

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate phone number (simple validation for demo)
    if (phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    // Simulate OTP sending
    setTimeout(() => {
      setLoading(false);
      setStage("otp");
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validate OTP (simple validation for demo)
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }

    // Simulate OTP verification
    setTimeout(() => {
      setLoading(false);
      setStage("verification");
    }, 1500);
  };

  const handleVerificationComplete = (userData: any) => {
    // Pass the completed user data to the parent component
    onComplete({
      phoneNumber,
      userType,
      ...userData,
    });
  };

  const renderStageContent = () => {
    switch (stage) {
      case "phone":
        return (
          <form onSubmit={handlePhoneSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="rounded-l-none"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
                {!loading && <Send className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        );

      case "otp":
        return (
          <form onSubmit={handleOtpSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  OTP sent to {phoneNumber}
                  <Button
                    variant="link"
                    className="p-0 h-auto ml-2"
                    onClick={() => setStage("phone")}
                  >
                    Change
                  </Button>
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
                {!loading && <CheckCircle className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        );

      case "verification":
        return (
          <VerificationSteps
            userType={userType}
            onComplete={handleVerificationComplete}
          />
        );

      default:
        return null;
    }
  };

  const stageTitle = {
    phone: "Phone Verification",
    otp: "OTP Verification",
    verification:
      userType === "rider" ? "Selfie Verification" : "Document Verification",
  }[stage];

  const stageDescription = {
    phone: "Enter your phone number to receive a verification code",
    otp: "Enter the 6-digit code sent to your phone",
    verification:
      userType === "rider"
        ? "Please take a clear selfie to verify your identity"
        : "Please upload the required documents for verification",
  }[stage];

  return (
    <div className="flex justify-center items-center min-h-[600px] bg-background">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{stageTitle}</CardTitle>
              <CardDescription>{stageDescription}</CardDescription>
            </div>
            <div className="rounded-full bg-primary/10 p-2">
              {userType === "rider" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
              ) : userType === "driver" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <path d="M4 13h16" />
                  <path d="M16 2v4" />
                  <path d="M8 2v4" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              )}
            </div>
          </div>
          <Progress value={progressValue} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>{renderStageContent()}</CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to RideConnect's Terms of Service and
            Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthenticationFlow;
