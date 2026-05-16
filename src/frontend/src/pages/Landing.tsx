import { Link } from "@tanstack/react-router";
import {
  Award,
  Bell,
  BookOpen,
  ChevronDown,
  Flag,
  Heart,
  Image,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChhatraLogo from "../components/ChhatraLogo";

const cssAnimations = `
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes glow { 0%, 100% { filter: drop-shadow(0 0 10px rgba(0,106,78,0.5)); } 50% { filter: drop-shadow(0 0 20px rgba(0,106,78,0.9)); } }
  @keyframes particleFloat { 0% { transform: translateY(0) rotate(0deg); opacity: 0.7; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes pulseBorder { 0%, 100% { box-shadow: 0 0 0 0 rgba(220,20,60,0.4); } 50% { box-shadow: 0 0 0 12px rgba(220,20,60,0); } }
  @keyframes rotateIn { from { opacity: 0; transform: rotate(-10deg) scale(0.8); } to { opacity: 1; transform: rotate(0deg) scale(1); } }
`;

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({
  target,
  suffix = "",
  duration = 2000,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - (1 - progress) ** 3;
            setCount(Math.round(target * ease));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}

function FeatureCard({ icon, title, desc, delay = 0 }: FeatureCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className="bg-white rounded-2xl p-6 border-t-4 border-green-700 shadow-md hover:shadow-xl group hover:scale-105 transition-transform duration-300"
    >
      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-700 transition-colors duration-300">
        <span className="text-green-700 group-hover:text-white transition-colors duration-300">
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

interface ReasonCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}

function ReasonCard({ icon, title, desc, delay = 0 }: ReasonCardProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
      className="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="w-12 h-12 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center flex-shrink-0">
        <span className="text-red-600">{icon}</span>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const particles = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  width: ((i * 1.7) % 6) + 3,
  height: ((i * 1.3) % 6) + 3,
  color:
    i % 3 === 0 ? "#DC143C" : i % 3 === 1 ? "#FFD700" : "rgba(255,255,255,0.6)",
  left: (i * 6.67) % 100,
  duration: ((i * 0.7) % 10) + 10,
  delay: (i * 0.33) % 5,
}));

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "var(--font-body)" }}>
      <style>{cssAnimations}</style>

      {/* ===== HERO ===== */}
      <section
        data-ocid="landing.hero"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #003820 0%, #006A4E 30%, #004d38 60%, #0d1117 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #DC143C 0px, #DC143C 2px, transparent 2px, transparent 40px)",
          }}
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                width: `${p.width}px`,
                height: `${p.height}px`,
                background: p.color,
                borderRadius: "50%",
                left: `${p.left}%`,
                bottom: "0",
                animation: `particleFloat ${p.duration}s linear ${p.delay}s infinite`,
              }}
            />
          ))}
        </div>
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-green-600" />
          <div className="flex-1 bg-red-600" />
          <div className="flex-1 bg-green-600" />
        </div>

        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-20">
          <div className="flex items-center gap-3">
            <ChhatraLogo size={44} />
            <div className="hidden md:block">
              <p className="text-white font-bold text-sm leading-tight">
                ২নং কপিলমুনি ইউনিয়ন
              </p>
              <p className="text-green-300 text-xs">ছাত্রদল পোর্টাল</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              data-ocid="landing.login_link"
              className="text-white text-sm hover:text-green-300 transition-colors duration-200 hidden sm:inline"
            >
              লগইন
            </Link>
            <Link
              to="/register"
              data-ocid="landing.register_nav_button"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #DC143C, #a00f2b)",
                boxShadow: "0 2px 12px rgba(220,20,60,0.4)",
              }}
            >
              নিবন্ধন
            </Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 mt-16">
          <div
            data-ocid="landing.hero_logo"
            style={{
              animation:
                "float 3s ease-in-out infinite, glow 3s ease-in-out infinite",
            }}
            className="mb-8"
          >
            <ChhatraLogo size={140} />
          </div>
          <div className="mb-6">
            <h1
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-2"
              style={{
                animation: "slideInLeft 0.8s ease forwards",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              ২নং কপিলমুনি ইউনিয়ন
            </h1>
            <h2
              className="text-3xl md:text-5xl font-black leading-tight"
              style={{
                animation: "slideInRight 0.8s ease 0.3s forwards",
                opacity: 0,
                background: "linear-gradient(90deg, #FFD700, #DC143C, #FFD700)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ছাত্রদল পোর্টাল
            </h2>
          </div>
          <p
            className="text-green-200 text-base md:text-lg max-w-xl leading-relaxed mb-10"
            style={{
              animation: "fadeInUp 0.8s ease 0.6s forwards",
              opacity: 0,
            }}
          >
            জাতীয়তাবাদী আদর্শে বিশ্বাসী তরুণ প্রজন্মের সংগঠন
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{
              animation: "fadeInUp 0.8s ease 0.9s forwards",
              opacity: 0,
            }}
          >
            <Link
              to="/register"
              data-ocid="landing.hero_register_button"
              className="px-8 py-4 rounded-xl font-bold text-white text-lg transition-all duration-200 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #006A4E, #00a878)",
                boxShadow: "0 4px 20px rgba(0,106,78,0.5)",
              }}
            >
              যোগ দিন
            </Link>
            <Link
              to="/committee"
              data-ocid="landing.committee_button"
              className="px-8 py-4 rounded-xl font-bold text-white text-lg border-2 border-white hover:bg-white hover:text-green-900 transition-all duration-200"
            >
              কমিটি দেখুন
            </Link>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white opacity-70"
          style={{ animation: "bounce 1.5s ease-in-out infinite" }}
          data-ocid="landing.scroll_arrow"
        >
          <ChevronDown size={32} />
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section
        data-ocid="landing.stats_bar"
        className="py-8 px-4"
        style={{ background: "linear-gradient(90deg, #006A4E, #004d38)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "প্রতিষ্ঠিত", value: "১৯৭৮" },
            { label: "ইউনিয়ন", value: "কপিলমুনি" },
            { label: "উপজেলা", value: "কয়রা" },
            { label: "জেলা", value: "খুলনা" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-black text-yellow-300 mb-1">
                {stat.value}
              </div>
              <div className="text-green-200 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        data-ocid="landing.about_section"
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-green-700 bg-green-50 border border-green-200 mb-3">
              আমাদের সংগঠন
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              আমাদের সম্পর্কে
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                বাংলাদেশ জাতীয়তাবাদী ছাত্রদল (বিজেসিডি) বাংলাদেশ জাতীয়তাবাদী দল (বিএনপি)-র
                ছাত্র সংগঠন। জাতীয়তাবাদী আদর্শ, গণতন্ত্র ও দেশপ্রেমের ভিত্তিতে গড়া এই সংগঠন
                দেশের তরুণ প্রজন্মকে সংগঠিত করে।
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                ২নং কপিলমুনি ইউনিয়ন ছাত্রদল — খুলনা জেলার কয়রা উপজেলার অন্তর্গত তরুণ
                নেতাকর্মীদের সংগঠিত করে দেশ ও জাতির কল্যাণে কাজ করে যাচ্ছে।
              </p>
              <div className="flex items-center gap-4">
                <Link
                  to="/committee"
                  data-ocid="landing.about_committee_link"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #006A4E, #00a878)",
                  }}
                >
                  <Users size={16} />
                  কমিটি দেখুন
                </Link>
                <Link
                  to="/register"
                  data-ocid="landing.about_register_link"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition-all duration-200"
                >
                  যোগ দিন
                </Link>
              </div>
            </div>
            <div className="relative">
              <div
                className="rounded-2xl p-8 relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #006A4E 0%, #004d38 100%)",
                }}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20"
                  style={{ background: "#FFD700" }}
                />
                <div
                  className="absolute bottom-0 left-0 w-16 h-16 rounded-tr-full opacity-20"
                  style={{ background: "#DC143C" }}
                />
                <div className="flex justify-center mb-6">
                  <ChhatraLogo size={72} />
                </div>
                <blockquote className="text-white text-base italic leading-relaxed text-center mb-4">
                  &ldquo;দেশের জন্য, মানুষের জন্য, গণতন্ত্রের জন্য — ছাত্রদলের
                  প্রতিশ্রুতি।&rdquo;
                </blockquote>
                <p className="text-green-200 text-sm text-center font-medium">
                  — বাংলাদেশ জাতীয়তাবাদী ছাত্রদল
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES GRID ===== */}
      <section
        data-ocid="landing.features_section"
        className="py-20 px-4"
        style={{ background: "#f8f9fa" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-green-700 bg-green-50 border border-green-200 mb-3">
              প্ল্যাটফর্ম সুবিধা
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              আমাদের সুবিধাসমূহ
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Users size={22} />}
              title="সদস্য নিবন্ধন"
              desc="ছাত্রদলে যোগ দিতে অনলাইনে নিবন্ধন করুন"
              delay={0}
            />
            <FeatureCard
              icon={<MessageCircle size={22} />}
              title="গ্রুপ চ্যাট"
              desc="সকল সদস্যদের সাথে আলোচনা করুন"
              delay={100}
            />
            <FeatureCard
              icon={<Bell size={22} />}
              title="নোটিশ বোর্ড"
              desc="সাংগঠনিক সকল নোটিশ এখানে পাবেন"
              delay={200}
            />
            <FeatureCard
              icon={<Image size={22} />}
              title="ফটো গ্যালারি"
              desc="সংগঠনের স্মরণীয় মুহূর্তগুলো"
              delay={300}
            />
            <FeatureCard
              icon={<Award size={22} />}
              title="পদবী তালিকা"
              desc="কমিটির পদবী অনুযায়ী সদস্যদের তালিকা"
              delay={400}
            />
            <FeatureCard
              icon={<BookOpen size={22} />}
              title="সদস্য কার্ড"
              desc="সদস্যপদের ডিজিটাল সার্টিফিকেট ডাউনলোড করুন"
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* ===== WHY JOIN SECTION ===== */}
      <section
        data-ocid="landing.why_join_section"
        className="py-20 px-4 bg-white"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-red-600 bg-red-50 border border-red-200 mb-3">
              আমাদের আদর্শ
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              কেন ছাত্রদলে যোগ দেবেন?
            </h2>
            <div className="w-16 h-1 bg-green-700 mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <ReasonCard
              icon={<Heart size={22} />}
              title="দেশপ্রেম"
              desc="দেশ ও জাতির সেবায় নিজেকে নিয়োজিত করুন"
              delay={0}
            />
            <ReasonCard
              icon={<Star size={22} />}
              title="নেতৃত্ব বিকাশ"
              desc="নিজের মধ্যে নেতৃত্বের গুণাবলী তৈরি করুন"
              delay={150}
            />
            <ReasonCard
              icon={<Users size={22} />}
              title="ঐক্য"
              desc="একতাবদ্ধ হয়ে আরও শক্তিশালী হই"
              delay={300}
            />
            <ReasonCard
              icon={<Flag size={22} />}
              title="গণতন্ত্র"
              desc="গণতান্ত্রিক মূল্যবোধ রক্ষা করি"
              delay={450}
            />
          </div>
        </div>
      </section>

      {/* ===== MEMBER STATS COUNTER ===== */}
      <section
        data-ocid="landing.counter_section"
        className="py-16 px-4"
        style={{ background: "linear-gradient(135deg, #0d1117, #1a2332)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { target: 250, suffix: "+", label: "মোট সদস্য" },
            { target: 46, suffix: "", label: "বছরের ইতিহাস" },
            { target: 12, suffix: "", label: "পদবী বিভাগ" },
            { target: 1, suffix: "টি", label: "ডিজিটাল প্ল্যাটফর্ম" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-4xl font-black text-yellow-300 mb-2">
                <AnimatedCounter target={item.target} suffix={item.suffix} />
              </div>
              <div className="text-gray-400 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== LEADERSHIP SECTION ===== */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(to bottom, #f0fdf4, #ffffff)" }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "#006400" }}
            >
              আমাদের নেতৃত্ব
            </h2>
            <p className="text-gray-600">
              জাতীয় থেকে স্থানীয় — আমাদের নেতাদের সাথে পরিচিত হন
            </p>
            <div
              className="w-24 h-1 mx-auto mt-4"
              style={{ background: "#cc0000" }}
            />
          </div>

          {/* Central Chhatra Dal */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-center mb-6 flex items-center justify-center gap-2">
              <span
                className="text-white px-4 py-1 rounded-full text-sm"
                style={{ background: "#006400" }}
              >
                কেন্দ্রীয় ছাত্রদল
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <img
                  src="https://ui-avatars.com/api/?name=Sultan+Salahuddin+Tuku&background=006400&color=fff&size=120&bold=true"
                  alt="সুলতান সালাহউদ্দিন টুকু"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4"
                  style={{ borderColor: "#006400" }}
                />
                <h4 className="text-lg font-bold text-gray-800">
                  সুলতান সালাহউদ্দিন টুকু
                </h4>
                <span
                  className="inline-block text-xs px-3 py-1 rounded-full mt-1"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  সভাপতি
                </span>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <img
                  src="https://ui-avatars.com/api/?name=Nazimuddin+Alam&background=cc0000&color=fff&size=120&bold=true"
                  alt="নাজিমউদ্দিন আলম"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4"
                  style={{ borderColor: "#cc0000" }}
                />
                <h4 className="text-lg font-bold text-gray-800">
                  নাজিমউদ্দিন আলম
                </h4>
                <span
                  className="inline-block text-xs px-3 py-1 rounded-full mt-1"
                  style={{ background: "#fee2e2", color: "#991b1b" }}
                >
                  সাধারণ সম্পাদক
                </span>
              </div>
            </div>
          </div>

          {/* Khulna District */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-center mb-6">
              <span
                className="text-white px-4 py-1 rounded-full text-sm"
                style={{ background: "#006400" }}
              >
                খুলনা জেলা ছাত্রদল
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <img
                  src="https://ui-avatars.com/api/?name=Khulna+President&background=006400&color=fff&size=120&bold=true"
                  alt="খুলনা জেলা সভাপতি"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4"
                  style={{ borderColor: "#006400" }}
                />
                <h4 className="text-lg font-bold text-gray-800">
                  খুলনা জেলা সভাপতি
                </h4>
                <span
                  className="inline-block text-xs px-3 py-1 rounded-full mt-1"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  সভাপতি
                </span>
                <p className="text-xs text-gray-400 mt-2">
                  অ্যাডমিন প্যানেল থেকে আপডেট করুন
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <img
                  src="https://ui-avatars.com/api/?name=Khulna+Secretary&background=cc0000&color=fff&size=120&bold=true"
                  alt="খুলনা জেলা সাধারণ সম্পাদক"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4"
                  style={{ borderColor: "#cc0000" }}
                />
                <h4 className="text-lg font-bold text-gray-800">
                  খুলনা জেলা সাধারণ সম্পাদক
                </h4>
                <span
                  className="inline-block text-xs px-3 py-1 rounded-full mt-1"
                  style={{ background: "#fee2e2", color: "#991b1b" }}
                >
                  সাধারণ সম্পাদক
                </span>
                <p className="text-xs text-gray-400 mt-2">
                  অ্যাডমিন প্যানেল থেকে আপডেট করুন
                </p>
              </div>
            </div>
          </div>

          {/* Paikgacha Upazila */}
          <div>
            <h3 className="text-xl font-bold text-center mb-6">
              <span
                className="text-white px-4 py-1 rounded-full text-sm"
                style={{ background: "#006400" }}
              >
                পাইগাছা উপজেলা ছাত্রদল
              </span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <img
                  src="https://ui-avatars.com/api/?name=Paikgacha+President&background=006400&color=fff&size=120&bold=true"
                  alt="পাইগাছা উপজেলা সভাপতি"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4"
                  style={{ borderColor: "#006400" }}
                />
                <h4 className="text-lg font-bold text-gray-800">
                  পাইগাছা উপজেলা সভাপতি
                </h4>
                <span
                  className="inline-block text-xs px-3 py-1 rounded-full mt-1"
                  style={{ background: "#dcfce7", color: "#166534" }}
                >
                  সভাপতি
                </span>
                <p className="text-xs text-gray-400 mt-2">
                  অ্যাডমিন প্যানেল থেকে আপডেট করুন
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-1">
                <img
                  src="https://ui-avatars.com/api/?name=Paikgacha+Secretary&background=cc0000&color=fff&size=120&bold=true"
                  alt="পাইগাছা উপজেলা সাধারণ সম্পাদক"
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4"
                  style={{ borderColor: "#cc0000" }}
                />
                <h4 className="text-lg font-bold text-gray-800">
                  পাইগাছা উপজেলা সাধারণ সম্পাদক
                </h4>
                <span
                  className="inline-block text-xs px-3 py-1 rounded-full mt-1"
                  style={{ background: "#fee2e2", color: "#991b1b" }}
                >
                  সাধারণ সম্পাদক
                </span>
                <p className="text-xs text-gray-400 mt-2">
                  অ্যাডমিন প্যানেল থেকে আপডেট করুন
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        data-ocid="landing.cta_section"
        className="py-24 px-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #006A4E 0%, #004d38 50%, #DC143C 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "#FFD700", filter: "blur(80px)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "#DC143C", filter: "blur(80px)" }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div
            className="flex justify-center mb-6"
            style={{ animation: "rotateIn 0.8s ease" }}
          >
            <ChhatraLogo size={80} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            আজই ছাত্রদলে যোগ দিন
          </h2>
          <p className="text-green-100 text-lg mb-10">
            জাতীয়তাবাদী আদর্শের পতাকা তুলে ধরুন
          </p>
          <Link
            to="/register"
            data-ocid="landing.cta_register_button"
            className="inline-block px-10 py-4 rounded-xl font-bold text-green-900 text-lg transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FFA500)",
              boxShadow: "0 4px 24px rgba(255,215,0,0.4)",
            }}
          >
            এখনই নিবন্ধন করুন
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer
        data-ocid="landing.footer"
        style={{ background: "#1a2332" }}
        className="text-white pt-14 pb-6 px-4"
      >
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ChhatraLogo size={52} />
              <div>
                <p className="font-bold text-base leading-tight">২নং কপিলমুনি</p>
                <p className="text-green-300 text-sm">ইউনিয়ন ছাত্রদল</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              জাতীয়তাবাদী আদর্শে বিশ্বাসী তরুণ প্রজন্মের সংগঠন। দেশ ও জাতির কল্যাণে নিবেদিত।
            </p>
          </div>
          <div>
            <h4 className="font-bold text-base mb-4 text-yellow-300">
              দ্রুত লিংক
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/" as const, label: "হোম" },
                { to: "/committee" as const, label: "কমিটি" },
                { to: "/gallery" as const, label: "গ্যালারি" },
                { to: "/register" as const, label: "নিবন্ধন" },
                { to: "/login" as const, label: "লগইন" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-green-300 text-sm transition-colors duration-200 flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-base mb-4 text-yellow-300">যোগাযোগ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-green-400">📍</span>কপিলমুনি ইউনিয়ন
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🏙️</span>কয়রা উপজেলা
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🗺️</span>খুলনা জেলা
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">🇧🇩</span>বাংলাদেশ
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs text-center">
            © ২০২৪ ২নং কপিলমুনি ইউনিয়ন ছাত্রদল। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <p className="text-gray-600 text-xs">
            Built with{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-500 hover:text-green-400 transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
