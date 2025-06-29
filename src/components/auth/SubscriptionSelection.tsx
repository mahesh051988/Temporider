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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  vehicleType: "bike" | "auto" | "mini" | "luxury";
  popular?: boolean;
}

interface SubscriptionSelectionProps {
  onSubscribe?: (plan: SubscriptionPlan) => void;
  onCancel?: () => void;
}

const SubscriptionSelection = ({
  onSubscribe = () => {},
  onCancel = () => {},
}: SubscriptionSelectionProps) => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<
    "bike" | "auto" | "mini" | "luxury"
  >("bike");
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    null,
  );
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);

  const subscriptionPlans: SubscriptionPlan[] = [
    {
      id: "bike-basic",
      name: "Basic",
      price: 499,
      duration: "month",
      features: [
        "Access to bike rides",
        "Standard commission rate",
        "Basic driver support",
      ],
      vehicleType: "bike",
    },
    {
      id: "bike-pro",
      name: "Pro",
      price: 999,
      duration: "month",
      features: [
        "Access to bike rides",
        "Reduced commission rate",
        "Priority driver support",
        "Featured driver profile",
      ],
      vehicleType: "bike",
      popular: true,
    },
    {
      id: "auto-basic",
      name: "Basic",
      price: 799,
      duration: "month",
      features: [
        "Access to auto rides",
        "Standard commission rate",
        "Basic driver support",
      ],
      vehicleType: "auto",
    },
    {
      id: "auto-pro",
      name: "Pro",
      price: 1499,
      duration: "month",
      features: [
        "Access to auto rides",
        "Reduced commission rate",
        "Priority driver support",
        "Featured driver profile",
      ],
      vehicleType: "auto",
      popular: true,
    },
    {
      id: "mini-basic",
      name: "Basic",
      price: 1299,
      duration: "month",
      features: [
        "Access to mini car rides",
        "Standard commission rate",
        "Basic driver support",
      ],
      vehicleType: "mini",
    },
    {
      id: "mini-pro",
      name: "Pro",
      price: 2499,
      duration: "month",
      features: [
        "Access to mini car rides",
        "Reduced commission rate",
        "Priority driver support",
        "Featured driver profile",
      ],
      vehicleType: "mini",
      popular: true,
    },
    {
      id: "luxury-basic",
      name: "Basic",
      price: 2999,
      duration: "month",
      features: [
        "Access to luxury car rides",
        "Standard commission rate",
        "Premium driver support",
      ],
      vehicleType: "luxury",
    },
    {
      id: "luxury-pro",
      name: "Pro",
      price: 4999,
      duration: "month",
      features: [
        "Access to luxury car rides",
        "Lowest commission rate",
        "VIP driver support",
        "Featured driver profile",
        "Priority ride matching",
      ],
      vehicleType: "luxury",
      popular: true,
    },
  ];

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPaymentDialogOpen(true);
  };

  const handlePayment = () => {
    if (selectedPlan) {
      onSubscribe(selectedPlan);
      setPaymentDialogOpen(false);
    }
  };

  const filteredPlans = subscriptionPlans.filter(
    (plan) => plan.vehicleType === selectedVehicleType,
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-background">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          Choose Your Subscription Plan
        </h2>
        <p className="text-muted-foreground">
          Select a vehicle type and subscription plan to start earning
        </p>
      </div>

      <Tabs
        defaultValue="bike"
        value={selectedVehicleType}
        onValueChange={(value) => setSelectedVehicleType(value as any)}
      >
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="bike">Bike</TabsTrigger>
          <TabsTrigger value="auto">Auto</TabsTrigger>
          <TabsTrigger value="mini">Mini Car</TabsTrigger>
          <TabsTrigger value="luxury">Luxury Car</TabsTrigger>
        </TabsList>

        {["bike", "auto", "mini", "luxury"].map((vehicleType) => (
          <TabsContent
            key={vehicleType}
            value={vehicleType}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              {filteredPlans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`relative ${plan.popular ? "border-primary" : ""}`}
                >
                  {plan.popular && (
                    <Badge
                      className="absolute top-4 right-4"
                      variant="secondary"
                    >
                      Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      For {selectedVehicleType} drivers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground">
                        /{plan.duration}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="h-4 w-4 mr-2 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleSelectPlan(plan)}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Subscribe Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Subscription</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <span>
                  You are subscribing to the {selectedPlan.name} plan for{" "}
                  {selectedPlan.vehicleType} at ₹{selectedPlan.price}/
                  {selectedPlan.duration}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handlePayment} className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" /> Pay Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionSelection;
