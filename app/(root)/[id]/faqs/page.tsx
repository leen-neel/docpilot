"use client";

import { useDoc } from "@/app/context/DocContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function Page() {
  const doc = useDoc();

  return (
    <>
      <main>
        <div>
          <h2 className="text-4xl font-bold">FAQs</h2>

          <p className="mt-3">
            Here are some frequently asked questions related to {doc?.name}{" "}
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10">
          {doc?.faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="font-bold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
}

export default Page;
