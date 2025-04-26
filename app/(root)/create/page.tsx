"use client";

import FileUpload from "@/components/FileUpload";

const HomePage = () => {
  const handleFileUpload = async (files: File[]) => {
    const file = files[0];

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    // Get array buffer of the file
    const arrayBuffer = await file.arrayBuffer();

    // TODO: Send it to the API route
    const res = await fetch("/api/pdf", {
      method: "POST",
      body: arrayBuffer,
      headers: {
        "Content-Type": "application/pdf", // optional, but helpful
      },
    });

    const json = await res.json();
    console.log("Extracted text:", json.text);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Upload Your API Documentation</h1>
      <FileUpload onFileUpload={handleFileUpload} />
    </main>
  );
};

export default HomePage;
