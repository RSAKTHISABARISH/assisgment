import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, TrendingUp, Plus, Search, 
  Download, PieChart as PieIcon, BarChart as BarIcon, 
  Loader2, CheckCircle, Clock, Award, LogOut, Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [tests, setTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('monitoring');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const [subRes, testRes] = await Promise.all([
        axios.get(`${API_URL}/api/submissions`),
        axios.get(`${API_URL}/api/tests`)
      ]);
      setSubmissions(subRes.data || []);
      setTests(testRes.data || []);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    setGenerating(true);
    try {
      await axios.post(`${API_URL}/api/tests/generate`, { topic });
      setTopic('');
      fetchData();
      toast.success('AI Test Generated Successfully!');
    } catch (err) {
      toast.error('Error generating test. Demo Mode activated.');
      fetchData();
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Delete this test? Students will no longer be able to take it.')) return;
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      await axios.delete(`${API_URL}/api/tests/${id}`);
      toast.success('Test removed from system');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete test');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Analytics Helpers
  const avgScore = (submissions.reduce((acc, s) => acc + s.score, 0) / (submissions.length || 1)).toFixed(1);
  const chartData = tests.map(t => ({
    name: t.topic,
    submissions: submissions.filter(s => s.test_id === t.id).length,
    avgScore: (submissions.filter(s => s.test_id === t.id).reduce((acc, s) => acc + s.score, 0) / (submissions.filter(s => s.test_id === t.id).length || 1)).toFixed(1)
  }));

  const filteredSubmissions = submissions.filter(s => 
    (s.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-10 relative">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-2">Monitor Alpha</h1>
            <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">AI Platform Overview</p>
          </motion.div>
          
          <div className="flex items-center gap-4">
            <div className="flex glass p-1 rounded-[1.5rem] border border-white/10">
              {['monitoring', 'tests', 'analytics'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-[1.2rem] transition-all font-black text-xs uppercase tracking-widest ${activeTab === tab ? 'bg-white text-slate-900 shadow-xl' : 'text-white/50 hover:text-white'}`}
                >
                  {tab === 'monitoring' ? 'Monitor' : tab === 'tests' ? 'Tests' : 'Analyze'}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="p-4 glass rounded-2xl text-white/40 hover:text-red-400 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Students', val: submissions.length, icon: Users, color: 'blue' },
            { label: 'Tests', val: tests.length, icon: BookOpen, color: 'emerald' },
            { label: 'Avg %', val: avgScore * 10, icon: Award, color: 'amber' },
            { label: 'Activity', val: submissions.length, icon: TrendingUp, color: 'rose' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-[2.5rem] flex items-center gap-6 group hover:bg-white/10 transition-all border border-white/5"
            >
              <div className="w-14 h-14 glass-dark rounded-2xl flex items-center justify-center text-white/80 group-hover:scale-110 transition-transform shadow-lg">
                <stat.icon size={26} />
              </div>
              <div>
                <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{stat.val}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            {activeTab === 'monitoring' ? (
              <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
                <div className="p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="relative w-full max-sm:w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input 
                      type="text" 
                      placeholder="Filter entities..." 
                      className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-white/20 transition-all outline-none text-sm font-bold text-white placeholder:text-white/20"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                      <tr>
                        <th className="px-10 py-6">Operator</th>
                        <th className="px-10 py-6">Domain</th>
                        <th className="px-10 py-6">Metric</th>
                        <th className="px-10 py-6">Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredSubmissions.length === 0 ? (
                        <tr><td colSpan="4" className="px-10 py-20 text-center text-white/20 italic font-bold">Awaiting signals...</td></tr>
                      ) : (
                        filteredSubmissions.map((sub, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors group">
                            <td className="px-10 py-8">
                              <p className="font-black text-white text-lg group-hover:text-blue-400 transition-colors">{sub.studentName}</p>
                              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{sub.rollNumber}</p>
                            </td>
                            <td className="px-10 py-8 text-sm font-bold text-white/60">{sub.testId?.topic || sub.tests?.topic || 'General'}</td>
                            <td className="px-10 py-8">
                              <span className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase ${sub.score > 7 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                {sub.score} / 10
                              </span>
                            </td>
                            <td className="px-10 py-8 text-white/40 font-mono text-xs">{Math.floor(sub.timeTaken / 60)}m {sub.timeTaken % 60}s</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === 'tests' ? (
              <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
                <div className="p-10 border-b border-white/5">
                  <h2 className="text-2xl font-black text-white tracking-tighter">Active Deployments</h2>
                </div>
                <div className="p-6 grid grid-cols-1 gap-4">
                  {tests.length === 0 ? (
                    <div className="p-20 text-center text-white/20 italic font-bold">No tests deployed.</div>
                  ) : (
                    tests.map((test, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={test.id} 
                        className="glass-dark p-6 rounded-3xl flex items-center justify-between group border border-white/5 hover:border-white/10 transition-all"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400">
                            <BookOpen size={24} />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white tracking-tight">{test.topic}</h4>
                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{test.questions?.length || 0} Questions • Created {new Date(test.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeleteTest(test.id)}
                          className="p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="glass p-12 rounded-[3rem] border border-white/5">
                  <h3 className="text-2xl font-black mb-10 text-white tracking-tighter flex items-center gap-4">
                    <BarIcon className="text-blue-400" size={32}/> Cluster Performance
                  </h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900}} />
                        <Tooltip 
                          cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          contentStyle={{background: '#000', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '20px'}} 
                        />
                        <Bar dataKey="avgScore" fill="rgba(255,255,255,0.8)" radius={[12, 12, 0, 0]} barSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-10">
            <div className="glass-dark p-12 rounded-[3.5rem] border border-white/10 sticky top-10">
              <div className="w-20 h-20 bg-white text-slate-900 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-white/20">
                <Plus size={40} strokeWidth={3} />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 tracking-tighter">Deploy Test</h3>
              <p className="text-white/30 font-bold uppercase tracking-widest text-[10px] mb-10">AI-Assisted Initialization</p>
              
              <form onSubmit={handleGenerate} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] ml-2 block">System Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Quantum RAG" 
                    className="input-field py-5 text-lg font-black"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={generating}
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={generating || !topic}
                  className="w-full bg-white text-slate-900 py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-white/10 flex items-center justify-center gap-4 group hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {generating ? <Loader2 className="animate-spin" /> : 'Execute AI'}
                  {!generating && <TrendingUp size={24} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
