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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DocumentUploadProps {
  onComplete?: (documents: DocumentData) => void;
  onBack?: () => void;
}

interface DocumentData {
  license: File | null;
  registrationCertificate: File | null;
  vehiclePhotos: File[];
}

const DriverDocumentUpload = ({
  onComplete = () => {},
  onBack = () => {},
}: DocumentUploadProps) => {
  const [documents, setDocuments] = useState<DocumentData>({
    license: null,
    registrationCertificate: null,
    vehiclePhotos: [],
  });

  const [validationStatus, setValidationStatus] = useState({
    license: { isValid: false, message: "" },
    registrationCertificate: { isValid: false, message: "" },
    vehiclePhotos: { isValid: false, message: "" },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (
    type: keyof DocumentData,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files?.length) return;

    if (type === "vehiclePhotos") {
      const files = Array.from(e.target.files);
      setDocuments((prev) => ({
        ...prev,
        [type]: [...files],
      }));

      // Simulate document validation
      validateDocument(type, files);
    } else {
      const file = e.target.files[0];
      setDocuments((prev) => ({
        ...prev,
        [type]: file,
      }));

      // Simulate document validation
      validateDocument(type, file);
    }
  };

  const validateDocument = (type: keyof DocumentData, file: File | File[]) => {
    // Simulate AI-based document validation
    setIsUploading(true);

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);

        // Simulate validation result
        const isValid = Math.random() > 0.2; // 80% chance of success for demo

        setValidationStatus((prev) => ({
          ...prev,
          [type]: {
            isValid,
            message: isValid
              ? "Document verified successfully"
              : "Invalid document. Please upload a clear image.",
          },
        }));
      }
    }, 300);
  };

  const removeFile = (type: keyof DocumentData, index?: number) => {
    if (type === "vehiclePhotos" && typeof index === "number") {
      const updatedPhotos = [...documents.vehiclePhotos];
      updatedPhotos.splice(index, 1);

      setDocuments((prev) => ({
        ...prev,
        vehiclePhotos: updatedPhotos,
      }));
    } else {
      setDocuments((prev) => ({
        ...prev,
        [type]: null,
      }));
    }

    setValidationStatus((prev) => ({
      ...prev,
      [type]: { isValid: false, message: "" },
    }));
  };

  const handleSubmit = () => {
    // Check if all required documents are uploaded and valid
    const isLicenseValid = validationStatus.license.isValid;
    const isRCValid = validationStatus.registrationCertificate.isValid;
    const isVehiclePhotosValid =
      documents.vehiclePhotos.length > 0 &&
      validationStatus.vehiclePhotos.isValid;

    if (isLicenseValid && isRCValid && isVehiclePhotosValid) {
      onComplete(documents);
    } else {
      // Show validation errors
      alert("Please upload all required documents correctly");
    }
  };

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
          <img
            src={URL.createObjectURL(file)}
            alt="Document preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center w-full h-40 bg-muted rounded-md">
        <p className="text-muted-foreground">{file.name}</p>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Document Verification
        </CardTitle>
        <CardDescription>
          Please upload clear images of your driving license, vehicle
          registration certificate, and vehicle photos
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Driving License */}
        <div className="space-y-2">
          <Label htmlFor="license">Driving License</Label>

          {documents.license ? (
            <div className="space-y-2">
              {renderFilePreview(documents.license)}

              <div className="flex items-center justify-between">
                <p className="text-sm">{documents.license.name}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile("license")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isUploading && documents.license ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Validating document...
                  </p>
                </div>
              ) : validationStatus.license.message ? (
                <Alert
                  variant={
                    validationStatus.license.isValid ? "default" : "destructive"
                  }
                >
                  {validationStatus.license.isValid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {validationStatus.license.message}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-md">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <Label
                  htmlFor="license-upload"
                  className="cursor-pointer text-sm text-primary hover:underline"
                >
                  Upload License
                </Label>
                <Input
                  id="license-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange("license", e)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Registration Certificate */}
        <div className="space-y-2">
          <Label htmlFor="rc">Registration Certificate (RC)</Label>

          {documents.registrationCertificate ? (
            <div className="space-y-2">
              {renderFilePreview(documents.registrationCertificate)}

              <div className="flex items-center justify-between">
                <p className="text-sm">
                  {documents.registrationCertificate.name}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile("registrationCertificate")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isUploading && documents.registrationCertificate ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Validating document...
                  </p>
                </div>
              ) : validationStatus.registrationCertificate.message ? (
                <Alert
                  variant={
                    validationStatus.registrationCertificate.isValid
                      ? "default"
                      : "destructive"
                  }
                >
                  {validationStatus.registrationCertificate.isValid ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {validationStatus.registrationCertificate.message}
                  </AlertDescription>
                </Alert>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-md">
              <div className="flex flex-col items-center space-y-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <Label
                  htmlFor="rc-upload"
                  className="cursor-pointer text-sm text-primary hover:underline"
                >
                  Upload RC
                </Label>
                <Input
                  id="rc-upload"
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) =>
                    handleFileChange("registrationCertificate", e)
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Photos */}
        <div className="space-y-2">
          <Label htmlFor="vehicle-photos">Vehicle Photos</Label>
          <p className="text-xs text-muted-foreground">
            Upload clear photos of your vehicle including number plate
          </p>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {documents.vehiclePhotos.map((photo, index) => (
              <div key={index} className="relative">
                {renderFilePreview(photo)}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-background/80"
                  onClick={() => removeFile("vehiclePhotos", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {documents.vehiclePhotos.length < 4 && (
              <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-muted-foreground/25 rounded-md">
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <Label
                    htmlFor="vehicle-photos-upload"
                    className="cursor-pointer text-xs text-primary hover:underline"
                  >
                    Add Photo
                  </Label>
                  <Input
                    id="vehicle-photos-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange("vehiclePhotos", e)}
                  />
                </div>
              </div>
            )}
          </div>

          {validationStatus.vehiclePhotos.message && (
            <Alert
              variant={
                validationStatus.vehiclePhotos.isValid
                  ? "default"
                  : "destructive"
              }
            >
              {validationStatus.vehiclePhotos.isValid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {validationStatus.vehiclePhotos.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            isUploading ||
            !validationStatus.license.isValid ||
            !validationStatus.registrationCertificate.isValid
          }
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DriverDocumentUpload;
