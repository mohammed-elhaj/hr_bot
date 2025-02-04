// src/pages/LoginPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react';
import Layout from '../components/common/Layout';
import { useAuth } from '../context/AuthContext';

interface FormErrors {
  username?: string;
  password?: string;
  submit?: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/chat');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    }
    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      await login(formData.username, formData.password);
      navigate('/chat');
    } catch (error: any) {
      setErrors({
        submit: error.message || 'فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-16 pb-12 flex flex-col bg-gradient-to-br from-primary-50 via-white to-purple-50">
        <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-20 w-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <User className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900">مرحباً بعودتك</h2>
                <p className="text-gray-600 mt-2">سجل دخولك للوصول إلى لوحة التحكم</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المستخدم
                  </label>
                  <div className="relative">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                        errors.username ? 'border-red-500' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors`}
                      dir="rtl"
                    />
                    {errors.username && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.username}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 rounded-lg bg-gray-50 border ${
                        errors.password ? 'border-red-500' : 'border-gray-200'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-colors`}
                      dir="rtl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {errors.password && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-1 text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors.password}</span>
                      </motion.div>
                    )}
                  </div>
                </div>

                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-sm text-center"
                  >
                    {errors.submit}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    'تسجيل الدخول'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;