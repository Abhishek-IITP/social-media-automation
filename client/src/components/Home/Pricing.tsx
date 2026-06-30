import { CheckIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const pricingPlans = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        description: "Perfect for creators just getting started with social media automation.",
        features: ["2 social accounts", "10 scheduled posts/month", "AI content (5 credits/mo)", "Basic dashboard"],
        cta: "Get Started Free",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/month",
        description: "Everything you need to grow and automate your social presence.",
        features: ["Unlimited accounts", "Unlimited scheduling", "AI content (200 credits/mo)", "Priority support"],
        cta: "Start 14-day Free Trial",
        highlight: true,
    },
    {
        name: "Agency",
        price: "$79",
        period: "/month",
        description: "For teams and agencies managing multiple brands at scale.",
        features: ["Everything in Pro", "5 team members", "Unlimited AI credits", "Custom AI personas", "Dedicated support"],
        cta: "Contact Sales",
        highlight: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-white border-b border-border">
            <div className="max-w-5xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
                    {/* <span className="text-[10px] font-bold text-primary bg-primary-subtle border border-primary-light px-3 py-1 rounded-full uppercase tracking-wider">
                         Pricing Model
                    </span> */}
                    <h2 className="text-3xl sm:text-5xl font-serif font-light text-text leading-tight">
                         Honest plans for <span className="font-serif italic font-normal text-primary">every builder.</span>
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">
                         Start with our developer sandbox plan, and scale as your traffic grows.
                    </p>
                </div>

                {/* Staggered Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                    {pricingPlans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-30px" }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className={`rounded-2xl border p-6.5 flex flex-col justify-between gap-6 transition-all duration-300 ${
                                 plan.highlight 
                                      ? "bg-primary-subtle border-primary-light shadow-md" 
                                      : "bg-white border-border hover:border-border-hover hover:shadow-xs"
                            }`}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                     <span className="text-xs font-bold uppercase tracking-wider text-primary">{plan.name}</span>
                                     {plan.highlight && (
                                          <span className="text-[9px] font-bold uppercase tracking-widest text-white bg-primary px-2 py-0.5 rounded-full">
                                               Popular
                                          </span>
                                     )}
                                </div>
                                <div className="flex items-baseline gap-1">
                                     <span className="text-3xl font-serif font-semibold text-text">{plan.price}</span>
                                     <span className="text-xs text-text-muted font-medium">{plan.period}</span>
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed font-medium">
                                     {plan.description}
                                </p>
                                <ul className="space-y-2.5 pt-4 border-t border-border/60">
                                     {plan.features.map((f) => (
                                          <li key={f} className="flex items-center gap-2.5 text-xs font-medium text-text-secondary">
                                               <div className="size-4.5 rounded-xl bg-white border border-border flex items-center justify-center shrink-0">
                                                    <CheckIcon className="size-3 text-primary" />
                                               </div>
                                               <span>{f}</span>
                                          </li>
                                     ))}
                                </ul>
                            </div>

                            <Link 
                                 to="/login" 
                                 className={`w-full text-center font-bold uppercase tracking-wider text-[10px] py-3 rounded-xl transition-all duration-200 ${
                                      plan.highlight 
                                           ? "bg-primary hover:bg-primary-hover text-white shadow-xs" 
                                           : "bg-bg text-text-secondary border border-border hover:border-border-hover hover:bg-white"
                                 }`}
                            >
                                 {plan.cta}
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
