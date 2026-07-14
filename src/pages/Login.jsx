import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiLock, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate('/');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full gold-glow pointer-events-none opacity-50 z-0"></div>
      <div className="absolute inset-0 bg-mesh-pattern opacity-10 pointer-events-none z-0"></div>

      <div className="max-w-md w-full bg-card/90 backdrop-blur-md rounded-2xl shadow-2xl border border-border p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/30 shadow-[0_0_15px_rgba(197,160,89,0.2)]">
            <FiLock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-textPrimary">Admin Login</h2>
          <p className="mt-2 text-sm text-textSecondary font-light">
            Secure access to the premium marketplace
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-border placeholder-textSecondary text-textPrimary rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm bg-background transition-colors"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-textSecondary hover:text-primary transition-colors"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm tracking-widest uppercase font-bold rounded-md text-background bg-primary hover:bg-primary-dark transition-colors shadow-[0_0_15px_rgba(197,160,89,0.2)]"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-textSecondary hover:text-primary transition-colors flex items-center justify-center w-full"
          >
            <FiArrowLeft className="mr-2" /> Return to Home Page
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
