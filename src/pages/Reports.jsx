import { useState } from "react";

const MAX_MB = 5;

export default function Reports() {
  const [file, setFile] = useState(null);
  const [reportText, setReportText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pick = (e) => {
    const selected = e.target.files?.[0];

    setFile(null);
    setReportText("");
    setError("");

    if (!selected) return;

    if (
      selected.type !== "application/pdf" &&
      !selected.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      return;
    }

    if (selected.size > MAX_MB * 1024 * 1024) {
      setError("PDF must be smaller than 5 MB.");
      return;
    }

    setFile(selected);
  };

  const analyzeReport = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setReportText("");

    try {
      const pdfjs = window.pdfjsLib;

      if (!pdfjs) {
        throw new Error("PDF reader library load nahi hui.");
      }

      pdfjs.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

      const buffer = await file.arrayBuffer();

      const pdf = await pdfjs.getDocument({
        data: new Uint8Array(buffer)
      }).promise;

      let extracted = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        const text = content.items
          .map((item) => item.str)
          .join(" ");

        extracted += `\n\nPage ${i}\n${text}`;
      }

      if (!extracted.trim()) {
        setError(
          "PDF mein readable text nahi mila. Scanned PDF ke liye OCR chahiye."
        );
      } else {
        setReportText(extracted);
      }

      await pdf.destroy();

    } catch (err) {
      console.error(err);
      setError(err.message || "PDF read nahi ho paayi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>📄 Medical Report Analyzer</h2>

        <p>Upload your medical report PDF.</p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={pick}
        />

        {file && <p>Selected: {file.name}</p>}

        <button
          onClick={analyzeReport}
          disabled={!file || loading}
        >
          {loading ? "Reading PDF..." : "Analyze Report"}
        </button>

        {error && <p className="error">{error}</p>}
      </div>

      {reportText && (
        <div className="card">
          <h3>✅ Extracted Report Text</h3>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              lineHeight: 1.7
            }}
          >
            {reportText}
          </pre>

          <p className="muted">
            This is extracted text only, not a medical diagnosis.
            Please verify values with your original report.
          </p>
        </div>
      )}
    </div>
  );
}

    </div>
  );
}
