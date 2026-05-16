import type { SiteSettings } from "@/backend";
import { useBackend } from "@/hooks/useBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeader, Spinner } from "./AdminShared";

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "২নং কপিলমুনি ইউনিয়ন ছাত্রদল",
  centerName: "২নং কপিলমুনি ইউনিয়ন",
  upazilaName: "পাইকগাছা উপজেলা",
  unionName: "কপিলমুনি ইউনিয়ন",
  adminSignature: "",
};

export function SiteSettingsSection({
  show,
}: {
  show: (msg: string, type?: "success" | "error") => void;
}) {
  const { actor } = useBackend();
  const qc = useQueryClient();
  const [form, setForm] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return DEFAULT_SETTINGS;
      return actor.getSiteSettings();
    },
    enabled: !!actor,
  });

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const updateSettings = useMutation({
    mutationFn: async (newSettings: SiteSettings) => {
      if (!actor) throw new Error("no actor");
      return actor.updateSiteSettings(newSettings);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["siteSettings"] });
      show("সাইট সেটিংস সফলভাবে সংরক্ষণ হয়েছে");
    },
    onError: () => show("সংরক্ষণ ব্যর্থ হয়েছে", "error"),
  });

  function handleChange(field: keyof SiteSettings, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const fields: Array<{
    key: keyof SiteSettings;
    label: string;
    description: string;
    placeholder: string;
  }> = [
    {
      key: "siteName",
      label: "সাইটের নাম",
      description: "ওয়েবসাইটের শিরোনাম যা সব জায়গায় দেখা যাবে",
      placeholder: "যেমন: ২নং কপিলমুনি ইউনিয়ন ছাত্রদল",
    },
    {
      key: "centerName",
      label: "কেন্দ্রের নাম",
      description: "সংগঠনের কেন্দ্রীয় নাম",
      placeholder: "যেমন: কেন্দ্রীয় কমিটি",
    },
    {
      key: "upazilaName",
      label: "উপজেলার নাম",
      description: "সংগঠন যে উপজেলায় অবস্থিত",
      placeholder: "যেমন: পাইকগাছা উপজেলা",
    },
    {
      key: "unionName",
      label: "ইউনিয়নের নাম",
      description: "সংগঠন যে ইউনিয়নে অবস্থিত",
      placeholder: "যেমন: কপিলমুনি ইউনিয়ন",
    },
    {
      key: "adminSignature",
      label: "অ্যাডমিন সিগনেচার",
      description: "অনুমোদিত সদস্যের সার্টিফিকেটে প্রদর্শিত সিগনেচার",
      placeholder: "যেমন: মো. রফিকুল ইসলাম, সভাপতি",
    },
  ];

  return (
    <div data-ocid="admin.site_settings_section">
      <SectionHeader
        icon="⚙️"
        title="সাইট সেটিংস"
        description="ওয়েবসাইটের নাম, কেন্দ্র, উপজেলা এবং ইউনিয়নের নাম পরিবর্তন করুন"
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-2xl">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="space-y-5">
              {fields.map(({ key, label, description, placeholder }) => (
                <div key={key} className="space-y-1.5">
                  <label
                    htmlFor={key}
                    className="block text-sm font-semibold text-[#1a2e1a]"
                  >
                    {label}
                  </label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                  {key === "adminSignature" ? (
                    <textarea
                      id={key}
                      data-ocid={`admin.settings.${key}_input`}
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      rows={3}
                      className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E] resize-none"
                    />
                  ) : (
                    <input
                      id={key}
                      data-ocid={`admin.settings.${key}_input`}
                      type="text"
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={placeholder}
                      className="w-full border border-input rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#006A4E]"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-border">
              <button
                type="button"
                data-ocid="admin.settings.save_button"
                disabled={updateSettings.isPending}
                onClick={() => updateSettings.mutate(form)}
                className="bg-[#006A4E] hover:bg-green-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:opacity-60 transition-colors shadow-sm"
              >
                {updateSettings.isPending ? (
                  <Spinner />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">
              💡 সেটিংস পরিবর্তন করলে সম্পূর্ণ ওয়েবসাইটে প্রভাব পড়বে। সিগনেচার শুধুমাত্র
              ভবিষ্যতের অনুমোদনে ব্যবহৃত হবে।
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
