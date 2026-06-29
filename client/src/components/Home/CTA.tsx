import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function CTA() {
    return (
        <section className="py-24 bg-bg border-b border-border">
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-3xl overflow-hidden p-10 sm:p-16 text-center bg-[linear-gradient(135deg,#FDF6F2_0%,#F5E6DF_100%)] border border-primary-light"
                >
                    <div className="relative z-10 max-w-xl mx-auto space-y-6">
                        <span className="text-[10px] font-bold text-primary bg-primary-subtle border border-primary-light px-3.5 py-1 rounded-full uppercase tracking-wider">
                             Join the community
                        </span>
                        <h2 className="text-3xl sm:text-5xl font-serif font-light text-text leading-tight">
                             Automate your calendar.
                             <br />
                             <span className="font-serif italic font-normal text-primary">Reclaim your attention.</span>
                        </h2>
                        <p className="text-sm text-text-secondary leading-relaxed font-medium">
                             Connected to all major networks. No credit card requested. Setup takes 3 minutes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                            <Link to="/login" className="bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs px-8 py-3.5 hover:bg-primary-hover hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto">
                                Get Started Free <ArrowRightIcon className="size-3.5" />
                            </Link>
                            <a href="#pricing" className="bg-white border border-border text-text-secondary rounded-xl font-bold uppercase tracking-wider text-xs px-8 py-3.5 hover:border-border-hover transition-all duration-300 flex items-center justify-center w-full sm:w-auto">
                                Explore Pricing
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
