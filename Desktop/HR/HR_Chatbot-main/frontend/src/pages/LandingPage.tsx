import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Shield, Zap, Users, ArrowLeft, ChevronLeft } from 'lucide-react';
import Layout from '../components/common/Layout';
import backgroundImage from '../assets/react.svg';


const LandingPage = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Statistics />
      <CallToAction />
    </Layout>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 pt-16 pb-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl"
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
              روبوت الموارد البشرية الذكي
            </span>
            <span className="block text-gray-600 mt-3 text-3xl sm:text-4xl">
              حلول مبتكرة لإدارة الموارد البشرية
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-500"
          >
            اكتشف كيف يمكن لروبوت المحادثة الخاص بنا تحسين كفاءة إدارة الموارد البشرية في مؤسستك
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              ابدأ الآن
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute right-0 top-1/4 w-72 h-72 bg-gradient-to-r from-primary-300/20 to-purple-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute left-0 bottom-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/20 to-primary-300/20 rounded-full blur-3xl"
        />
      </motion.div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      title: "دعم فوري على مدار الساعة",
      description: "احصل على إجابات لاستفساراتك في أي وقت من اليوم",
      icon: MessageCircle,
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "حماية البيانات",
      description: "نظام آمن يحافظ على خصوصية معلوماتك",
      icon: Shield,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "معالجة سريعة",
      description: "استجابة فورية وحلول سريعة لجميع استفساراتك",
      icon: Zap,
      gradient: "from-primary-500 to-yellow-500"
    },
    {
      title: "إدارة الموظفين",
      description: "تسهيل عمليات إدارة شؤون الموظفين",
      icon: Users,
      gradient: "from-green-500 to-teal-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... (previous JSX) ... */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8 transition-shadow hover:shadow-xl border border-gray-100">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-r ${feature.gradient} p-4 mb-6`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Statistics = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);
  
  const stats = [
    { number: "98%", label: "رضا العملاء", suffix: "+" },
    { number: "50,000", label: "مستخدم نشط", suffix: "+" },
    { number: "24/7", label: "دعم متواصل", suffix: "" },
    { number: "15", label: "دقيقة متوسط وقت الاستجابة", suffix: "" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setIsHovered(index)}
              onHoverEnd={() => setIsHovered(null)}
              className="text-center"
            >
              <motion.div
                animate={{
                  scale: isHovered === index ? 1.1 : 1,
                }}
                className="mb-4"
              >
                <span className="text-4xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </span>
                <span className="text-2xl font-bold text-primary-400">{stat.suffix}</span>
              </motion.div>
              <p className="text-gray-300">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-primary-500 to-purple-500 rounded-3xl overflow-hidden"
        >
          <div className="relative z-10 px-8 py-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              جاهز لتحسين إدارة الموارد البشرية في مؤسستك؟
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              ابدأ اليوم واكتشف كيف يمكن لروبوت المحادثة الخاص بنا أن يساعدك في تحسين كفاءة عمليات الموارد البشرية
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="bg-white text-primary-600 px-8 py-4 rounded-full font-medium hover:shadow-lg transition-shadow inline-flex items-center gap-2"
            >
              ابدأ الآن مجاناً
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-white" />
            <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-white" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingPage;