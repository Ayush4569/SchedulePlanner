import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const Upload: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const { setIsLoading, setPlanner } = useStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      const errorMsg = 'Please upload a valid PDF file.';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const uploadPromise = axios.post(`${apiUrl}/api/planner/generate`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    toast.promise(
      uploadPromise,
      {
        loading: 'Parsing PDF and generating your optimized weekly planner...',
        success: (response) => {
          setPlanner(response.data.planner);
          setIsLoading(false);
          return 'Weekly planner generated successfully!';
        },
        error: (err) => {
          setIsLoading(false);
          const errMsg = err.response?.data?.error || err.message || 'Failed to generate planner. Ensure backend is running and Gemini API key is configured.';
          setError(errMsg);
          return `Error: ${errMsg}`;
        }
      },
      {
        style: {
          minWidth: '350px',
        },
      }
    );
  }, [setIsLoading, setPlanner]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Your Perfect Schedule</h2>
        <p className="text-slate-500">Upload a PDF containing your semester subjects (ranked by priority) and your daily routine.</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-indigo-100 rounded-full">
            <UploadCloud className="w-10 h-10 text-indigo-600" />
          </div>
          {isDragActive ? (
            <p className="text-lg font-medium text-indigo-600">Drop the PDF here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium text-slate-700">Drag & drop your PDF here</p>
              <p className="text-sm text-slate-500 mt-1">or click to select a file</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-start space-x-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
