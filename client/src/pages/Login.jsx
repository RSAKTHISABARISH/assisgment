import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, ArrowRight, UserPlus, ShieldCheck, GraduationCap } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('student'); // 'student' or 'admin'
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    rollNumber: ''
  });
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleRoleToggle = (newRole) => {
    setRole(newRole);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin 
      ? `http://localhost:5000/api/auth/${role}/login` 
      : `http://localhost:5000/api/auth/${role}/signup`;
    
    try {
      const res = await axios.post(endpoint, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      if (role === 'student') {
        localStorage.setItem('studentName', res.data.name || formData.fullName);
        localStorage.setItem('rollNumber', formData.rollNumber);
        toast.success(`Welcome, ${res.data.name || formData.fullName}!`);
        setTimeout(() => navigate('/student-portal'), 1000);
      } else {
        toast.success('Admin access granted');
        setTimeout(() => navigate('/admin-dashboard'), 1000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <Toaster position="top-center" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark w-full max-w-lg p-10 rounded-[3rem] relative z-10 overflow-hidden"
      >
        {/* Glow Effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/20 blur-[80px] rounded-full" />

        {/* Role Toggle */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-12 relative z-20">
          <button 
            onClick={() => handleRoleToggle('student')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${role === 'student' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:text-white/60'}`}
          >
            <GraduationCap size={18} /> Student
          </button>
          <button 
            onClick={() => handleRoleToggle('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold text-sm ${role === 'admin' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-white/40 hover:text-white/60'}`}
          >
            <ShieldCheck size={18} /> Admin
          </button>
        </div>

        <div className="text-center mb-10">
          <motion.h1 
            key={isLogin ? 'li' : 'su'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white tracking-tight mb-3"
          >
            {isLogin ? `${role === 'admin' ? 'Admin' : 'Student'} Portal` : 'Create Account'}
          </motion.h1>
          <p className="text-white/40 font-medium">Please enter your credentials to proceed</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {!isLogin && role === 'student' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                    <input 
                      type="text" 
                      placeholder="sakthi" 
                      className="input-field pl-12"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">
              {role === 'student' ? 'Roll Number' : 'Username'}
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
              <input 
                type="text" 
                placeholder={role === 'student' ? '24110083' : 'admin'} 
                className="input-field pl-12"
                value={role === 'student' ? formData.rollNumber : formData.username}
                onChange={(e) => setFormData({...formData, [role === 'student' ? 'rollNumber' : 'username']: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={20} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-field pl-12"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] ${role === 'admin' ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-blue-600 shadow-blue-900/40'}`}
          >
            {isLogin ? 'Secure Sign In' : 'Initialize Account'}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={handleToggle}
            className="text-white/40 hover:text-white text-sm font-bold transition-colors flex items-center gap-2 mx-auto"
          >
            {isLogin ? (
              <><UserPlus size={16}/> New student? Create your account</>
            ) : (
              <><ArrowRight size={16}/> Already have an account? Sign in</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
