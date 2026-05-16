import { ExternalBlob } from "@/backend";
import ChhatraLogo from "@/components/ChhatraLogo";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useRegisterMember } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, CheckCircle, Loader2, Upload, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// ── types ──────────────────────────────────────────────────────────────────────
interface FormValues {
  fullName: string;
  phone: string;
  email: string;
  designation: string;
  fullAddress: string;
  joinReasons: string[];
}

// ── congratulations modal ───────────────────────────────────────────────────────
function CongratulationsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-ocid="congrats.dialog"
    >
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="presentation"
        aria-hidden="true"
      />
      <div
        className="relative z-10 bg-card rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in fade-in zoom-in-95 duration-300"
        role="document"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-smooth"
          aria-label="মোডাল বন্ধ করুন"
          data-ocid="congrats.close_button"
        >
          <X size={20} />
        </button>

        {/* logo */}
        <div className="flex justify-center mb-4">
          <ChhatraLogo size={80} />
        </div>

        <h2
          className="font-display text-3xl font-bold mb-2"
          style={{ color: "#DC143C" }}
        >
          অভিনন্দন! 🎉
        </h2>

        <p className="text-foreground font-semibold text-lg mb-1">
          আপনার নিবন্ধন সফলভাবে সম্পন্ন হয়েছে!
        </p>
        <p className="text-muted-foreground text-sm mb-6">
          আপনার আবেদন অনুমোদনের জন্য অপেক্ষা করুন। অ্যাডমিন শীঘ্রই আপনার আবেদন পর্যালোচনা
          করবেন।
        </p>

        <div
          className="rounded-xl p-4 mb-6 text-sm"
          style={{ background: "#006A4E15", border: "1px solid #006A4E40" }}
        >
          <p className="text-[#006A4E] font-medium">
            ২নং কপিলমুনি ইউনিয়ন ছাত্রদলে স্বাগতম!
          </p>
        </div>

        <Button
          type="button"
          onClick={onClose}
          className="w-full text-white font-bold py-2.5"
          style={{ background: "#006A4E" }}
          data-ocid="congrats.confirm_button"
        >
          ঠিক আছে, লগইন করুন
        </Button>
      </div>
    </div>
  );
}

// ── designation options ─────────────────────────────────────────────────────────
const DESIGNATIONS = [
  { value: "সভাপতি", label: "সভাপতি" },
  { value: "সিনিয়র সহ-সভাপতি", label: "সিনিয়র সহ-সভাপতি" },
  { value: "সহ-সভাপতি", label: "সহ-সভাপতি" },
  { value: "সাধারণ সম্পাদক", label: "সাধারণ সম্পাদক" },
  { value: "যুগ্ম সাধারণ সম্পাদক", label: "যুগ্ম সাধারণ সম্পাদক" },
  { value: "সাংগঠনিক সম্পাদক", label: "সাংগঠনিক সম্পাদক" },
  { value: "দপ্তর সম্পাদক", label: "দপ্তর সম্পাদক" },
  { value: "প্রচার সম্পাদক", label: "প্রচার সম্পাদক" },
  { value: "অর্থ সম্পাদক", label: "অর্থ সম্পাদক" },
  { value: "ত্রাণ ও সমাজকল্যাণ সম্পাদক", label: "ত্রাণ ও সমাজকল্যাণ সম্পাদক" },
  { value: "আইন বিষয়ক সম্পাদক", label: "আইন বিষয়ক সম্পাদক" },
  { value: "বিজ্ঞান ও প্রযুক্তি সম্পাদক", label: "বিজ্ঞান ও প্রযুক্তি সম্পাদক" },
  { value: "তথ্য ও গবেষণা সম্পাদক", label: "তথ্য ও গবেষণা সম্পাদক" },
  { value: "সাহিত্য ও সংস্কৃতি সম্পাদক", label: "সাহিত্য ও সংস্কৃতি সম্পাদক" },
  { value: "ক্রীড়া সম্পাদক", label: "ক্রীড়া সম্পাদক" },
  { value: "স্বাস্থ্য বিষয়ক সম্পাদক", label: "স্বাস্থ্য বিষয়ক সম্পাদক" },
  { value: "শিক্ষা বিষয়ক সম্পাদক", label: "শিক্ষা বিষয়ক সম্পাদক" },
  { value: "পাঠাগার সম্পাদক", label: "পাঠাগার সম্পাদক" },
  { value: "মানব সম্পদ উন্নয়ন সম্পাদক", label: "মানব সম্পদ উন্নয়ন সম্পাদক" },
  { value: "কৃষি বিষয়ক সম্পাদক", label: "কৃষি বিষয়ক সম্পাদক" },
  { value: "শ্রম বিষয়ক সম্পাদক", label: "শ্রম বিষয়ক সম্পাদক" },
  { value: "আন্তর্জাতিক বিষয়ক সম্পাদক", label: "আন্তর্জাতিক বিষয়ক সম্পাদক" },
  { value: "ধর্ম বিষয়ক সম্পাদক", label: "ধর্ম বিষয়ক সম্পাদক" },
  { value: "কার্যনির্বাহী সদস্য", label: "কার্যনির্বাহী সদস্য" },
  { value: "কনভেনর", label: "কনভেনর" },
  { value: "যুগ্ম কনভেনর", label: "যুগ্ম কনভেনর" },
  { value: "সিনিয়র যুগ্ম কনভেনর", label: "সিনিয়র যুগ্ম কনভেনর" },
  { value: "সাধারণ সদস্য", label: "সাধারণ সদস্য" },
];

