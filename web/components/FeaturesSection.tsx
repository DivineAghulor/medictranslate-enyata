import { ImageUp, Languages, HeartPulse, LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: ImageUp,
    title: "Upload Images",
    description:
      "Easily upload an image of your lab test result. Our system processes and extracts the relevant medical values and text.",
  },
  {
    icon: Languages,
    title: "Clear Translations",
    description:
      "We translate complex medical terminology into user-friendly explanations so you understand exactly what it means.",
  },
  {
    icon: HeartPulse,
    title: "Health Insights",
    description:
      "Get context around the likely significance of values and guidance on when to seek professional hospital care.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Making health knowledge accessible
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed">
            Many people receive lab reports that are difficult to interpret
            without medical training. MedicTranslate addresses this seamlessly.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-50 rounded-[var(--radius)] p-8 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-white rounded-[var(--radius)] shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-green-600">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
