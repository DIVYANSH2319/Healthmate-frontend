import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

import "../styles.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_MB = 5;

export default function Reports() {
  const [file, setFile] = useState(null);
  const [reportText, setReportText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  // Select PDF
  const pick = (e) => {
    const selectedFile = e.target.files?.[0];

    setFile(null);
    setReportText("");
    setError("");
    setPageCount(0);

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > MAX_MB * 1024 * 1024) {
      setError(`PDF size must be less than ${MAX_MB} MB.`);
      return;
    }

    setFile(selectedFile);
  };

  // Extract actual PDF text
  const analyzeReport = async () => {
    if (!file) {
      setError("Please select a PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setReportText("");
    setPageCount(0);

    let pdf;

    try {
      const buffer = await file.arrayBuffer();

      // Verify PDF signature
      const signature = new TextDecoder().decode(
        new Uint8Array(buffer).slice(0, 5)
      );

      if (signature !== "%PDF-") {
        throw new Error("Invalid PDF file.");
      }

      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer)
      });

      pdf = await loadingTask.promise;

      setPageCount(pdf.numPages);

      let extractedText = "";

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        const pageText = content.items
          .filter((item) => "str" in item)
          .map((item) => item.str)
          .join(" ");

        extractedText +=
          `\n\n--- Page ${pageNumber} ---\n\n${pageText}`;
      }

      if (!extractedText.trim()) {
        setError(
          "PDF mein readable text nahi mila. Ho sakta hai ye scanned PDF ho. Iske liye OCR support chahiye."
        );
        return;
      }

      setReportText(extractedText.trim());

    } catch (err) {
      console.error("PDF extraction error:", err);

      setError(
        err.message || "PDF read nahi ho paayi. Please another PDF try karo."
      );
    } finally {
      if (pdf) {
        await pdf.destroy();
      }

      setLoading(false);
    }
  };

  // Reset
  const resetReport = () => {
    setFile(null);
    setReportText("");
    setError("");
    setPageCount(0);
  };

  return (
    <div className="reports-page">

      <div className="card">
        <h2>📄 Medical Report Analyzer</h2>

        <p className="muted">
          Upload your medical report in PDF format.
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={pick}
        />

        {file && (
          <p>
            📎 Selected: <strong>{file.name}</strong>
          </p>
        )}

        <div className="row">
          <button
            onClick={analyzeReport}
            disabled={!file || loading}
          >
            {loading ? "Reading PDF..." : "Extract Report"}
          </button>

          <button
            type="button"
            onClick={resetReport}
          >
            Reset
          </button>
        </div>

        {loading && (
          <p className="muted">
            Please wait. Reading your PDF...
          </p>
        )}

        {error && (
          <p className="error">{error}</p>
        )}
      </div>

      {reportText && (
        <>
          <div className="card">
            <h3>✅ PDF Successfully Read</h3>

            <p>
              Total Pages: <strong>{pageCount}</strong>
            </p>

            <p className="muted">
              The following text was extracted directly from your PDF.
            </p>
          </div>

          <div className="card">
            <h3>📋 Extracted Report Text</h3>

            <pre
              style={{
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                lineHeight: "1.7",
                fontFamily: "inherit"
              }}
            >
              {reportText}
            </pre>
          </div>

          <div className="card">
            <h3>⚠️ Medical Information Notice</h3>

            <p>
              This is extracted text, not an AI medical analysis.
              No test values or diagnoses have been generated.
            </p>

            <p className="muted">
              Please verify the extracted information against
              your original medical report and consult a doctor
              for medical interpretation.
            </p>
          </div>
        </>
      )}

    </div>
  );
}
