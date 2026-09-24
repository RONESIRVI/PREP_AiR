import React, { useState, useRef } from "react";
import {
  UploadCloud,
  ScanSearch,
  Layout,
  Image as ImageIcon,
  FileText,
  Download,
  Sparkles,
  Copy
} from "lucide-react";

export const SmartExtractorTab: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [ocrLang, setOcrLang] = useState("hin+eng");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImage(result);
        runActualOCR(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const preprocessImage = (imageSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(imageSrc);
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        
        // High contrast grayscale
        const factor = (259 * (128 + 255)) / (255 * (259 - 128));
        for (let i = 0; i < data.length; i += 4) {
          const avg = data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114;
          let val = factor * (avg - 128) + 128;
          val = val > 255 ? 255 : val < 0 ? 0 : val;
          data[i] = val; data[i+1] = val; data[i+2] = val;
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = imageSrc;
    });
  };

  const runActualOCR = async (imageSrc: string) => {
    setIsProcessing(true);
    setOcrProgress(0);
    setOcrStatus("Loading AI Engine...");
    try {
      const Tesseract = (await import("tesseract.js")).default;
      
      setOcrStatus("Enhancing Image...");
      const processedImageSrc = await preprocessImage(imageSrc);
      
      setOcrStatus("Initializing AI Model...");
      const { data } = await Tesseract.recognize(
        processedImageSrc,
        ocrLang,
        { 
          logger: (m: any) => {
            if (m.status === "recognizing text") {
              setOcrProgress(Math.round(m.progress * 100));
              setOcrStatus(`Recognizing Text: ${Math.round(m.progress * 100)}%`);
            } else {
              setOcrStatus(m.status);
            }
          } 
        }
      );
      setExtractedText(data.text);
    } catch (err) {
      console.error("OCR Failed:", err);
      setExtractedText("Failed to extract text. Please try a clearer image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const element = document.createElement("a");
    const file = new Blob([extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "extracted_notes.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 overflow-hidden pb-16 lg:pb-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
            <ScanSearch className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Smart OCR Scanner
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-wider font-bold">Pro</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Extract Hindi & English text from your notes automatically</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Image Workspace */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-slate-200 p-4 flex flex-col bg-slate-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Original Document
            </h3>
            <div className="flex items-center gap-2">
              <select 
                value={ocrLang} 
                onChange={(e) => setOcrLang(e.target.value)}
                className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1.5 rounded-lg outline-none cursor-pointer"
                disabled={isProcessing}
              >
                <option value="hin">Hindi Only</option>
                <option value="eng">English Only</option>
                <option value="hin+eng">Hindi + English</option>
              </select>
              {uploadedImage && !isProcessing && (
                <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">Upload New</button>
              )}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden relative shadow-sm flex items-center justify-center">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            {!uploadedImage ? (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-indigo-100 border-dashed">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Upload Scanned Notes</h3>
                <p className="text-sm text-slate-500 mb-4 max-w-xs mx-auto">Supports JPG, PNG images. Extracts Hindi & English text automatically.</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 mx-auto"
                >
                  <UploadCloud className="w-4 h-4" /> Browse Files
                </button>
              </div>
            ) : isProcessing ? (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-white">
                <div className="w-16 h-16 relative flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray={`${2 * Math.PI * 45}`} strokeDashoffset={`${2 * Math.PI * 45 * (1 - ocrProgress / 100)}`} className="transition-all duration-300 ease-out" />
                  </svg>
                  <span className="absolute text-sm font-bold">{ocrProgress}%</span>
                </div>
                <h3 className="text-lg font-bold flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-400" /> AI OCR Running...</h3>
                <p className="text-sm text-indigo-200 mt-1 uppercase tracking-widest">{ocrStatus}</p>
                <p className="text-xs text-slate-400 mt-4 max-w-xs text-center">(Downloading Hindi Language Models on first run may take up to 20 seconds)</p>
              </div>
            ) : (
              <div className="relative w-full h-full p-4 overflow-auto flex justify-center items-center">
                <img src={uploadedImage} alt="Scanned Document" className="max-w-full max-h-full object-contain shadow-sm border border-slate-200 rounded-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Extraction Results */}
        <div className="w-full lg:w-96 flex flex-col bg-white shrink-0">
          <div className="flex border-b border-slate-200 shrink-0 bg-indigo-50/50">
            <div className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-indigo-600 border-b-2 border-indigo-600">
              <FileText className="w-4 h-4" /> OCR Extracted Text
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30">
            {!uploadedImage ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Layout className="w-10 h-10 mb-2 opacity-20" />
                <p className="text-sm font-medium">Upload an image to see text here</p>
              </div>
            ) : isProcessing ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <div className="space-y-2 w-full max-w-[200px]">
                  <div className="h-2 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-2 bg-slate-200 rounded animate-pulse w-5/6"></div>
                  <div className="h-2 bg-slate-200 rounded animate-pulse w-4/6"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 h-full flex flex-col">
                <textarea 
                  className="w-full flex-1 min-h-[350px] lg:min-h-0 bg-white border border-slate-200 rounded-xl p-3 text-base sm:text-lg text-slate-800 font-medium resize-none focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                  value={extractedText}
                  onChange={(e) => setExtractedText(e.target.value)}
                  placeholder="Extracted text will appear here..."
                />
                <div className="grid grid-cols-2 gap-2 shrink-0">
                  <button 
                    onClick={() => navigator.clipboard.writeText(extractedText)}
                    className="py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded-xl font-bold text-sm transition-colors active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-4 h-4" /> Copy Text
                  </button>
                  <button 
                    onClick={handleDownloadTxt}
                    className="py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold text-sm transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Save .TXT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
