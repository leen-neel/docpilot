"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

function PricingCard({
  title,
  price,
  description,
  features,
  isPopular = false,
  planType,
}: {
  title: string;
  price: string;
  description: string;
  features: { text: string; included: boolean }[];
  isPopular?: boolean;
  planType: string;
}) {
  const router = useRouter();

  return (
    <Card
      className={`relative flex flex-col ${isPopular ? "border-primary" : ""}`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-lg mt-2">
          {description}
        </CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Free" && (
            <span className="text-muted-foreground ml-2">/month</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              {feature.included ? (
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              )}
              <span className={feature.included ? "" : "text-muted-foreground"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          onClick={() => router.push(`/checkout?plan=${planType}`)}
        >
          {price === "Free" ? "Get Started" : "Subscribe Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function SubscribePage() {
  const plans = [
    {
      title: "Runway",
      price: "Free",
      description: "Start your journey – test the basics",
      planType: "Runway",
      features: [
        { text: "1 API doc project", included: true },
        { text: "Interactive API console", included: true },
        { text: "Mock server (rate-limited)", included: true },
        { text: "Public docs only", included: true },
        { text: '"Powered by DocPilot" badge', included: true },
        { text: "No login required", included: true },
        { text: "Custom branding", included: false },
        { text: "Private links", included: false },
        { text: "Team access", included: false },
      ],
    },
    {
      title: "Takeoff",
      price: "$19",
      description: "Lift off with full control and advanced features",
      planType: "Takeoff",
      isPopular: true,
      features: [
        { text: "Up to 3 API doc projects", included: true },
        { text: "API console (full access)", included: true },
        { text: "Mock server (standard limits)", included: true },
        { text: "Auto-generated SDK wrappers", included: true },
        { text: "FAQ & changelog sections", included: true },
        { text: "Custom branding", included: true },
        { text: "Shareable, private links", included: true },
        { text: "Email support", included: true },
        { text: "Team access", included: false },
      ],
    },
    {
      title: "Cruise",
      price: "$79",
      description: "Fly smoothly with team collaboration and scale",
      planType: "Cruise",
      features: [
        { text: "Unlimited API doc projects", included: true },
        { text: "All features from Takeoff", included: true },
        { text: "Team access (up to 10 users)", included: true },
        { text: "Priority support", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Custom domain", included: true },
        { text: "API key management", included: true },
        { text: "SLA guarantee", included: true },
        { text: "Dedicated account manager", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include our core
            features with different levels of access and support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              isPopular={plan.isPopular}
              planType={plan.planType}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-2">
                Need a custom plan?
              </h3>
              <p className="text-muted-foreground mb-4">
                Contact us for enterprise solutions and custom requirements.
              </p>
              <Button variant="outline">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
