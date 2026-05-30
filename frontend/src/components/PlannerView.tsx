import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Download, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Task } from '../store/useStore';
import toast from 'react-hot-toast';

export const PlannerView: React.FC = () => {
  const { planner, reset } = useStore();
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'My_Weekly_Study_Planner',
  });

  const handleDownload = () => {
    toast.success('Downloading your planner PDF...', {
      icon: '📥',
    });
    handlePrint();
  };

  if (!planner) return null;

  const getTaskColor = (task: Task) => {
    if (task.type === 'study') {
      if (task.priority === 'hard') return 'bg-red-100 border-red-200 text-red-800';
      if (task.priority === 'medium') return 'bg-orange-100 border-orange-200 text-orange-800';
      return 'bg-green-100 border-green-200 text-green-800';
    }
    if (task.type === 'break') return 'bg-blue-50 border-blue-100 text-blue-700';
    if (task.type === 'routine') return 'bg-slate-100 border-slate-200 text-slate-700';
    return 'bg-gray-50 border-gray-200 text-gray-700';
  };

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Your Weekly Planner</h2>
          {planner.notes && <p className="text-slate-500 mt-2 max-w-2xl">{planner.notes}</p>}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Start Over
          </button>
        </div>
      </div>

      <div ref={componentRef} className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 print:shadow-none print:border-none print:p-0">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {planner.weeklyPlan.map((dayPlan, idx) => (
            <div key={idx} className="flex flex-col h-full">
              <h3 className="text-center font-semibold text-slate-700 py-3 bg-slate-50 rounded-t-xl border-b border-slate-200">
                {dayPlan.day}
              </h3>
              <div className="flex-1 border-x border-b border-slate-100 rounded-b-xl p-2 space-y-2 bg-white">
                {dayPlan.tasks.map((task, tIdx) => (
                  <div
                    key={tIdx}
                    className={`p-3 rounded-lg border text-sm flex flex-col gap-1 transition-all hover:shadow-md ${getTaskColor(
                      task
                    )}`}
                  >
                    <span className="text-xs font-semibold opacity-70 uppercase tracking-wider">{task.timeBlock}</span>
                    <span className="font-medium leading-tight">{task.activity}</span>
                    {task.priority && (
                      <span className="text-[10px] uppercase font-bold mt-1 opacity-80 inline-block">
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
  );
};
