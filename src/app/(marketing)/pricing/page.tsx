import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Get started for free",
    features: ["Up to 3 projects", "Basic analytics", "Community support"],
  },
  {
    name: "Pro",
    price: "$19",
    description: "For growing teams",
    features: ["Unlimited projects", "Advanced analytics", "Priority support", "Custom domains"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Everything in Pro", "SSO", "Dedicated support", "SLA", "Custom integrations"],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold">Pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that works for you.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={plan.popular ? "border-primary shadow-lg" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {plan.popular && <Badge>Popular</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <p className="mt-2 text-3xl font-bold">
                {plan.price}
                {plan.price !== "Custom" && (
                  <span className="text-sm font-normal text-muted-foreground">/month</span>
                )}
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant={plan.popular ? "default" : "outline"}>
                {plan.price === "Custom" ? "Contact us" : "Get started"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
