import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MenuIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const pageTitles: Record<string, string> = {
     "/dashboard": "Dashboard Overview",
     "/accounts": "Connected Platforms",
     "/scheduler": "Publication Calendar",
     "/ai-composer": "AI Writing Desk",
}

export function Layout() {
     const { isAuthenticated, isLoading } = useAuth();
     const location = useLocation();
     const title = pageTitles[location.pathname] || "Scheduler";
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

     if (isLoading) {
          return (
               <div className="flex h-screen items-center justify-center bg-[#FBF9F6]">
                    <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
               </div>
          )
     }

     if (!isAuthenticated) {
          return <Navigate to="/login" replace />
     }

     return (
          <div className="flex h-screen bg-[#FBF9F6]">
               <AnimatePresence>
                    {isMobileMenuOpen && (
                         <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 bg-[#191919]/25 backdrop-blur-xs z-40 md:hidden" 
                              onClick={() => setIsMobileMenuOpen(false)} 
                         />
                    )}
               </AnimatePresence>

               <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

               <div className="flex-1 flex flex-col overflow-hidden">
                    <header className="h-16 bg-[#FBF9F6] border-b border-border flex items-center px-6 md:px-8 justify-between">
                         <div className="flex items-center gap-4">
                              <button className="md:hidden p-2 -ml-2 text-text-secondary hover:text-text rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)}> 
                                   <MenuIcon className="size-5" />
                              </button>
                              <div>
                                   <h1 className="text-md font-serif font-bold italic text-text leading-none">{title}</h1>
                                   <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider mt-1 hidden sm:block">Work Calendar & Automation desk</p>
                              </div>
                         </div>
                    </header>

                    <main className="flex-1 overflow-auto p-5 sm:p-6 xl:p-8 max-w-7xl w-full mx-auto">
                         <AnimatePresence mode="wait">
                              <motion.div
                                   key={location.pathname}
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   exit={{ opacity: 0, y: -10 }}
                                   transition={{ duration: 0.2, ease: "easeOut" }}
                                   className="h-full"
                              >
                                   <Outlet />
                              </motion.div>
                         </AnimatePresence>
                    </main>
               </div>
          </div>
     )
}
