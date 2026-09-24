import React, { useState, useEffect } from "react";
import { FileText, RefreshCw, FolderTree, AlertCircle, X, Maximize2, Folder, ChevronRight, CornerUpLeft } from "lucide-react";

// The hardcoded Live Link for PDFs
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytEMFu6Fgw_rJZ0mmJMAXkPyj3m7MwQ-bBS_RsxDNLBsLb23zt0rW3xZq9JaqtSfYJ/exec";
const MASTER_FOLDER_ID = "1R0BL-zLX4lcaYwtlJxX46OENzhWv6yNN";

interface DriveDocument {
  id: string;
  name: string;
}

interface DriveFolder {
  id: string;
  name: string;
  folders: DriveFolder[];
  files: DriveDocument[];
}

export const TopperCopiesTab: React.FC = () => {
  const [rootFolder, setRootFolder] = useState<DriveFolder | null>(null);
  const [currentPath, setCurrentPath] = useState<DriveFolder[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedPdfId, setSelectedPdfId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SCRIPT_URL, { redirect: 'follow' });
      const result = await res.json();
      
      if (result.status === "error") {
        throw new Error(result.message || "Failed to load data from script.");
      }
      
      const tree = result.data;
      if (tree) {
        setRootFolder(tree);
        // Reset path to root
        setCurrentPath([tree]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch PDFs. Please check Script Link and Folder Permissions.");
    } finally {
      setLoading(false);
    }
  };

  const getPdfEmbedUrl = (fileId: string) => {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  // The current active folder we are looking at
  const currentFolder = currentPath[currentPath.length - 1];

  // Navigate deeper into a folder
  const handleOpenFolder = (folder: DriveFolder) => {
    setCurrentPath(prev => [...prev, folder]);
  };

  // Navigate up to a specific breadcrumb
  const handleCrumbClick = (index: number) => {
    setCurrentPath(prev => prev.slice(0, index + 1));
  };

  // Navigate up one level
  const handleGoBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 border-2 border-slate-200 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Topper Copies (PDFs)
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Live Sync Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href={`https://drive.google.com/drive/folders/${MASTER_FOLDER_ID}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 md:flex-none px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <FolderTree className="w-4 h-4" />
            Open Drive Folder
          </a>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-2"
            title="Refresh Sync"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Now
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Sync Error</h4>
            <p className="text-xs text-rose-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* File Explorer UI */}
      {!error && rootFolder && currentFolder && (
        <div className="bg-white border-2 border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          
          {/* Breadcrumb Bar */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {currentPath.length > 1 && (
              <button 
                onClick={handleGoBack}
                className="p-1.5 mr-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Go Back"
              >
                <CornerUpLeft className="w-4 h-4" />
              </button>
            )}
            
            {currentPath.map((crumb, index) => {
              const isLast = index === currentPath.length - 1;
              return (
                <div key={crumb.id} className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleCrumbClick(index)}
                    className={`text-sm font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                      isLast 
                        ? "text-indigo-700 bg-indigo-50" 
                        : "text-slate-600 hover:bg-slate-200/50"
                    }`}
                  >
                    {index === 0 ? "Root (All Copies)" : crumb.name}
                  </button>
                  {!isLast && <ChevronRight className="w-4 h-4 text-slate-300" />}
                </div>
              );
            })}
          </div>

          {/* Explorer Content */}
          <div className="p-5 min-h-[300px]">
            {loading ? (
              <div className="py-20 flex justify-center items-center">
                <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Empty State */}
                {currentFolder.folders.length === 0 && currentFolder.files.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Folder className="w-8 h-8" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-700">This folder is empty</h3>
                  </div>
                )}

                {/* Sub-Folders Grid */}
                {currentFolder.folders.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Folders</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {currentFolder.folders.map(folder => (
                        <button
                          key={folder.id}
                          onClick={() => handleOpenFolder(folder)}
                          className="flex items-center gap-3 p-3 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-xl transition-all text-left group cursor-pointer"
                        >
                          <Folder className="w-6 h-6 text-indigo-400 group-hover:text-indigo-600 fill-indigo-50 group-hover:fill-indigo-100 transition-colors shrink-0" />
                          <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-900 truncate">
                            {folder.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF Files Grid */}
                {currentFolder.files.length > 0 && (
                  <div>
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3 mt-6">PDF Files</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {currentFolder.files.map(file => (
                        <button
                          key={file.id}
                          onClick={() => setSelectedPdfId(file.id)}
                          className="flex flex-col items-center gap-3 p-4 bg-white border border-slate-200 hover:border-rose-300 hover:shadow-lg rounded-2xl transition-all group cursor-pointer text-center relative"
                        >
                          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 group-hover:text-rose-900 line-clamp-3">
                            {file.name.replace(/\.[^/.]+$/, "")}
                          </span>
                          
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity">
                            <Maximize2 className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Screen PDF Lightbox */}
      {selectedPdfId && (
        <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setSelectedPdfId(null)}
              className="text-white/50 bg-black/20 hover:bg-black/40 hover:text-white px-4 py-2 rounded-xl backdrop-blur-md transition-all cursor-pointer font-bold flex items-center gap-2"
            >
              <X className="w-5 h-5" /> Close PDF
            </button>
          </div>
          <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 pt-0">
            <iframe 
              src={getPdfEmbedUrl(selectedPdfId)}
              className="w-full h-full rounded-2xl shadow-2xl bg-white"
              allow="autoplay"
              title="PDF Viewer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};
