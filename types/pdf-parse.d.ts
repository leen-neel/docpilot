// types/pdf-parse.d.ts

declare module "pdf-parse/lib/pdf-parse.js" {
  interface PDFInfo {
    PDFFormatVersion: string;
    IsAcroFormPresent: boolean;
    IsXFAPresent: boolean;
    Title?: string;
    Author?: string;
    Subject?: string;
    Keywords?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
    [key: string]: unknown;
  }

  interface PDFMetadata {
    metadata: string;
    metadataRaw: unknown;
  }

  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata: PDFMetadata;
    version: string;
  }

  export default function pdfParse(
    dataBuffer: Buffer,
    options?: {
      pagerender?: (pageData: {
        num: number;
        textContent: unknown;
      }) => string | Promise<string>;
      max?: number;
      version?: string;
      disableStream?: boolean;
    }
  ): Promise<PDFData>;
}
