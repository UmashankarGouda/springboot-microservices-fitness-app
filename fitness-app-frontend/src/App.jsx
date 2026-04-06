import './index.css';
import './App.css';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router';
import { setCredentials } from './store/authSlice';
import { SnackbarProvider } from 'notistack';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ActivityList from './components/ActivityList';
import ActivityDetail from './components/ActivityDetail';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Activity, TrendingUp, ShieldCheck, Sparkles, ChevronRight, BarChart3, Dumbbell, Zap } from 'lucide-react';

function App() {
  const { token, tokenData, logIn, logOut, isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const [authReady, setAuthReady] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
      setAuthReady(true);
    }
  }, [token, tokenData, dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  const floatVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const features = [
    { id: 1, icon: <Activity className="w-8 h-8" />, color: "text-blue-400", title: "Smart Tracking", desc: "Log runs, walks & cycling with precision" },
    { id: 2, icon: <Sparkles className="w-8 h-8" />, color: "text-purple-400", title: "Gemini AI", desc: "Intelligent analysis and workout insights" },
    { id: 3, icon: <ShieldCheck className="w-8 h-8" />, color: "text-emerald-400", title: "Safety First", desc: "Personalized recovery and safety guidelines" }
  ];

  const floatingStats = [
    { top: "15%", left: "10%", icon: <BarChart3 className="w-5 h-5 text-indigo-400" />, delay: 0 },
    { top: "60%", right: "12%", icon: <Zap className="w-5 h-5 text-amber-400" />, delay: 1.5 },
    { bottom: "20%", left: "15%", icon: <Dumbbell className="w-5 h-5 text-emerald-400" />, delay: 3 }
  ];

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      autoHideDuration={3000}
    >
      <Router>
        {!token ? (
          /* ========== LOGIN PAGE ========== */
          <section className="min-h-screen bg-gray-950">
    {/* ===== HEADER ===== */}
    <header className="relative z-20">
        <div className="border-b border-white/10">
            <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex items-center justify-between h-16 lg:h-[72px]">
                    {/* Mobile menu button */}
                    <button type="button" className="p-2 -m-2 text-white transition-all duration-200 lg:hidden hover:text-gray-300">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0 ml-4 lg:ml-0">
                        <div className="inline-flex items-center gap-2.5">
                            <Activity className="w-7 h-7 text-indigo-400" />
                            <span className="text-xl font-black tracking-tight text-white">Fit<span className="text-indigo-400">&</span>Fantastic</span>
                        </div>
                    </div>

                    {/* Nav actions */}
                    <div className="flex items-center justify-end ml-auto">
                        <div className="hidden lg:flex lg:items-center lg:space-x-8">
                            <a href="#features" className="text-sm font-medium text-gray-300 transition-all duration-200 rounded hover:text-white"> Features </a>
                            <a href="#ai" className="text-sm font-medium text-gray-300 transition-all duration-200 rounded hover:text-white"> AI Insights </a>
                            <a href="#track" className="text-sm font-medium text-gray-300 transition-all duration-200 rounded hover:text-white"> Track Progress </a>

                            <span className="w-px h-6 bg-white/20" aria-hidden="true"></span>

                            <button onClick={() => logIn()} className="text-sm font-medium text-gray-300 transition-all duration-200 rounded hover:text-white"> Log in </button>

                            <button onClick={() => logIn()} className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all duration-200 shadow-lg shadow-indigo-600/25">
                                Get Started Free
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    {/* ===== HERO SECTION ===== */}
    <div className="relative pt-12 sm:pt-16 lg:py-36 xl:py-48 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
            <img className="object-cover object-center w-full h-full opacity-30" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" alt="Gym background" />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/95 to-gray-950/60"></div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content */}
        <div className="relative px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-xl mx-auto text-center lg:mx-0 lg:max-w-lg lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                    <Sparkles className="w-4 h-4" />
                    Powered by Google Gemini AI
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl xl:text-7xl leading-tight">
                    Track. Analyze. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">Transform.</span>
                </h1>

                <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-md">
                    Don't just log workouts — understand them. Our AI engine analyzes your performance, suggests improvements, and guides you to peak fitness.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                    <button
                        onClick={() => logIn()}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
                    >
                        Start Your Journey
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <button onClick={() => logIn()} className="inline-flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-all duration-200">
                        <Play className="w-5 h-5 text-indigo-400" />
                        See how it works
                    </button>
                </div>

                {/* Stats row */}
                <div className="mt-12 grid grid-cols-3 gap-6 max-w-md lg:mx-0 mx-auto">
                    <div>
                        <p className="text-2xl font-bold text-white">10K+</p>
                        <p className="text-sm text-gray-500">Active Users</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">50K+</p>
                        <p className="text-sm text-gray-500">Workouts Tracked</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-white">98%</p>
                        <p className="text-sm text-gray-500">Satisfaction</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Mobile hero image */}
        <div className="mt-8 px-4 lg:hidden">
            <img className="w-full mx-auto rounded-2xl object-cover h-64 shadow-2xl" src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop" alt="Fitness" />
        </div>
    </div>

    {/* ===== FEATURE CARDS ===== */}
    <div className="relative z-10 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl -mt-16 pb-20" id="features">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
                <div key={feature.id} className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1 group">
                    <div className={`inline-flex p-3 rounded-xl bg-white/5 border border-white/10 mb-4 ${feature.color}`}>
                        {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
            ))}
        </div>
    </div>
</section>
        ) : (
          /* ========== AUTHENTICATED APP ========== */
          <Layout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </SnackbarProvider>
  );
}

export default App;
