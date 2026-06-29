import { StarIcon } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Sarah K.",
        role: "Marketing Director",
        avatar: "S",
        text: "The AI composer generates high-fidelity outlines instantly. It has completely automated our scheduling operations.",
    },
    {
        name: "Marcus L.",
        role: "Indie Creator",
        avatar: "M",
        text: "Scheduler's minimal interface is its superpower. I planning and queuing a full week of copy in under 15 minutes.",
    },
    {
        name: "Priya D.",
        role: "Founder, Zenith",
        avatar: "P",
        text: "We wanted a platform that felt calm, precise, and beautiful. The clean typography and terracotta details feel extremely premium.",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-bg border-b border-border">
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                    <span className="text-[10px] font-bold text-primary bg-primary-subtle border border-primary-light px-3 py-1 rounded-full uppercase tracking-wider">
                         Endorsements
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-serif font-light text-text leading-tight">
                         Trusted by modern <span className="font-serif italic font-normal text-primary">publishers.</span>
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">
                         Read opinions from developers, creators, and teams managing social accounts daily.
                    </p>
                </div>

                {/* Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-white rounded-2xl border border-border p-6 hover:border-border-hover transition-all duration-300 flex flex-col justify-between gap-5 shadow-xs"
                        >
                            <p className="text-text-secondary text-xs italic font-serif leading-relaxed flex-1">
                                 "{t.text}"
                            </p>
                            <div className="flex items-center gap-3 pt-4 border-t border-border">
                                <div className="size-8 rounded-xl bg-primary-subtle text-primary flex items-center justify-center text-xs font-bold shrink-0 border border-primary-light">
                                     {t.avatar}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs font-semibold text-text truncate">{t.name}</div>
                                    <div className="text-[10px] text-text-muted mt-0.5 truncate font-medium">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
