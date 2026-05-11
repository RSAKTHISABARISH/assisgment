import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Play, LogOut, GraduationCap, Compass } from 'lucide-react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const StudentPortal = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const studentName = localStorage.getItem('studentName') || 'Explorer';

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tests');
        setTests(response.data);
      } catch (err) {
        toast.error('Sync failure with neural link');
      } finally {
        setLoading(false);
      }
    };
    fetchTests();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const startTest = (id) => {
    navigate(`/test/${id}`);
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      <Toaster position="top-right" />
      
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8 relative z-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-blue-400">
              <GraduationCap size={40} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-white tracking-tighter">Genesis Portal</h1>
              <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-[10px]">Neural Interface Active</p>
            </div>
          </div>
          <p className="text-white/60 text-lg font-medium">Synchronized with: <span className="text-blue-400 font-black">{studentName}</span></p>
        </motion.div>
        
        <button 
          onClick={handleLogout}
          className="glass-dark px-10 py-5 rounded-[2rem] text-white/40 hover:text-red-400 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-3 group"
        >
          Disconnect <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-12">
          <Compass className="text-blue-400 animate-spin-slow" size={28} />
          <h2 className="text-2xl font-black text-white tracking-tight">Available Nodes</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass h-80 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {tests.length === 0 ? (
              <div className="col-span-full glass p-24 text-center rounded-[4rem] border border-white/5">
                <div className="w-24 h-24 glass-dark rounded-full flex items-center justify-center mx-auto mb-8 text-white/10">
                  <BookOpen size={48} />
                </div>
                <p className="text-white/30 font-bold italic text-xl">Waiting for system allocation...</p>
              </div>
            ) : (
              tests.map((test, i) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="glass p-10 rounded-[3.5rem] group cursor-pointer relative overflow-hidden border border-white/5 hover:border-white/20 transition-all"
                  onClick={() => startTest(test.id)}
                >
                  <div className="absolute top-0 right-0 p-8">
                    <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white/20 group-hover:text-blue-400 transition-colors">
                      <Play size={24} />
                    </div>
                  </div>

                  <div className="bg-white/5 w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xl">
                    <BookOpen size={36} />
                  </div>
                  
                  <h3 className="text-3xl font-black text-white mb-4 tracking-tighter leading-tight group-hover:text-blue-400 transition-colors">{test.topic}</h3>
                  
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-10">
                    <span className="flex items-center gap-2 px-4 py-2 glass-dark rounded-full"><Clock size={14} /> 10m</span>
                    <span className="flex items-center gap-2 px-4 py-2 glass-dark rounded-full">{test.questions?.length || 10} Nodes</span>
                  </div>

                  <button className="w-full py-6 glass-dark rounded-[2rem] font-black text-white tracking-[0.3em] uppercase text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-all">
                    Initiate Link
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}} />
    </div>
  );
};

export default StudentPortal;
