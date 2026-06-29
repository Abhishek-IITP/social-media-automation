import { Link } from "react-router-dom";
import { ArrowRightIcon, PlusIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-bg py-16 sm:py-24 border-b border-border">
            {/* Absolute minimalist background grids */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-size-[80px_80px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
                {/* Left Side: Editorial Typography & Copy */}
                <div className="lg:col-span-7 space-y-6 text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-primary-subtle border border-primary-light text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                        <Sparkles className="size-3" />
                        AI-Powered Social Engine
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl sm:text-6xl font-serif font-light text-text leading-tight"
                    >
                        Publishing, refined.
                        <br />
                        <span className="font-serif italic font-normal text-primary">Intelligent scheduling</span> for the modern publisher.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-text-secondary text-sm sm:text-base leading-relaxed max-w-xl font-medium"
                    >
                        A beautiful workspace to write, manage, and coordinate your social media presence. Backed by local AI utilities that draft high-engagement content for you instantly.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4"
                    >
                        <Link to="/login" className="bg-primary text-white rounded-xl font-bold uppercase tracking-wider text-xs px-6 py-3.5 hover:bg-primary-hover hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                            Create Account <ArrowRightIcon className="size-3.5" />
                        </Link>
                        <a href="#pricing" className="border border-border bg-white text-text-secondary rounded-xl font-bold uppercase tracking-wider text-xs px-6 py-3.5 hover:border-border-hover transition-all duration-300 flex items-center justify-center">
                            Explore Pricing
                        </a>
                    </motion.div>
                </div>

                {/* Right Side: Sleek Asymmetric Mockup */}
                <div className="lg:col-span-5 relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                        className="bg-white rounded-2xl border border-border p-6 shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary" />
                        
                        <div className="flex items-center justify-between mb-6 pt-2">
                              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Active Queue</span>
                              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-bg rounded-xl border border-border space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-primary bg-primary-subtle border border-primary-light px-2 py-0.5 rounded-full uppercase tracking-wider">Twitter</span>
                                    <span className="text-[9px] text-text-muted font-medium">Tomorrow, 9:00 AM</span>
                                </div>
                                <p className="text-xs text-text-secondary font-medium leading-relaxed">
                                    Building in public has never been so rewarding. Ready to launch the new dashboard...
                                </p>
                            </div>

                            <div className="p-4 bg-bg rounded-xl border border-border space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-primary bg-primary-subtle border border-primary-light px-2 py-0.5 rounded-full uppercase tracking-wider">LinkedIn</span>
                                    <span className="text-[9px] text-text-muted font-medium">Wednesday, 2:00 PM</span>
                                </div>
                                <p className="text-xs text-text-secondary font-medium leading-relaxed">
                                     Refining the developer experience requires stepping back and looking at the system...
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 border-t border-border pt-4 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                                 <span className="size-5 rounded-full bg-primary flex items-center justify-center text-white text-[9px] font-bold">U</span>
                                 <span className="text-[10px] text-text-secondary font-semibold">User Dashboard</span>
                            </div>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider flex items-center gap-1">
                                 <PlusIcon className="size-3" /> Connect
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
