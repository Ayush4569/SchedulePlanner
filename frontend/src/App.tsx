import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Calendar, Loader2, History, PlusCircle } from 'lucide-react';
import { Upload } from './components/Upload';
import { PlannerView } from './components/PlannerView';
import { MyPlanners } from './components/MyPlanners';
import { useStore } from './store/useStore';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { planner, isLoading } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-indigo-600 hover:opacity-90">
            <Calendar className="w-7 h-7" />
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Schedule Planner</h1>
          </NavLink>

          <nav className="flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              <PlusCircle className="w-4 h-4" />
              Generate Planner
            </NavLink>
            <NavLink
              to="/myplanners"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                }`
              }
            >
              <History className="w-4 h-4" />
              My Planners
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Routes>
          <Route
            path="/"
            element={
              <>
                {!planner && !isLoading && <Upload />}
                
                {isLoading && (
                  <div className="flex flex-col items-center justify-center mt-32 space-y-4">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                    <p className="text-lg font-medium text-slate-600 animate-pulse">Generating your perfect schedule...</p>
                    <p className="text-sm text-slate-400">This might take a few seconds</p>
                  </div>
                )}

                {planner && !isLoading && <PlannerView />}
              </>
            }
          />
          <Route path="/myplanners" element={<MyPlanners />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'shadow-lg border border-slate-100 rounded-xl',
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1e293b',
          },
        }}
      />
    </Router>
  );
}

export default App;
