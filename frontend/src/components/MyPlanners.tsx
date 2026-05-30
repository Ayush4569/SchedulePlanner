import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Calendar, Loader2, Download, ChevronRight, AlertCircle, Clock, FileText, ArrowLeft } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Task {
  timeBlock: string;
  activity: string;
  type: string;
  priority?: 'hard' | 'medium' | 'easy' | 'none';
}

interface DayPlan {
  day: string;
  tasks: Task[];
}

interface Planner {
  _id: string;
  weeklyPlan: DayPlan[];
  notes?: string;
  createdAt: string;
}

export const MyPlanners: React.FC = () => {
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [selectedPlanner, setSelectedPlanner] = useState<Planner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);

  const fetchPlanners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/api/planner`);
      const data = response.data.planners || [];
      setPlanners(data);
      if (data.length > 0) {
        setSelectedPlanner(data[0]);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'Failed to fetch your planners.';
      setError(errMsg);
      toast.error(`Error fetching planners: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPlanners();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `My_Weekly_Study_Planner_${selectedPlanner?._id || ''}`,
  });

  const handleDownload = () => {
    toast.success('Downloading your planner PDF...', {
      icon: '📥',
    });
    handlePrint();
  };

  const getTaskColor = (task: Task) => {
    if (task.type === 'study') {
      if (task.priority === 'hard') return 'bg-red-50 border-red-200 text-red-800';
      if (task.priority === 'medium') return 'bg-orange-50 border-orange-200 text-orange-800';
      return 'bg-green-50 border-green-200 text-green-800';
    }
    if (task.type === 'break') return 'bg-blue-50 border-blue-100 text-blue-700';
    if (task.type === 'routine') return 'bg-slate-50 border-slate-200 text-slate-700';
    return 'bg-gray-50 border-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-lg font-medium text-slate-600">Loading your history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center">
        <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Failed to Load Planners</h3>
        <p className="text-slate-500 mb-6">{error}</p>
        <button
          onClick={fetchPlanners}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (planners.length === 0) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl border border-slate-100 text-center">
        <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Planners Yet</h3>
        <p className="text-slate-500 mb-6">You haven't generated any schedule planners yet. Upload a routine PDF to get started!</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Generate Planner
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Your Planner History</h2>
          <p className="text-slate-500 mt-1">Browse, view, and print all your previously generated study schedules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-4 max-h-[75vh] overflow-y-auto pr-2">
          {planners.map((p) => {
            const isSelected = selectedPlanner?._id === p._id;
            return (
              <div
                key={p._id}
                onClick={() => setSelectedPlanner(p)}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-200 shadow-md ring-1 ring-indigo-400/20'
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">
                        Planner #{p._id.slice(-4).toUpperCase()}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(p.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 transition-transform ${isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-400'}`} />
                </div>
                {p.notes && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 italic">
                    "{p.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-8">
          {selectedPlanner && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    Selected Planner Details
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">
                    Generated on {formatDate(selectedPlanner.createdAt)}
                  </h3>
                  {selectedPlanner.notes && (
                    <p className="text-slate-600 mt-2 text-sm italic border-l-2 border-indigo-200 pl-3">
                      "{selectedPlanner.notes}"
                    </p>
                  )}
                </div>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm w-full md:w-auto justify-center cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>

              <div ref={componentRef} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 print:shadow-none print:border-none print:p-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  {selectedPlanner.weeklyPlan.map((dayPlan, idx) => (
                    <div key={idx} className="flex flex-col h-full">
                      <h3 className="text-center font-semibold text-slate-700 py-3 bg-slate-50 rounded-t-xl border-b border-slate-200">
                        {dayPlan.day}
                      </h3>
                      <div className="flex-1 border-x border-b border-slate-100 rounded-b-xl p-2 space-y-2 bg-white min-h-[150px]">
                        {dayPlan.tasks.map((task, tIdx) => (
                          <div
                            key={tIdx}
                            className={`p-3 rounded-lg border text-sm flex flex-col gap-1 transition-all hover:shadow-md ${getTaskColor(
                              task
                            )}`}
                          >
                            <span className="text-[10px] font-semibold opacity-70 uppercase tracking-wider">{task.timeBlock}</span>
                            <span className="font-medium leading-tight text-slate-800">{task.activity}</span>
                            {task.priority && task.priority !== 'none' && (
                              <span className="text-[9px] uppercase font-bold mt-1 opacity-80 inline-block">
                                {task.priority} Priority
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
