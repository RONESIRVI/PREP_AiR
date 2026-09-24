import React, { useState, useEffect } from "react";
import { Image as ImageIcon, ExternalLink, RefreshCw, FolderTree, AlertCircle, X, ZoomIn } from "lucide-react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwJXLIrt0DGiu8FGfmulRyvJPWK6agcu0TPeCII0Ee9d64stYjpNbiqsji-ESf3NgWg/exec";
const MASTER_FOLDER_ID = "1TqXpQc1MPN5dgw41-X1rODhT3l71TeNB";

interface DriveImage {
  id: string;
  name: string;
}

interface TopicFolder {
  id: string;
  topic: string;
  images: DriveImage[];
}

export const MindmapsGalleryTab: React.FC = () => {
  const [topics, setTopics] = useState<TopicFolder[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Added redirect: 'follow' to ensure Google Apps Script 302 redirects are handled correctly
      const res = await fetch(SCRIPT_URL, { redirect: 'follow' });
      const result = await res.json();
      
      if (result.status === "error") {
        throw new Error(result.message || "Failed to load data from script.");
      }
      
      const fetchedTopics = result.data || [];
      setTopics(fetchedTopics);
      
      // Auto-select first topic if none is selected and topics exist
      if (fetchedTopics.length > 0 && !selectedTopicId) {
        setSelectedTopicId(fetchedTopics[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch mindmaps. There might be a connection issue or the folder is empty.");
    } finally {
      setLoading(false);
    }
  };

  const getDirectImageUrl = (fileId: string) => {
    // Using thumbnail endpoint which is much more reliable for embedding public Drive images
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  };

  const currentTopic = topics.find(t => t.id === selectedTopicId);

  // -------------------------------------------------------------
  // GALLERY SCREEN
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 border-2 border-slate-200 rounded-3xl shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-indigo-600" />
            Mindmaps Gallery
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

      {/* Topics (Subfolders) Tabs */}
      {!error && topics.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {topics.map(topic => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopicId(topic.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedTopicId === topic.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {topic.topic} ({topic.images.length})
            </button>
          ))}
        </div>
      )}

      {/* Images Grid */}
      {!error && (
        loading ? (
          <div className="py-20 flex justify-center items-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full"></div>
          </div>
        ) : (!currentTopic || currentTopic.images.length === 0) ? (
          <div className="bg-white border-2 border-slate-200 rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No Images in this Topic</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">
              Upload images inside this subfolder in your Google Drive and hit refresh.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {currentTopic.images.map((file) => (
              <div 
                key={file.id} 
                className="break-inside-avoid bg-white rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 group relative overflow-hidden flex flex-col"
              >
                {/* Image Thumbnail */}
                <div 
                  className="relative aspect-auto rounded-2xl overflow-hidden cursor-zoom-in bg-slate-100 flex-1 min-h-[150px]"
                  onClick={() => setSelectedImageId(file.id)}
                >
                  <img 
                    src={getDirectImageUrl(file.id)} 
                    alt={file.name}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400/f8fafc/94a3b8?text=Loading+Failed";
                    }}
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-xl">
                      <ZoomIn className="w-5 h-5 text-slate-800" />
                    </div>
                  </div>
                </div>

                {/* Card Title */}
                <div className="p-3 pt-4">
                  <h3 className="text-xs font-bold text-slate-800 leading-snug break-words">
                    {file.name.replace(/\.[^/.]+$/, "")} {/* Remove extension */}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Full Screen Lightbox */}
      {selectedImageId && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setSelectedImageId(null)}
        >
          <img 
            src={getDirectImageUrl(selectedImageId)} 
            alt="Expanded view" 
            className="max-w-full max-h-[95vh] object-contain rounded-xl shadow-2xl"
          />
          <div className="absolute top-4 right-4 text-white/50 bg-black/20 hover:bg-black/40 hover:text-white p-2 rounded-full backdrop-blur-md transition-all cursor-pointer">
            <X className="w-6 h-6" />
          </div>
          <div className="absolute bottom-6 flex justify-center w-full pointer-events-none">
            <div className="bg-black/40 backdrop-blur-md text-white/90 text-[10px] font-bold px-4 py-2 rounded-full tracking-widest uppercase shadow-xl">
              Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
