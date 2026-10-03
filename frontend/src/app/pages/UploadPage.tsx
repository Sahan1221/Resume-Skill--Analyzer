import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, FileText, Loader2 } from "lucide-react";

export function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type === "application/pdf") {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      navigate("/validate/1");
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-md border border-border p-8">
          <h2 className="mb-6">Upload CV</h2>

          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-foreground">Select CV File</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-3 px-4 py-3 bg-input-background border-2 border-border rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground flex-1">
                  {selectedFile ? selectedFile.name : "No file selected"}
                </span>
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || isAnalyzing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shadow-md"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing CV...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload & Analyze
                </>
              )}
            </button>

            {isAnalyzing && (
              <div className="bg-accent border border-accent-foreground/20 rounded-lg p-4">
                <p className="text-accent-foreground">
                  AI is extracting information from the CV. This may take a few moments...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-md border border-border p-8">
          <h3 className="mb-4">CV Preview</h3>

          {previewUrl ? (
            <div className="bg-muted rounded-lg overflow-hidden border border-border">
              <iframe
                src={previewUrl}
                className="w-full h-[600px]"
                title="CV Preview"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[600px] bg-muted rounded-lg border-2 border-dashed border-border">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Upload a file to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
