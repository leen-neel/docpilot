"use client";

import FileUpload from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const HomePage = () => {
  const [fileContents, setfileContents] = useState("");

  const handleFileUpload = async (files: File[]) => {
    const file = files[0];

    if (file.type !== "application/pdf") {
      const cont: string = await file.text();
      setfileContents(cont.replace(/[\n\s]+/g, ""));
      console.log(cont.replace(/[\n\s]+/g, ""));

      return;
    }

    // Get array buffer of the file
    const arrayBuffer = await file.arrayBuffer();

    // TODO: Send it to the API route
    const res = await fetch("/api/parse-pdf", {
      method: "POST",
      body: arrayBuffer,
      headers: {
        "Content-Type": "application/pdf", // optional, but helpful
      },
    });

    const json = await res.json();
    setfileContents(json.text);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Your API Documentation</h1>
      <FileUpload onFileUpload={handleFileUpload} />

      {fileContents !== "" && <Button className="mt-5">Process</Button>}
    </main>
  );
};

export default HomePage;
