import { Link } from "react-router-dom";

const footerLinks = {
    Product: ["Features", "How it works", "Pricing", "Changelog"],
    Company: ["About", "Blog", "Careers", "Press"],
    Legal: ["Privacy", "Terms", "Security", "Cookies"],
};

export default function Footer() {
    return (
        <footer className="bg-bg border-t border-border">
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" onClick={() => scrollTo(0, 0)} className="inline-flex items-center gap-2">
                            <img src="/logo.svg" alt="logo" className="size-5.5" />
                            <span className="font-serif italic font-semibold text-lg text-text">Scheduler</span>
                        </Link>
                        <p className="text-xs text-text-secondary leading-relaxed max-w-xs font-medium">
                            An elegant social media editor that makes publishing across multiple workspaces effortless.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="space-y-4">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">{category}</div>
                            <ul className="space-y-1.5">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="text-xs text-text-muted hover:text-text transition-colors duration-200 font-medium">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
                    <p className="text-[10px] font-semibold text-text-muted">© {new Date().getFullYear()} Scheduler. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-[10px] font-semibold text-text-muted hover:text-text transition-colors duration-200">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-[10px] font-semibold text-text-muted hover:text-text transition-colors duration-200">
                            Terms of Service
                        </a>
                        <Link to="/login" className="text-[10px] font-semibold text-text-muted hover:text-text transition-colors duration-200">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
