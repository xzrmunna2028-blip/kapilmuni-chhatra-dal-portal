import ChhatraLogo from "@/components/ChhatraLogo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  Calendar,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { label: "প্রতিষ্ঠিত", value: "১৯৭৯", icon: Calendar },
  { label: "জেলা", value: "খুলনা", icon: Building2 },
  { label: "সদস্য পদ", value: "সক্রিয়", icon: Users },
];

const FEATURES = [
  {
    icon: Users,
    title: "সদস্য ব্যবস্থাপনা",
    subtitle: "Member Management",
    desc: "সহজেই সদস্য নিবন্ধন করুন, পদ অনুযায়ী কমিটি দেখুন এবং ডিজিটাল সদস্য পত্র ডাউনলোড করুন।",
  },
  {
    icon: MessageSquare,
    title: "গ্রুপ চ্যাট",
    subtitle: "Group Chat",
    desc: "সকল নিবন্ধিত সদস্যদের জন্য রিয়েল-টাইম মেসেজিং সিস্টেম — মতামত ও সংবাদ শেয়ার করুন।",
  },
  {
    icon: BookOpen,
    title: "নোটিশ বোর্ড",
    subtitle: "Notice Board",
    desc: "সর্বশেষ নোটিশ, ঘোষণা ও কর্মসূচি এক জায়গায় পান। কখনো কোনো গুরুত্বপূর্ণ তথ্য মিস করবেন না।",
  },
  {
    icon: Shield,
    title: "নিরাপদ পোর্টাল",
    subtitle: "Secure Portal",
    desc: "প্রশাসনিক নিয়ন্ত্রণ সহ সম্পূর্ণ নিরাপদ প্ল্যাটফর্ম — শুধুমাত্র অনুমোদিত সদস্যদের জন্য।",
  },
];

