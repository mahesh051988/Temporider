import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

interface SelfieVerificationProps {
  onComplete?: (selfieImage: string) => void;
  onCancel?: () => void;
}

const SelfieVerification = ({
  onComplete = () => {},
  onCancel = () => {},
}: SelfieVerificationProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera when component mounts
  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError(
        "Unable to access camera. Please ensure you have granted camera permissions.",
      );
      console.error("Error accessing camera:", err);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture selfie from video stream
  const captureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/png");
        setCapturedImage(imageDataUrl);
        stopCamera();

        // Simulate face detection verification
        verifySelfie(imageDataUrl);
      }
    }
  };

  // Simulate selfie verification with face detection
  const verifySelfie = (imageData: string) => {
    setVerificationStatus("processing");
    setIsProcessing(true);

    // Simulate API call for face detection
    setTimeout(() => {
      // Random success (80% chance) for demo purposes
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        setVerificationStatus("success");
        // Wait a moment before completing
        setTimeout(() => {
          onComplete(imageData);
        }, 1000);
      } else {
        setVerificationStatus("failed");
        setError(
          "Face not clearly visible or multiple faces detected. Please try again.",
        );
      }

      setIsProcessing(false);
    }, 2000);
  };

  // Retry selfie capture
  const retakeSelfie = () => {
    setCapturedImage(null);
    setVerificationStatus("idle");
    setError(null);
    startCamera();
  };

  // Initialize camera when component first loads
  useEffect(() => {
    startCamera();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
            <Camera className="h-6 w-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">
          📸 Selfie Verification
        </CardTitle>
        <CardDescription className="text-gray-600 text-base mt-2">
          Take a clear selfie to verify your identity
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center px-6">
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

        <div className="relative w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-6 shadow-inner border-4 border-white">
          {!capturedImage && isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {verificationStatus === "processing" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <RefreshCw className="h-12 w-12 text-white animate-spin" />
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          )}
        </div>

        {/* Hidden canvas for capturing frames */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="text-center mt-4">
          {verificationStatus === "idle" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 font-medium">
                📋 Selfie Guidelines:
              </p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Face clearly visible and well-lit</li>
                <li>• Look directly at the camera</li>
                <li>• Remove sunglasses or hat</li>
              </ul>
            </div>
          )}

          {verificationStatus === "processing" && (
            <div className="flex items-center justify-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              <p className="text-sm font-medium text-blue-600">
                Analyzing your selfie...
              </p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-green-600">
                ✅ Verification successful!
              </p>
            </div>
          )}

          {verificationStatus === "failed" && (
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm font-medium text-red-600">
                ❌ Verification failed. Please try again.
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between px-6 pb-6">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing || verificationStatus === "success"}
          className="rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
        >
          Cancel
        </Button>

        {!capturedImage ? (
          <Button
            onClick={captureSelfie}
            disabled={!isCameraActive || isProcessing}
            className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Camera className="mr-2 h-4 w-4" />
            📸 Capture Selfie
          </Button>
        ) : verificationStatus !== "success" ? (
          <Button
            onClick={retakeSelfie}
            disabled={isProcessing}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            🔄 Retake
          </Button>
        ) : (
          <Button
            disabled
            className="rounded-xl bg-green-500 text-white cursor-not-allowed"
          >
            <CheckCircle className="mr-2 h-4 w-4" />✅ Verified
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SelfieVerification;
