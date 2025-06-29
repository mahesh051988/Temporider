import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, Check, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PhoneVerificationProps {
  onVerificationComplete?: () => void;
  onBack?: () => void;
  userType?: "rider" | "driver";
}

const PhoneVerification = ({
  onVerificationComplete = () => {},
  onBack = () => {},
  userType = "rider",
}: PhoneVerificationProps) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const countryCodes = [
    { value: "+91", label: "India (+91)" },
    { value: "+1", label: "USA (+1)" },
    { value: "+44", label: "UK (+44)" },
    { value: "+61", label: "Australia (+61)" },
    { value: "+65", label: "Singapore (+65)" },
  ];

  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate API call to send OTP
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
      startResendCooldown();
    }, 1500);
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);

    // Simulate API call to resend OTP
    setTimeout(() => {
      setIsLoading(false);
      startResendCooldown();
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setError(null);
    setIsLoading(true);

    // Simulate API call to verify OTP
    setTimeout(() => {
      setIsLoading(false);
      onVerificationComplete();
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          {step === "phone" ? "Phone Verification" : "Enter OTP"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === "phone"
            ? `Enter your phone number to continue as a ${userType}`
            : `We've sent a verification code to ${countryCode} ${phoneNumber}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "phone" ? (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <div className="w-1/3">
                <Label htmlFor="country-code">Country</Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger id="country-code">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.value} value={country.value}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-2/3">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Verification Code</Label>
              <div className="flex justify-between mt-2 gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    className="w-12 h-12 text-center text-xl"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                  />
                ))}
              </div>
            </div>
            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isLoading}
                className="text-sm"
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {step === "phone" ? (
          <div className="w-full">
            <Button
              className="w-full"
              onClick={handleSendOTP}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <Button
              className="w-full"
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                <>
                  Verify OTP
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep("phone")}
              disabled={isLoading}
            >
              Change Phone Number
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PhoneVerification;