export default function LandingPage() {
  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* HEADER */}
      <header
        className="sticky top-0 z-50 border-b shadow-lg"
        style={{ background: "#006A4E" }}
      >
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 shrink-0"
            data-ocid="landing.logo_link"
          >
            <ChhatraLogo size={44} />
          </Link>
          <div className="flex-1 min-w-0">
            <h1
              className="text-sm md:text-base font-bold text-white leading-tight truncate"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ২নং কপিলমুনি ইউনিয়ন ছাত্রদল পোর্টাল
            </h1>
            <p className="text-xs text-white/60 hidden sm:block">
              Bangladesh Jatiotabadi Chhatra Dal
            </p>
          </div>
          <nav className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollToAbout}
              className="px-4 py-1.5 text-sm font-semibold rounded-full border border-white/50 text-white hover:bg-white/10 transition-smooth"
              data-ocid="landing.about_nav_link"
            >
              সম্পর্কে
            </button>
            <Link
              to="/login"
              className="px-4 py-1.5 text-sm font-semibold rounded-full border border-white/50 text-white hover:bg-white/10 transition-smooth"
              data-ocid="landing.login_nav_link"
            >
              লগইন
            </Link>
            <Link
              to="/register"
              className="px-4 py-1.5 text-sm font-bold rounded-full text-white transition-smooth"
              style={{ background: "#DC143C" }}
              data-ocid="landing.register_nav_button"
            >
              সদস্য হন
            </Link>
          </nav>
          <div className="flex md:hidden items-center gap-1">
            <Link
              to="/login"
              className="px-3 py-1 text-xs font-semibold rounded-full border border-white/50 text-white"
              data-ocid="landing.mobile_login_link"
            >
              লগইন
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative flex-1 flex items-center justify-center min-h-[92vh] overflow-hidden"
        data-ocid="landing.hero_section"
        style={{
          background:
            "linear-gradient(135deg, #003d2e 0%, #006A4E 40%, #8B0000 80%, #DC143C 100%)",
        }}
      >
        {/* Diagonal stripes pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #FFD700 0px, #FFD700 2px, transparent 2px, transparent 28px)",
          }}
        />
        {/* Flag radial glows */}
        <div
          className="absolute top-8 right-12 w-72 h-72 rounded-full opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #FFD700 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-16 left-8 w-56 h-56 rounded-full opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #DC143C 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-screen-lg mx-auto px-4 py-20 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div
              className="p-3 rounded-full shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(4px)",
              }}
            >
              <ChhatraLogo size={120} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-3"
          >
            <Badge
              className="self-center px-4 py-1 text-xs font-semibold border tracking-widest uppercase"
              style={{
                background: "rgba(220,20,60,0.25)",
                borderColor: "#FFD700",
                color: "#FFD700",
              }}
            >
              Bangladesh Zindabad 🇧🇩
            </Badge>

            <h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              ২নং কপিলমুনি
              <br />
              <span style={{ color: "#FFD700" }}>ইউনিয়ন ছাত্রদল</span>
              <br />
              <span className="text-white">পোর্টাল</span>
            </h2>

            <p
              className="text-lg md:text-xl text-white/85 mt-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              শিক্ষা, ঐক্য, অগ্রগতি <span className="text-white/60">|</span>{" "}
              <span style={{ color: "#FFD700" }}>Bangladesh Zindabad</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link to="/register" data-ocid="landing.get_started_button">
              <Button
                size="lg"
                className="px-10 py-3 text-lg font-bold rounded-full shadow-xl transition-smooth hover:scale-105"
                style={{
                  background: "#DC143C",
                  color: "white",
                  border: "none",
                }}
              >
                Get Started
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToAbout}
              className="px-10 py-3 text-lg font-bold rounded-full border-2 border-white text-white bg-transparent hover:bg-white/10 transition-smooth"
              data-ocid="landing.learn_more_button"
            >
              আরো জানুন
            </Button>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </div>
        </motion.div>
      </section>

      {/* STATS BAR */}
      <section
        className="py-8"
        style={{ background: "#006A4E" }}
        data-ocid="landing.stats_section"
      >
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="flex items-center justify-center gap-4 rounded-xl px-6 py-5 border"
                style={{
                  background: "rgba(0,0,0,0.2)",
                  borderColor: "#FFD700",
                  borderWidth: "1px",
                }}
                data-ocid={`landing.stat.${i + 1}`}
              >
                <stat.icon size={32} style={{ color: "#FFD700" }} />
                <div className="text-left">
                  <p
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section
        id="about"
        className="py-20"
        style={{ background: "#f8f9f4" }}
        data-ocid="landing.about_section"
      >
        <div className="max-w-screen-lg mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-shrink-0 flex justify-center"
            >
              <div
                className="p-6 rounded-full shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #006A4E, #003d2e)",
                }}
              >
                <ChhatraLogo size={160} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="flex-1 min-w-0"
            >
              <Badge
                className="mb-3 px-3 py-1 text-xs font-semibold"
                style={{ background: "#DC143C", color: "white" }}
              >
                আমাদের সম্পর্কে
              </Badge>
              <h3
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-display)", color: "#006A4E" }}
              >
                বাংলাদেশ জাতীয়তাবাদী ছাত্রদল সম্পর্কে
              </h3>
              <p
                className="text-base mb-4"
                style={{ color: "#333", lineHeight: "1.8" }}
              >
                বাংলাদেশ জাতীয়তাবাদী ছাত্রদল (BJCD) বাংলাদেশ জাতীয়তাবাদী দল (BNP)-এর ছাত্র
                সংগঠন। এটি <strong>১ জানুয়ারি ১৯৭৯</strong> সালে মহামান্য রাষ্ট্রপতি{" "}
                <strong>জিয়াউর রহমান</strong>-এর নেতৃত্বে প্রতিষ্ঠিত হয়।
              </p>
              <p
                className="text-base mb-6"
                style={{ color: "#333", lineHeight: "1.8" }}
              >
                গণতান্ত্রিক মূল্যবোধ, ছাত্র অধিকার এবং বাংলাদেশি জাতীয়তাবাদের আদর্শে অনুপ্রাণিত
                এই সংগঠন দেশের প্রতিটি কোণে শিক্ষার্থীদের অধিকার প্রতিষ্ঠায় নিরলস কাজ করে
                যাচ্ছে।
              </p>
              <p
                className="text-sm mb-6"
                style={{ color: "#666", fontStyle: "italic" }}
              >
                Bangladesh Jatiotabadi Chhatra Dal (BJCD) is the student wing of
                BNP, founded on January 1, 1979, dedicated to democratic values
                and student rights across Bangladesh.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/committee" data-ocid="landing.committee_link">
                  <Button
                    style={{ background: "#006A4E", color: "white" }}
                    className="font-semibold rounded-full px-6"
                  >
                    কমিটি দেখুন
                  </Button>
                </Link>
                <Link to="/register" data-ocid="landing.about_register_link">
                  <Button
                    variant="outline"
                    className="font-semibold rounded-full px-6 border-2"
                    style={{ borderColor: "#DC143C", color: "#DC143C" }}
                  >
                    সদস্য হন
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SLOGAN BANNER */}
      <section
        className="py-10"
        style={{ background: "#DC143C" }}
        data-ocid="landing.slogan_section"
      >
        <div className="max-w-screen-lg mx-auto px-4 flex items-center justify-center gap-6">
          <div
            className="h-px flex-1"
            style={{ background: "rgba(255,215,0,0.6)" }}
          />
          <motion.h3
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-bold text-white text-center"
            style={{
              fontFamily: "var(--font-display)",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            বাংলাদেশ জিন্দাবাদ 🇧🇩
          </motion.h3>
          <div
            className="h-px flex-1"
            style={{ background: "rgba(255,215,0,0.6)" }}
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        className="py-20"
        style={{ background: "#fff" }}
        data-ocid="landing.features_section"
      >
        <div className="max-w-screen-lg mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge
              className="mb-3 px-3 py-1 text-xs font-semibold"
              style={{ background: "#006A4E", color: "white" }}
            >
              পোর্টালের সুবিধা
            </Badge>
            <h3
              className="text-3xl md:text-4xl font-bold"
              style={{ fontFamily: "var(--font-display)", color: "#006A4E" }}
            >
              আমাদের লক্ষ্য
            </h3>
            <p className="text-base mt-3" style={{ color: "#666" }}>
              শিক্ষা, ঐক্য ও অগ্রগতির পথে — আপনার সব প্রয়োজন এক পোর্টালে
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-6 border-2 flex flex-col gap-4 hover:shadow-lg transition-smooth"
                style={{ borderColor: "#e8f4f0", background: "#f8fdf9" }}
                data-ocid={`landing.feature.${i + 1}`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #006A4E, #004d38)",
                  }}
                >
                  <f.icon size={22} color="white" />
                </div>
                <div>
                  <h4
                    className="font-bold text-lg mb-1"
                    style={{
                      color: "#006A4E",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {f.title}
                  </h4>
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: "#DC143C" }}
                  >
                    {f.subtitle}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#555" }}
                  >
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section
        className="py-16"
        style={{
          background:
            "linear-gradient(135deg, #003d2e 0%, #006A4E 60%, #004d38 100%)",
        }}
        data-ocid="landing.cta_section"
      >
        <div className="max-w-screen-lg mx-auto px-4 text-center flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3
              className="text-3xl md:text-4xl font-bold text-white mb-3"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
              }}
            >
              আজই ছাত্রদলে যোগ দিন
            </h3>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-6">
              দেশের জন্য, শিক্ষার জন্য, গণতন্ত্রের জন্য — আমাদের সাথে থাকুন
            </p>
            <Link to="/register" data-ocid="landing.cta_register_button">
              <Button
                size="lg"
                className="px-12 py-4 text-lg font-bold rounded-full shadow-2xl hover:scale-105 transition-smooth"
                style={{
                  background: "#DC143C",
                  color: "white",
                  border: "none",
                }}
              >
                এখনই নিবন্ধন করুন
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-10"
        style={{ background: "#003d2e" }}
        data-ocid="landing.footer"
      >
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col items-center gap-4">
          <ChhatraLogo size={72} />
          <p
            className="text-xl font-bold text-white text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ২নং কপিলমুনি ইউনিয়ন ছাত্রদল
          </p>
          <p className="text-sm text-white/60 text-center">
            Bangladesh Jatiotabadi Chhatra Dal — Khulna
          </p>
          <div
            className="h-px w-48 my-2"
            style={{ background: "rgba(255,215,0,0.3)" }}
          />
          <p className="text-sm text-white/70 text-center">
            © ২নং কপিলমুনি ইউনিয়ন ছাত্রদল - সর্বস্বত্ব সংরক্ষিত
          </p>
        </div>
      </footer>
    </div>
  );
}
