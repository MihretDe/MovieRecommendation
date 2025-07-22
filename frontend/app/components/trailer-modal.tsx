"use client";

import { useState } from "react";
import { X, Play } from "lucide-react";

interface TrailerModalProps {
  videoId: string;
  movieTitle: string;
}

const TrailerModal = ({ videoId, movieTitle }: TrailerModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // If videoId is already a full URL, use as is; otherwise, build embed URL
  const embedUrl = videoId.startsWith("http")
    ? videoId
    : `https://www.youtube.com/embed/${videoId}`;

  return (
    <>
      {/* Trailer Button */}
      <button
        onClick={openModal}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg "
      >
        <Play className="w-5 h-5" />
        Watch Trailer
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative w-full max-w-4xl bg-gray-900 rounded-lg overflow-hidden">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Video Container */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={embedUrl}
                title={`${movieTitle} - Official Trailer`}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrailerModal;
