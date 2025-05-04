"use client";

import { useDoc } from "@/app/context/DocContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

function Page() {
  const doc = useDoc();

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about {doc?.name}
        </p>
      </div>

      <Card className="border rounded-xl shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {doc?.faqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{faq.question}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>
    </div>
  );
}

export default Page;
