// src/pages/LandingPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Shield, Zap, Users, ArrowLeft, ChevronLeft, CheckCircle, Bot, Calendar, User } from 'lucide-react';
import Layout from '../components/common/Layout';

// Feature component
interface Feature {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  gradient: string;
}

const features: Feature[] = [
  {
    title: "دعم ذكي على مدار الساعة",
    description: "مساعد افتراضي متاح 24/7 للإجابة على جميع استفساراتك المتعلقة بالموارد البشرية",
    icon: Bot,
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "إدارة الإجازات",
    description: "نظام سهل لتقديم وتتبع طلبات الإجازة والاستعلام عن الأرصدة",
    icon: Calendar,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "معالجة فورية",
    description: "معالجة سريعة لجميع الطلبات والاستفسارات بدون تأخير",
    icon: Zap,
    gradient: "from-primary-500 to-yellow-500"
  },
  {
    title: "إدارة المعلومات",
    description: "الوصول السهل والآمن لجميع سياسات وإجراءات الموارد البشرية",
    icon: Shield,
    gradient: "from-green-500 to-teal-500"
  }
];

// Statistics component
interface Statistic {
  number: string;
  label: string;
  suffix: string;
}

const statistics: Statistic[] = [
  { number: "98", label: "رضا المستخدمين", suffix: "%" },
  { number: "50,000", label: "مستخدم نشط", suffix: "+" },
  { number: "24/7", label: "دعم متواصل", suffix: "" },
  { number: "15", label: "دقيقة متوسط وقت الاستجابة", suffix: "" }
];

// Testimonial component
interface Testimonial {
  content: string;
  author: string;
  position: string;
  company: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    content: "نظام سهل الاستخدام وفعال جداً في تلبية احتياجات الموظفين. ساعد في تقليل وقت معالجة طلبات الموارد البشرية بشكل كبير.",
    author: "سارة الأحمد",
    position: "مدير الموارد البشرية",
    company: "شركة التقنية المتقدمة",
    imageUrl: "/api/placeholder/64/64"
  },
  {
    content: "المساعد الافتراضي ممتاز في الرد على استفسارات الموظفين. وفر علينا الكثير من الوقت والجهد.",
    author: "محمد العمري",
    position: "مدير التطوير التنظيمي",
    company: "مجموعة الابتكار",
    imageUrl: "/api/placeholder/64/64"
  }
];

const LandingPage = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <Benefits />
      <Statistics />
      <Testimonials />
      <CallToAction />
    </Layout>
  );
};

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-purple-50 pt-16 pb-32">
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
              مساعد الموارد البشرية الذكي
            </span>
            <span className="block text-gray-600 mt-3 text-3xl sm:text-4xl">
              إدارة شؤون الموظفين بذكاء وكفاءة
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-500"
          >
            نظام متكامل يجمع بين الذكاء الاصطناعي وأفضل ممارسات الموارد البشرية لتقديم تجربة سلسة للموظفين
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
              onClick={() => navigate('/chat')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              ابدأ المحادثة
              <MessageCircle className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-8 py-4 rounded-full border-2 border-primary-500 text-primary-600 font-medium hover:bg-primary-50 transition-colors flex items-center gap-2"
            >
              تسجيل الدخول
              <User className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

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
    </section>
  );
};

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">مميزات النظام</h2>
          <p className="mt-4 text-xl text-gray-600">كل ما تحتاجه لإدارة شؤون الموظفين في مكان واحد</p>
        </div>
        
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

const Benefits = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">لماذا تختارنا؟</h2>
          <p className="mt-4 text-xl text-gray-600">مزايا تجعل نظامنا الخيار الأمثل لمؤسستك</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            "تحسين كفاءة عمليات الموارد البشرية",
            "تقليل الوقت المستغرق في المعاملات الروتينية",
            "تحسين تجربة الموظفين",
            "تقليل الأخطاء البشرية",
            "توفير البيانات والتقارير بشكل فوري",
            "تحسين عملية اتخاذ القرار"
          ].map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-sm"
            >
              <CheckCircle className="w-6 h-6 text-primary-500 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Statistics = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);
  
  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
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

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">ماذا يقول عملاؤنا</h2>
          <p className="mt-4 text-xl text-gray-600">تجارب حقيقية لعملائنا مع النظام</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
            >
              <p className="text-gray-700 mb-6">{testimonial.content}</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.author}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-gray-600">{testimonial.position}</p>
                  <p className="text-gray-500 text-sm">{testimonial.company}</p>
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
    <section className="py-20 bg-gray-50">
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
              ابدأ اليوم واكتشف كيف يمكن لمساعدنا الذكي أن يساعدك في تحسين كفاءة عمليات الموارد البشرية
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat')}
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-medium hover:shadow-lg transition-shadow inline-flex items-center gap-2 justify-center"
              >
                ابدأ المحادثة
                <MessageCircle className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors inline-flex items-center gap-2 justify-center"
              >
                معرفة المزيد
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
            <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-white" />
            <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-white" />
          </div>
        </motion.div>

        {/* Additional Features List */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "دعم فني متميز",
              description: "فريق دعم متخصص جاهز لمساعدتك في أي وقت",
              icon: MessageCircle,
            },
            {
              title: "تحديثات مستمرة",
              description: "نظام يتطور باستمرار لتلبية احتياجاتك المتغيرة",
              icon: Zap,
            },
            {
              title: "أمان عالي",
              description: "حماية قصوى لبياناتك ومعلومات موظفيك",
              icon: Shield,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="inline-block p-3 bg-primary-100 rounded-full mb-4">
                <feature.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">الأسئلة الشائعة</h2>
            <p className="mt-4 text-xl text-gray-600">إجابات على أكثر الأسئلة شيوعاً</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "كيف يمكنني البدء باستخدام النظام؟",
                answer: "يمكنك البدء مباشرة بالتسجيل وإنشاء حساب جديد. بعد ذلك، سيقوم فريقنا بالتواصل معك لإكمال عملية الإعداد."
              },
              {
                question: "هل النظام آمن لحفظ بيانات الموظفين؟",
                answer: "نعم، نستخدم أحدث تقنيات التشفير وأنظمة الحماية لضمان أمان بياناتك ومعلومات موظفيك."
              },
              {
                question: "هل يمكن تخصيص النظام حسب احتياجاتنا؟",
                answer: "نعم، يمكن تخصيص النظام بالكامل ليتناسب مع احتياجات مؤسستك وسياساتها الخاصة."
              },
              {
                question: "كيف يمكنني الحصول على الدعم الفني؟",
                answer: "نوفر دعماً فنياً على مدار الساعة عبر المحادثة المباشرة والبريد الإلكتروني والهاتف."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;