import { ArrowRightIcon, CheckCircleIcon } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    { step: "01", title: "Authorize workspaces", description: "Connect your social channel accounts in a single click using OAuth flow endpoints." },
    { step: "02", title: "Draft and review", description: "Utilize our AI generation prompts or write your calendar updates manually." },
    { step: "03", title: "Automate delivery", description: "Configure peak publish times, select destinations, and let the scheduler coordinate." },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-white border-b border-border">
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left side: Content */}
                <div className="lg:col-span-5 space-y-5 text-left">
                    <span className="text-[10px] font-bold text-primary bg-primary-subtle border border-primary-light px-3 py-1 rounded-full uppercase tracking-wider">
                         Integration flow
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-serif font-light text-text leading-tight">
                         A workflow that <span className="font-serif italic font-normal text-primary">just works.</span>
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">
                         Designed with minimalism and speed in mind. No complex forms or nested configuration interfaces.
                    </p>
                </div>

                {/* Right side: Modern Stacked Timeline */}
                <div className="lg:col-span-7 space-y-4">
                    {steps.map((s, i) => (
                        <motion.div
                            key={s.step}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="p-5 bg-bg border border-border rounded-2xl flex gap-5 items-start hover:border-border-hover transition-colors duration-200"
                        >
                            <div className="shrink-0 size-9 rounded-xl bg-white border border-border flex items-center justify-center text-primary text-xs font-bold shadow-xs">
                                 {s.step}
                            </div>
                            <div className="space-y-1">
                                 <h3 className="text-text font-bold text-sm tracking-tight">{s.title}</h3>
                                 <p className="text-text-secondary text-xs leading-relaxed font-medium">{s.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
