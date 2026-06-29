import { CalendarDaysIcon, Wand2Icon, Share2Icon, ZapIcon, BarChart3Icon, HashIcon } from "lucide-react";
import { motion } from "framer-motion";

const features = [
    {
        icon: CalendarDaysIcon,
        title: "Smart Scheduling",
        description: "Draft your updates, set your platforms, and leave the queueing to our system.",
    },
    {
        icon: Wand2Icon,
        title: "AI Composer Engine",
        description: "Generate copy and images tailored to your specific platforms using local prompts.",
    },
    {
        icon: BarChart3Icon,
        title: "Activity Dashboard",
        description: "Keep track of all operations and scheduling events in a unified minimal timeline.",
    },
    {
        icon: Share2Icon,
        title: "Multi-Platform Channels",
        description: "Connected to Twitter, LinkedIn, Facebook, and Instagram workspaces.",
    },
    {
        icon: ZapIcon,
        title: "Instant Publishing",
        description: "Publish content immediately with full attachment and platform verification support.",
    },
    {
        icon: HashIcon,
        title: "Hashtag Suggestions",
        description: "Extract optimized hashtags from your copy automatically via AI helpers.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-bg border-b border-border">
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Asymmetric Header */}
                <div className="max-w-xl text-left mb-16 space-y-4">
                    <span className="text-[10px] font-bold text-primary bg-primary-subtle border border-primary-light px-3 py-1 rounded-full uppercase tracking-wider">
                         Refined Utilities
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-serif font-light text-text leading-tight">
                         Engineered to automate your <span className="font-serif italic font-normal text-primary">social presence.</span>
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">
                         A thoughtful collection of tools designed to remove friction from content writing and calendar planning.
                    </p>
                </div>

                {/* Editorial Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 border-t border-border pt-12">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                            className="flex gap-4 items-start group"
                        >
                            <div className="size-9 rounded-lg bg-white border border-border flex items-center justify-center text-primary group-hover:bg-primary-subtle transition-all duration-200 shrink-0 shadow-xs">
                                <f.icon className="size-4" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-text font-bold text-sm tracking-tight">{f.title}</h3>
                                <p className="text-xs text-text-secondary leading-relaxed font-medium">{f.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
