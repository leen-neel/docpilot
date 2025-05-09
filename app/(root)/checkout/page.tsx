"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CountryDropdown, Country } from "@/components/ui/country-dropdown";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, Shield, Zap, Clock, CreditCard } from "lucide-react";

function Page() {
  const { user } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get("plan");
  const [formData, setFormData] = useState({
    address: "",
    country: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleCountry = (country: Country) => {
    setFormData((prev) => ({ ...prev, country: country.alpha2 }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePayment = async () => {
    const res = await fetch("/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData,
        planType,
        email: user?.emailAddresses[0].emailAddress,
        name: user?.fullName,
      }),
    });

    const json = await res.json();
    router.push(json.url);
  };

  if (!planType || !["Takeoff", "Cruise"].includes(planType)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Invalid plan type</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Side - Plan Info */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-black overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
                <CardContent className="p-8 relative">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">
                        {planType} Plan
                      </h1>
                      <p className="text-lg opacity-90">
                        Complete your purchase to get started with your{" "}
                        {planType.toLowerCase()} plan.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 group">
                        <div className="p-2 rounded-full bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span>Premium Features</span>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <div className="p-2 rounded-full bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                          <Shield className="w-5 h-5" />
                        </div>
                        <span>24/7 Support</span>
                      </div>
                      <div className="flex items-center space-x-3 group">
                        <div className="p-2 rounded-full bg-primary-foreground/10 group-hover:bg-primary-foreground/20 transition-colors">
                          <Clock className="w-5 h-5" />
                        </div>
                        <span>Instant Access</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-primary-foreground/20">
                      <div className="flex items-center space-x-2 text-sm">
                        <Shield className="w-4 h-4" />
                        <span>Secure Payment</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <CreditCard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Secure Payment</h3>
                      <p className="text-sm text-muted-foreground">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="transform transition-all duration-300 hover:scale-[1.02]">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Complete Your Purchase
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Address"
                    id="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-background/50 transition-colors focus:bg-background"
                  />
                  <CountryDropdown onChange={handleCountry} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="City"
                      id="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-background/50 transition-colors focus:bg-background"
                    />
                    <Input
                      type="text"
                      placeholder="State"
                      id="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="bg-background/50 transition-colors focus:bg-background"
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder="Zipcode"
                    id="zipcode"
                    value={formData.zipcode}
                    onChange={handleInputChange}
                    className="bg-background/50 transition-colors focus:bg-background"
                  />
                </div>

                <Button
                  className="w-full h-12 text-lg font-medium transition-all duration-300 hover:scale-[1.02]"
                  onClick={handlePayment}
                >
                  Proceed to Payment
                </Button>

                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Protected by SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
