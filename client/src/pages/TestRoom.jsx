import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Send, AlertTriangle, Maximize2, Loader2, Cpu } from 'lucide-react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

const TestRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [warningCount, setWarningCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount(prev => prev + 1);
        toast.error("Integrity Alert: Signal loss detected!");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const fetchTest = useCallback(async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const response = await axios.get(`${API_URL}/api/tests/${id}`);
      setTest(response.data);
      setTimeLeft((response.data.questions?.length || 10) * 60);
      setLoading(false);
    } catch (err) {
      toast.error('System failure: Cannot link to node');
      navigate('/student-portal');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchTest();
  }, [fetchTest]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentIdx]: option });
  };

  const handleSubmit = async () => {
    let score = 0;
    test.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) score++;
    });

    const submissionData = {
      studentName: localStorage.getItem('studentName') || 'Explorer',
      rollNumber: localStorage.getItem('rollNumber') || '24110083',
      testId: id,
      answers: Object.entries(answers).map(([idx, opt]) => ({ 
        question: test.questions[parseInt(idx)].questionText,
        selected: opt 
      })),
      score,
      timeTaken: (test.questions.length * 60) - timeLeft
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await axios.post(`${API_URL}/api/submissions`, submissionData);
      toast.success(`Data Synchronized. Efficiency: ${score * 10}%`);
      setTimeout(() => navigate('/student-portal'), 2000);
    } catch (err) {
      toast.error('Sync failure: Packet loss during submission');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center animate-spin-slow mb-8 border border-white/10">
        <Cpu className="text-blue-400" size={40} />
      </div>
      <p className="font-black text-white text-2xl tracking-[0.2em] uppercase">Linking Neural Node...</p>
    </div>
  );

  const currentQuestion = test.questions[currentIdx];
  const progress = ((currentIdx + 1) / test.questions.length) * 100;

  return (
    <div className="min-h-screen p-6 md:p-12 flex flex-col items-center relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Header Overlay */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-5xl flex justify-between items-center mb-12 glass p-8 rounded-[3rem] border border-white/10 shadow-2xl relative z-10"
      >
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 glass-dark text-blue-400 rounded-2xl flex items-center justify-center shadow-inner border border-white/5">
            <Maximize2 size={24}/>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter">{test.topic}</h2>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Segment {currentIdx + 1} of {test.questions.length}</p>
          </div>
        </div>

        <div className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] font-mono font-black text-2xl border ${timeLeft < 60 ? 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse' : 'glass-dark text-blue-400 border-white/5'}`}>
          <Clock size={28} /> {formatTime(timeLeft)}
        </div>
      </motion.div>

      {/* Progress Path */}
      <div className="w-full max-w-5xl h-2 bg-white/5 rounded-full mb-12 overflow-hidden relative z-10 border border-white/5 p-0.5">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)]" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Node Card */}
      <div className="w-full max-w-5xl flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            className="glass-dark p-12 md:p-20 rounded-[4rem] border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] min-h-[600px] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-12">
                <span className="px-6 py-2 glass rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-400/20">Alpha Stream</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-16 leading-[1.2] tracking-tighter">{currentQuestion.questionText}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    className={`p-10 rounded-[2.5rem] text-left border transition-all duration-500 flex items-center justify-between group relative overflow-hidden ${answers[currentIdx] === opt ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'border-white/5 hover:border-white/20 bg-white/5'}`}
                  >
                    <span className={`text-xl font-bold transition-all duration-500 tracking-tight ${answers[currentIdx] === opt ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>{opt}</span>
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${answers[currentIdx] === opt ? 'border-blue-400 bg-blue-500 text-white shadow-lg' : 'border-white/10'}`}>
                      {answers[currentIdx] === opt && <div className="w-3 h-3 bg-white rounded-full shadow-lg" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-20 pt-12 border-t border-white/5">
              <button
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-3 text-white/20 font-black uppercase tracking-[0.3em] text-xs hover:text-white transition-all disabled:opacity-0"
              >
                <ChevronLeft size={32} /> Reverse
              </button>

              {currentIdx === test.questions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-16 py-7 bg-white text-slate-900 rounded-[2.5rem] font-black text-xl flex items-center gap-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95 transition-all"
                >
                  Finalize <Send size={24} />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIdx(prev => Math.min(test.questions.length - 1, prev + 1))}
                  className="px-16 py-7 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl flex items-center gap-4 shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all"
                >
                  Continue <ChevronRight size={24} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Security Protocol Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-8 z-[100]">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass p-16 rounded-[4rem] max-w-xl w-full text-center border border-white/10"
          >
            <div className="w-32 h-32 glass-dark rounded-[3rem] flex items-center justify-center mx-auto mb-12 text-blue-400 shadow-2xl">
              <Send size={56} />
            </div>
            <h3 className="text-4xl font-black text-white mb-6 tracking-tighter">Commit Data?</h3>
            <p className="text-white/40 font-medium text-lg mb-12 leading-relaxed">System has verified <span className="text-blue-400 font-black">{Object.keys(answers).length}</span> responses. Do you wish to synchronize with the main server?</p>
            <div className="flex gap-6">
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-6 rounded-[2rem] font-black bg-white/5 text-white/40 hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
              >
                Review
              </button>
              <button 
                onClick={handleSubmit}
                className="flex-1 py-6 rounded-[2rem] font-black bg-white text-slate-900 hover:bg-blue-400 transition-all uppercase tracking-widest text-xs"
              >
                Confirm Sync
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
};

export default TestRoom;
