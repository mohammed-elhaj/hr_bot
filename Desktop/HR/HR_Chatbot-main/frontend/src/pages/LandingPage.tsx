import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  Bot,
  Calendar, 
  FileText,
  Shield, 
  Zap,
  User,
  CheckCircle,
  ArrowLeft,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  Settings
} from 'lucide-react';
import Layout from '../components/common/Layout';

const features = [
  {
    title: "مساعد ذكي 24/7",
    description: "احصل على إجابات فورية لجميع استفساراتك المتعلقة بالموارد البشرية في أي وقت",
    icon: Bot,
    gradient: "from-blue-500 to-cyan-500",
    benefits: [
      "دعم على مدار الساعة",
      "إجابات دقيقة وفورية",
      "تعلم مستمر وتحسين"
    ]
  },
  {
    title: "إدارة الإجازات الذكية",
    description: "تقديم وتتبع طلبات الإجازة بسهولة مع التحديثات المباشرة والموافقات التلقائية",
    icon: Calendar,
    gradient: "from-purple-500 to-pink-500",
    benefits: [
      "تقديم طلبات بنقرة واحدة",
      "تتبع الرصيد تلقائياً",
      "تنبيهات مباشرة"
    ]
  },
  {
    title: "إدارة المستندات السحابية",
    description: "تخزين ومشاركة وإدارة جميع مستندات الموارد البشرية في مكان واحد آمن",
    icon: FileText,
    gradient: "from-primary-500 to-yellow-500",
    benefits: [
      "تخزين آمن",
      "مشاركة سهلة",
      "بحث متقدم"
    ]
  },
  {
    title: "تحليلات وتقارير متقدمة",
    description: "رؤى تحليلية عميقة وتقارير تفصيلية لاتخاذ قرارات أفضل",
    icon: TrendingUp,
    gradient: "from-green-500 to-teal-500",
    benefits: [
      "لوحات تحكم تفاعلية",
      "تقارير مخصصة",
      "تنبؤات مستقبلية"
    ]
  }
];

const LandingPage = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <StatsSection />
      <TestimonialsSection />
      <CallToAction />
    </Layout>
  );
};

const HeroSection = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-primary-100/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -left-1/4 -bottom-1/4 w-1/2 h-1/2 bg-purple-100/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-right"
          >
            <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-relaxed md:leading-tight mb-6"
>
  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600 mb-2">
    مستقبل إدارة
  </span>
  <span className="block text-gray-900 mt-4">
    الموارد البشرية
  </span>
</motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0"
            >
              نظام ذكي يجمع بين قوة الذكاء الاصطناعي وخبرة الموارد البشرية لتقديم تجربة فريدة وفعالة
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => navigate('/chat')}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-primary-500 to-primary-700 
                         text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary-500/25 
                         transition-all relative overflow-hidden group w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Bot className="w-5 h-5" />
                  جرب المساعد الذكي
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-purple-600"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovered ? '0%' : '-100%' }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button> */}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-6 md:px-8 py-3 md:py-4 border-2 border-primary-500 text-primary-700 
                         rounded-xl font-medium hover:bg-primary-50 transition-all 
                         flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                ابدأ الآن
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Hero Image/Animation - Hidden on mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full h-[600px] bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl overflow-hidden">
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-2xl shadow-xl p-6"
              >
                <Bot className="w-full h-full text-primary-500" />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 20, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-2xl shadow-xl p-4"
              >
                <Calendar className="w-full h-full text-purple-500" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            ميزات متقدمة لتحسين إدارة الموارد البشرية
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            نظام متكامل يجمع بين أحدث التقنيات وأفضل الممارسات لتقديم تجربة فريدة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-shadow hover:shadow-xl border border-gray-100 h-full">
                <div className={`w-12 md:w-14 h-12 md:h-14 rounded-xl bg-gradient-to-r ${feature.gradient} p-3 mb-6`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 text-sm md:text-base">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                      <CheckCircle className="w-4 md:w-5 h-4 md:h-5 text-primary-500 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DemoSection = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const navigate = useNavigate();

  const demoFeatures = {
    chat: {
      title: "المساعد الذكي",
      description: "احصل على إجابات فورية لجميع استفساراتك",
      icon: Bot,
      preview: (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-gray-800">كيف يمكنني المساعدة اليوم؟</p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 bg-primary-50 rounded-xl p-3 md:p-4">
              <p className="text-sm md:text-base text-primary-900">أريد معرفة رصيد إجازاتي</p>
            </div>
          </motion.div>
        </div>
      )
    },
    vacation: {
      title: "إدارة الإجازات",
      description: "قدم وتتبع طلبات الإجازة بسهولة",
      icon: Calendar,
      preview: (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm md:text-base">رصيد الإجازات</h4>
              <span className="text-primary-600 font-bold text-lg md:text-xl">21 يوم</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60%" }}
                className="h-full bg-primary-500"
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      )
    },
    documents: {
      title: "إدارة المستندات",
      description: "احفظ وشارك المستندات بأمان",
      icon: FileText,
      preview: (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-3 md:p-4 border rounded-lg flex items-center gap-2"
              >
                <FileText className="w-4 md:w-5 h-4 md:h-5 text-primary-500" />
                <span className="text-xs md:text-sm">مستند {i}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    }
  };

  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            جرب النظام بنفسك
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            استكشف ميزات النظام الرئيسية من خلال العرض التفاعلي
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* Feature Tabs */}
          <div className="space-y-4 md:space-y-6">
            {Object.entries(demoFeatures).map(([key, feature]) => (
              <motion.button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full text-right p-4 md:p-6 rounded-xl transition-all ${
                  activeTab === key
                    ? 'bg-white shadow-lg border-primary-500 border-2'
                    : 'bg-white/50 hover:bg-white'
                }`}
                whileHover={{ x: activeTab === key ? 0 : 5 }}
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`p-2 md:p-3 rounded-lg ${
                    activeTab === key
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <feature.icon className="w-5 md:w-6 h-5 md:h-6" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm md:text-base mb-1 ${
                      activeTab === key ? 'text-primary-900' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-xs md:text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Preview Area */}
          <div className="bg-gray-100 rounded-2xl p-4 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {demoFeatures[activeTab as keyof typeof demoFeatures].preview}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:mt-12"
        >
          <button
            onClick={() => navigate('/chat')}
            className="px-6 md:px-8 py-3 md:py-4 bg-primary-600 text-white rounded-xl 
                     hover:bg-primary-700 transition-colors text-sm md:text-base"
          >
            جرب النظام مجاناً
          </button>
        </motion.div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-primary-600 to-purple-600 text-white relative overflow-hidden">
      {/* Add overlay gradient for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white drop-shadow-sm">
            أرقام تتحدث عن نجاحنا
          </h2>
          <p className="text-base md:text-lg text-white/90">
            نتائج ملموسة تؤكد فعالية نظامنا
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { number: "98%", label: "رضا المستخدمين" },
            { number: "60%", label: "توفير في الوقت" },
            { number: "24/7", label: "دعم متواصل" },
            { number: "500+", label: "شركة تستخدم النظام" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", delay: index * 0.2 + 0.3 }}
                className="mb-2 md:mb-4"
              >
                <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
                  {stat.number}
                </span>
              </motion.div>
              <p className="text-sm md:text-base text-white/90">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Add decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const testimonials = [
    {
      content: "النظام ساعدنا في تحسين كفاءة إدارة الموارد البشرية بشكل كبير. توفير الوقت والجهد كان ملحوظاً.",
      author: "سارة العمري",
      position: "مدير الموارد البشرية",
      company: "شركة التقنية المتقدمة"
    },
    {
      content: "المساعد الذكي يقدم إجابات دقيقة وسريعة لاستفسارات الموظفين. لم نعد نحتاج للرد على الأسئلة المتكررة.",
      author: "محمد الأحمد",
      position: "مدير التطوير التنظيمي",
      company: "مجموعة الابتكار"
    },
    {
      content: "نظام إدارة الإجازات أصبح أكثر سلاسة وفعالية. الموظفون سعداء بالتجربة الجديدة.",
      author: "نورة السالم",
      position: "مدير عمليات الموارد البشرية",
      company: "شركة التطوير العقاري"
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-base md:text-lg text-gray-600">
            قصص نجاح حقيقية من عملائنا
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 rounded-2xl p-6 md:p-8 relative"
            >
              <div className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-primary-500 flex items-center justify-center">
                  <MessageSquare className="w-5 md:w-6 h-5 md:h-6 text-white" />
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 text-sm md:text-base">{testimonial.content}</p>
              
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 flex items-center justify-center">
                  <span className="text-base md:text-lg font-bold text-white">
                    {testimonial.author[0]}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                    {testimonial.author}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-500">
                    {testimonial.position}
                  </p>
                  <p className="text-xs md:text-sm text-primary-600">
                    {testimonial.company}
                  </p>
                </div>
              </div>
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
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl md:rounded-3xl overflow-hidden"
        >
          <div className="relative z-10 p-6 md:p-12 lg:p-16 text-center text-white">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6"
            >
              جاهز لتجربة مستقبل الموارد البشرية؟
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-8"
            >
              ابدأ اليوم واكتشف كيف يمكن لمساعدنا الذكي تحسين كفاءة إدارة الموارد البشرية
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {/* <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat')}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-primary-600 rounded-xl font-medium 
                         hover:bg-gray-50 transition-all flex items-center justify-center gap-2
                         text-sm md:text-base w-full sm:w-auto"
              >
                <Bot className="w-5 h-5" />
                جرب المساعد الذكي
              </motion.button> */}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="px-6 md:px-8 py-3 md:py-4 bg-transparent border-2 border-white text-white 
                         rounded-xl font-medium hover:bg-white/10 transition-all 
                         flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto"
              >
                <ArrowLeft className="w-5 h-5" />
                سجل الآن
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
            className="absolute -left-20 -top-20 w-40 md:w-60 h-40 md:h-60 bg-white/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -right-20 -bottom-20 w-40 md:w-60 h-40 md:h-60 bg-white/10 rounded-full blur-2xl"
          />
        </motion.div>

        {/* Bottom Feature Cards */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "دعم فني متميز",
              description: "فريق دعم متخصص جاهز لمساعدتك",
              icon: Settings,
              color: "text-primary-500"
            },
            {
              title: "تحديثات مستمرة",
              description: "تطوير مستمر لتلبية احتياجاتك",
              icon: Zap,
              color: "text-purple-500"
            },
            {
              title: "أمان عالي",
              description: "حماية متقدمة لبياناتك",
              icon: Shield,
              color: "text-green-500"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center bg-white rounded-xl p-6 md:p-8 shadow-sm"
            >
              <div className="inline-block p-3 bg-gray-100 rounded-xl mb-4">
                <feature.icon className={`w-5 md:w-6 h-5 md:h-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-12 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">الأسئلة الشائعة</h2>
            <p className="text-base md:text-lg text-gray-600">إجابات على الأسئلة الأكثر شيوعاً</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                question: "كيف يمكنني البدء باستخدام النظام؟",
                answer: "يمكنك البدء مباشرة بالتسجيل وإنشاء حساب جديد. بعد ذلك، ستتمكن من استخدام جميع ميزات النظام."
              },
              {
                question: "هل النظام آمن لحفظ البيانات؟",
                answer: "نعم، نستخدم أحدث تقنيات التشفير وأنظمة الحماية لضمان أمان بياناتك."
              },
              {
                question: "هل يمكن تخصيص النظام لاحتياجاتنا؟",
                answer: "نعم، يمكن تخصيص النظام بالكامل ليتناسب مع احتياجات مؤسستك."
              },
              {
                question: "كيف يمكنني الحصول على الدعم الفني؟",
                answer: "نوفر دعماً فنياً على مدار الساعة عبر المحادثة المباشرة والبريد الإلكتروني."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-sm"
              >
                <h4 className="font-semibold text-gray-900 text-base md:text-lg mb-2">{faq.question}</h4>
                <p className="text-sm md:text-base text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;