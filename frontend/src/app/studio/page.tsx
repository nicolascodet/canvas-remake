'use client';

import { useState } from 'react';
import { VideoCameraIcon, StopIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function StudioPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRecordClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Studio</h1>
            <p className="text-gray-600">Record and edit your videos</p>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-lg">
                <p className="text-xl font-bold text-gray-800 mb-4">
                  Who TF Uses This?
                </p>
                <p className="text-gray-600 mb-4">
                  Never even knew this existed... Get back to real work!
                </p>
                <p className="text-sm text-gray-500 italic">
                  (Seriously, has anyone ever clicked this button before?)
                </p>
              </div>
            </div>

            <div className="relative z-10">
              {showTooltip && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
                  Nice try! But why though? 🤔
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRecordClick}
                  className={`p-4 rounded-full ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white transition-colors`}
                >
                  {isRecording ? (
                    <StopIcon className="h-8 w-8" />
                  ) : (
                    <VideoCameraIcon className="h-8 w-8" />
                  )}
                </button>
                <button 
                  onClick={handleRecordClick}
                  className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <ArrowPathIcon className="h-8 w-8 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Pro tip: Just use Zoom recording instead... or better yet, get back to procrastinating properly!</p>
          </div>
        </div>
      </div>
    </div>
  );
} 