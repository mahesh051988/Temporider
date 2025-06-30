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
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {step === "phone" ? "📱 Phone Verification" : "🔐 Enter OTP"}
        </CardTitle>
        <CardDescription className="text-gray-600 text-base mt-2">
          {step === "phone"
            ? `Enter your phone number to continue as a ${userType}`
            : `We've sent a 6-digit code to ${countryCode} ${phoneNumber}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-200 bg-red-50"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {step === "phone" ? (
          <div className="space-y-6">
            <div className="flex space-x-3">
              <div className="w-2/5">
                <Label
                  htmlFor="country-code"
                  className="text-sm font-medium text-gray-700"
                >
                  Country Code
                </Label>
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger
                    id="country-code"
                    className="mt-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {countryCodes.map((country) => (
                      <SelectItem
                        key={country.value}
                        value={country.value}
                        className="rounded-lg"
                      >
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-3/5">
                <Label
                  htmlFor="phone-number"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="mt-1 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-base"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  maxLength={10}
                />
              </div>
            </div>
            <div className="text-center text-sm text-gray-500">
              <p>We'll send you a verification code via SMS</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 block mb-3">
                Enter Verification Code
              </Label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    className="w-14 h-14 text-center text-xl font-bold rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                  />
                ))}
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">Didn't receive the code?</p>
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={resendCooldown > 0 || isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="px-6 pb-6">
        {step === "phone" ? (
          <div className="w-full">
            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={handleSendOTP}
              disabled={isLoading || !phoneNumber || phoneNumber.length < 10}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <Button
              className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={handleVerifyOTP}
              disabled={isLoading || otp.join("").length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code
                  <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
              onClick={() => setStep("phone")}
              disabled={isLoading}
            >
              ← Change Phone Number
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default PhoneVerification;