// ── join reasons ──────────────────────────────────────────────────────────────
const JOIN_REASONS = [
  "দেশমাতৃকার সেবা করতে চাই",
  "বিএনপির আদর্শে বিশ্বাসী",
  "জাতীয়তাবাদী আন্দোলনে অংশ নিতে চাই",
  "ছাত্রসমাজের অধিকার রক্ষা করতে চাই",
  "গণতন্ত্র পুনরুদ্ধারে ভূমিকা রাখতে চাই",
  "শিক্ষাঙ্গনে শান্তি ও শৃঙ্খলা প্রতিষ্ঠা করতে চাই",
  "তরুণ প্রজন্মের নেতৃত্ব গড়তে চাই",
  "সামাজিক উন্নয়নে কাজ করতে চাই",
  "দুর্নীতিমুক্ত বাংলাদেশ চাই",
  "খালেদা জিয়ার মুক্তি ও গণতন্ত্র প্রতিষ্ঠায় লড়াই করতে চাই",
  "দলের সাংগঠনিক কাজে সহায়তা করতে চাই",
  "নতুন বাংলাদেশ গড়তে চাই",
];

// ── main component ──────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMember = useRegisterMember();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      designation: "",
      fullAddress: "",
      joinReasons: [],
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [showCongrats, setShowCongrats] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("ছবির সাইজ ৫ MB এর বেশি হবে না।");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhotoError("শুধুমাত্র JPG/PNG ছবি আপলোড করুন।");
      return;
    }
    setPhotoError(null);
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitError(null);

    if (!photoFile) {
      setPhotoError("পাসপোর্ট ছবি আবশ্যক।");
      return;
    }

    try {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(photoFile);
      });
      const photoBlob = ExternalBlob.fromURL(dataUrl);

      await registerMember.mutateAsync({
        fullName: values.fullName,
        phone: `+880${values.phone.replace(/^0/, "")}`,
        email: values.email,
        designation: values.designation,
        fullAddress: values.fullAddress,
        joinReason: values.joinReasons.join("\n"),
        photoBlob,
      });

      setShowCongrats(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "নিবন্ধন ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।",
      );
    }
  };

  const handleCongratsClose = () => {
    setShowCongrats(false);
    navigate({ to: "/login" });
  };

  const fieldClass = useMemo(
    () =>
      "w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-[#006A4E] focus:border-[#006A4E] transition-smooth placeholder:text-muted-foreground",
    [],
  );

  return (
    <Layout showSidebar={false}>
      <div
        className="max-w-xl mx-auto py-6 md:py-10 px-2"
        data-ocid="register.page"
      >
        {/* Header card */}
        <div
          className="rounded-t-2xl px-6 py-5 flex items-center gap-4"
          style={{ background: "#006A4E" }}
        >
          <ChhatraLogo size={56} />
          <div>
            <h1 className="font-display text-white text-xl md:text-2xl font-bold leading-tight">
              নতুন সদস্য নিবন্ধন
            </h1>
            <p className="text-white/70 text-xs mt-0.5">
              New Member Registration — ২নং কপিলমুনি ইউনিয়ন ছাত্রদল
            </p>
          </div>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="bg-card rounded-b-2xl shadow-lg border border-border border-t-0 px-6 py-6 space-y-5"
          data-ocid="register.form"
        >
          {/* Full Name */}
          <div className="space-y-1">
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-foreground"
            >
              পূর্ণ নাম <span className="text-[#DC143C]">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (Full Name)
              </span>
            </label>
            <input
              id="fullName"
              {...register("fullName", { required: "পূর্ণ নাম আবশ্যক" })}
              placeholder="আপনার পূর্ণ নাম লিখুন"
              className={fieldClass}
              data-ocid="register.fullname_input"
            />
            {errors.fullName && (
              <p
                className="text-xs text-[#DC143C] mt-0.5"
                data-ocid="register.fullname_field_error"
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-foreground"
            >
              ফোন নম্বর <span className="text-[#DC143C]">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (Phone)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input bg-muted text-sm font-semibold text-foreground select-none whitespace-nowrap">
                🇧🇩 +880
              </span>
              <input
                {...register("phone", {
                  required: "ফোন নম্বর আবশ্যক",
                  pattern: {
                    value: /^0?[0-9]{9,10}$/,
                    message: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন",
                  },
                })}
                id="phone"
                placeholder="1XXXXXXXXX"
                type="tel"
                className={`${fieldClass} flex-1`}
                data-ocid="register.phone_input"
              />
            </div>
            {errors.phone && (
              <p
                className="text-xs text-[#DC143C] mt-0.5"
                data-ocid="register.phone_field_error"
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-foreground"
            >
              ইমেইল <span className="text-[#DC143C]">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (Email)
              </span>
            </label>
            <input
              id="email"
              {...register("email", {
                required: "ইমেইল আবশ্যক",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "সঠিক ইমেইল ঠিকানা দিন",
                },
              })}
              type="email"
              placeholder="example@email.com"
              className={fieldClass}
              data-ocid="register.email_input"
            />
            {errors.email && (
              <p
                className="text-xs text-[#DC143C] mt-0.5"
                data-ocid="register.email_field_error"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-1">
            <label
              htmlFor="designation"
              className="block text-sm font-semibold text-foreground"
            >
              পদবি <span className="text-[#DC143C]">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (Designation)
              </span>
            </label>
            <Controller
              name="designation"
              control={control}
              rules={{ required: "পদবি নির্বাচন করুন" }}
              render={({ field }) => (
                <select
                  id="designation"
                  {...field}
                  className={fieldClass}
                  data-ocid="register.designation_select"
                >
                  <option value="">পদবি নির্বাচন করুন</option>
                  {DESIGNATIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.designation && (
              <p
                className="text-xs text-[#DC143C] mt-0.5"
                data-ocid="register.designation_field_error"
              >
                {errors.designation.message}
              </p>
            )}
          </div>

          {/* Full Address */}
          <div className="space-y-1">
            <label
              htmlFor="fullAddress"
              className="block text-sm font-semibold text-foreground"
            >
              পূর্ণ ঠিকানা <span className="text-[#DC143C]">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (Full Address)
              </span>
            </label>
            <textarea
              id="fullAddress"
              {...register("fullAddress", { required: "পূর্ণ ঠিকানা আবশ্যক" })}
              rows={3}
              placeholder="গ্রাম, ইউনিয়ন, উপজেলা, জেলা"
              className={`${fieldClass} resize-none`}
              data-ocid="register.address_textarea"
            />
            {errors.fullAddress && (
              <p
                className="text-xs text-[#DC143C] mt-0.5"
                data-ocid="register.address_field_error"
              >
                {errors.fullAddress.message}
              </p>
            )}
          </div>

          {/* Why Join — checkbox grid */}
          <div className="space-y-2">
            <p
              id="joinreasons-label"
              className="block text-sm font-semibold text-foreground"
            >
              কেন ছাত্রদলে যোগ দিতে চান? <span className="text-[#DC143C]">*</span>
              <span className="block text-xs font-normal text-muted-foreground mt-0.5">
                (একাধিক নির্বাচন করুন)
              </span>
            </p>
            <Controller
              name="joinReasons"
              control={control}
              rules={{
                validate: (v) => v.length > 0 || "অন্তত একটি কারণ নির্বাচন করুন",
              }}
              render={({ field }) => (
                <fieldset
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-0 p-0 m-0"
                  aria-labelledby="joinreasons-label"
                  data-ocid="register.joinreason_select"
                >
                  {JOIN_REASONS.map((reason, idx) => {
                    const checked = field.value.includes(reason);
                    return (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => {
                          const next = checked
                            ? field.value.filter((r) => r !== reason)
                            : [...field.value, reason];
                          field.onChange(next);
                        }}
                        className={`flex items-start gap-2.5 px-3 py-2.5 rounded-lg border text-left text-sm font-medium transition-all duration-200 ${
                          checked
                            ? "border-[#006A4E] bg-[#006A4E]/10 text-[#006A4E]"
                            : "border-border bg-background text-foreground hover:border-[#006A4E]/50 hover:bg-[#006A4E]/5"
                        }`}
                        data-ocid={`register.joinreason.item.${idx + 1}`}
                        aria-pressed={checked}
                      >
                        <span
                          className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                            checked
                              ? "border-[#006A4E] bg-[#006A4E]"
                              : "border-muted-foreground"
                          }`}
                        >
                          {checked && (
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="none"
                              viewBox="0 0 10 8"
                              aria-hidden="true"
                            >
                              <path
                                d="M1 4l3 3 5-6"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </span>
                        <span className="leading-snug">{reason}</span>
                      </button>
                    );
                  })}
                </fieldset>
              )}
            />
            {errors.joinReasons && (
              <p
                className="text-xs text-[#DC143C] mt-0.5"
                data-ocid="register.joinreason_field_error"
              >
                {errors.joinReasons.message}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label
              htmlFor="photoInput"
              className="block text-sm font-semibold text-foreground"
            >
              পাসপোর্ট সাইজ ছবি <span className="text-[#DC143C]">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (Passport Photo)
              </span>
            </label>
            <p className="text-xs text-muted-foreground">
              JPG/PNG, সর্বোচ্চ ৫ MB
            </p>

            {!photoFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-border hover:border-[#006A4E] bg-muted/30 hover:bg-[#006A4E]/5 py-8 flex flex-col items-center gap-2 transition-smooth cursor-pointer"
                data-ocid="register.photo_upload_button"
              >
                <Upload size={28} className="text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  ছবি নির্বাচন করুন
                </span>
                <span className="text-xs text-muted-foreground">
                  Click to select photo
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-4 p-3 rounded-xl border border-[#006A4E]/40 bg-[#006A4E]/5">
                <img
                  src={photoPreview!}
                  alt="পাসপোর্ট ছবি"
                  className="w-16 h-20 object-cover rounded-lg border border-border shadow"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {photoFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(photoFile.size / 1024).toFixed(0)} KB
                  </p>
                  <span className="inline-flex items-center gap-1 text-[#006A4E] text-xs font-semibold mt-1">
                    <CheckCircle size={12} /> ছবি নির্বাচিত
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-smooth"
                  aria-label="ছবি মুছুন"
                  data-ocid="register.photo_remove_button"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <input
              id="photoInput"
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handlePhotoChange}
              className="sr-only"
              aria-label="পাসপোর্ট ছবি আপলোড"
              data-ocid="register.photo_input"
            />
            {photoError && (
              <p
                className="text-xs text-[#DC143C]"
                data-ocid="register.photo_field_error"
              >
                {photoError}
              </p>
            )}
          </div>

          {/* Submit error */}
          {submitError && (
            <div
              className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/30 p-3"
              data-ocid="register.error_state"
            >
              <AlertCircle
                size={16}
                className="text-destructive shrink-0 mt-0.5"
              />
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={registerMember.isPending}
            className="w-full py-3 text-base font-bold text-white transition-smooth"
            style={{
              background: registerMember.isPending ? undefined : "#DC143C",
            }}
            data-ocid="register.submit_button"
          >
            {registerMember.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                নিবন্ধন হচ্ছে...
              </span>
            ) : (
              "নিবন্ধন করুন"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            ইতিমধ্যে সদস্য?{" "}
            <a
              href="/login"
              className="text-[#006A4E] font-semibold hover:underline"
            >
              লগইন করুন
            </a>
          </p>
        </form>
      </div>

      {/* Congratulations Modal */}
      {showCongrats && <CongratulationsModal onClose={handleCongratsClose} />}
    </Layout>
  );
}
