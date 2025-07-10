import { Lightbulb, Wallet, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Lightbulb className="w-20 h-20 text-blue-700 glow" />,
    title: "Daftarkan dirimu",
    desc: "Kami percaya setiap mahasiswa punya potensi, daftarkan dirimu dan buktikan kontribusimu.",
  },
  {
    icon: <Wallet className="w-20 h-20 text-blue-700 bounce-slow" />,
    title: "Dapatkan pengalaman nyata",
    desc: "Ikuti strategi kerja profesional langsung dari instansi pemerintahan.",
  },
  {
    icon: <Rocket className="w-20 h-20 text-blue-700 fly" />,
    title: "Tingkatkan portofolio",
    desc: "Bangun pengalaman kerja nyata untuk mendukung karier masa depanmu.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        {features.map((item, index) => (
          <motion.div
            key={index}
            className="space-y-4"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center">{item.icon}</div>
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-gray-600 text-base">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
