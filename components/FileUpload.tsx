"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type FileUploadProps = {
  onFileUpload: (files: File[]) => void;
};

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "application/json": [".json"],
        "application/x-yaml": [".yaml", ".yml"],
        "text/plain": [".txt"],
        "application/pdf": [".pdf"],
      },
      multiple: false,
    });

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed border-gray-300 p-10 rounded-lg text-center cursor-pointer hover:border-primary transition"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the file here ...</p>
      ) : (
        <p>Drag & drop your API doc here, or click to select a file</p>
      )}
      {acceptedFiles.length > 0 && (
        <ul className="mt-4 text-sm text-gray-300">
          {acceptedFiles.map((file: File) => (
            <li key={file.name}>
              {file.name} - {(file.size / 1024).toFixed(2)} KB
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
