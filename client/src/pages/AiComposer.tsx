import { useEffect, useState } from "react";
import { PLATFORMS } from "../assets/assets";
import { 
     ArrowRightIcon, 
     CalendarIcon, 
     ClockIcon, 
     HistoryIcon, 
     Loader2Icon, 
     TimerIcon, 
     Wand2Icon, 
     XIcon, 
     PencilIcon, 
     CopyIcon, 
     CheckIcon, 
     Trash2Icon, 
     PlusIcon, 
     SearchIcon,
     ChevronLeftIcon,
     ArrowDown
} from "lucide-react";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export function AiComposer() {
     const [prompt, setPrompt] = useState("");
     const [tone, setTone] = useState("Professional");
     const [generateImage, setGenerateImage] = useState(true);
     const [loading, setLoading] = useState(false);
     const [generations, setGenerations] = useState<any[]>([]);
     const [searchTerm, setSearchTerm] = useState("");
     const [visibleCount, setVisibleCount] = useState(5);

     // Schedule & Edit panel
     const [activeScheduler, setActiveScheduler] = useState<any>(null);
     const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
     const [scheduledDate, setScheduledDate] = useState("");
     const [scheduledTime, setScheduledTime] = useState("");
     const [scheduling, setScheduling] = useState(false);

     // Edit mode
     const [editingContent, setEditingContent] = useState("");
     const [isEditing, setIsEditing] = useState(false);
     const [copiedId, setCopiedId] = useState<string | null>(null);

     const fetchGenerations = async () => {
          try {
               const { data } = await api.get("api/posts/generations");
               setGenerations(data);
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          }
     };

     useEffect(() => { fetchGenerations(); }, []);

     const handleGenerate = async () => {
          if (!prompt) { toast.error("Please enter a prompt"); return; }
          setLoading(true);
          try {
               const { data } = await api.post("/api/posts/generate", { prompt, tone, generateImage });
               toast.success("Content generated!");
               fetchGenerations();
               
               // Auto-open the result in workspace
               const gen = data.generation;
               setActiveScheduler(gen);
               setEditingContent(gen.content);
               setIsEditing(false);
               setSelectedPlatforms([]);
               setScheduledDate("");
               setScheduledTime("");
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          } finally {
               setLoading(false);
          }
     };

     const handleSchedule = async () => {
          if (!activeScheduler) return;
          if (selectedPlatforms.length === 0) { toast.error("Select at least one platform"); return; }
          if (!scheduledDate || !scheduledTime) { toast.error("Select date and time"); return; }

          const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
          setScheduling(true);
          try {
               await api.post("/api/posts", {
                    content: editingContent || activeScheduler.content,
                    mediaUrl: activeScheduler.mediaUrl,
                    mediaType: activeScheduler.mediaType,
                    platforms: selectedPlatforms,
                    scheduledFor,
                    status: "scheduled"
               });
               toast.success("Post scheduled successfully!");
               setActiveScheduler(null);
               setScheduledDate("");
               setScheduledTime("");
               setSelectedPlatforms([]);
               setIsEditing(false);
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          } finally {
               setScheduling(false);
          }
     };

     const handleDeleteGeneration = async (id: string, e: React.MouseEvent) => {
          e.stopPropagation();
          if (!confirm("Are you sure you want to delete this draft?")) return;
          try {
               await api.delete(`/api/posts/generations/${id}`);
               toast.success("Draft deleted successfully");
               fetchGenerations();
               if (activeScheduler && activeScheduler._id === id) {
                    setActiveScheduler(null);
               }
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          }
     };

     const handleCopy = (text: string, id: string) => {
          navigator.clipboard.writeText(text);
          setCopiedId(id);
          toast.success("Copied to clipboard");
          setTimeout(() => setCopiedId(null), 2000);
     };

     const openSchedulerForGeneration = (g: any) => {
          setActiveScheduler(g);
          setEditingContent(g.content);
          setIsEditing(false);
          setSelectedPlatforms([]);
          setScheduledDate("");
          setScheduledTime("");
     };

     const tones = ["Professional", "Funny", "Creative", "Casual", "Enthusiastic", "Motivational"];

     useEffect(() => {
          setVisibleCount(5);
     }, [searchTerm]);

     const filteredGenerations = generations.filter(g => {
          if (!searchTerm.trim()) return true;
          const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(word => word.length > 0);
          if (searchWords.length === 0) return true;
          const promptLower = g.prompt.toLowerCase();
          const contentLower = g.content.toLowerCase();
          return searchWords.some(word => 
               promptLower.includes(word) || 
               contentLower.includes(word)
          );
     });

     return (
          <div className="max-w-6xl mx-auto space-y-6 pb-20">
               {/* Editorial Title */}
               <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <h1 className="text-3xl font-serif text-text">AI Post Studio</h1>
                    <p className="text-text-secondary mt-1.5 text-[15px]">Generate high-engagement social copy, review the output, and queue posts instantly.</p>
               </motion.div>

               {/* Split Pane Workspace */}
               <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Sidebar: Generation History */}
                    <div className="w-full lg:w-80 shrink-0 space-y-4">
                         <div className="flex items-center justify-between">
                              <h2 className="text-sm font-semibold tracking-wider text-text-secondary uppercase flex items-center gap-2">
                                   <HistoryIcon className="size-4 text-text-muted" /> Draft History
                              </h2>
                              <button
                                   onClick={() => setActiveScheduler(null)}
                                   className="text-xs font-medium text-primary hover:text-primary-hover flex items-center gap-1 cursor-pointer bg-primary-subtle px-2.5 py-1.5 rounded-full border border-primary-light transition-all"
                              >
                                   <PlusIcon className="size-3" /> New Post
                              </button>
                         </div>

                         {/* Search bar */}
                         <div className="relative">
                              <SearchIcon className="size-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                              <input 
                                   type="text" 
                                   placeholder="Search drafts..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   className="w-full pl-9 pr-4 py-2 border border-border focus:border-primary-light focus:outline-none rounded-xl text-sm bg-white/70 placeholder:text-text-muted/70 transition-all"
                              />
                         </div>

                         {/* Generations List */}
                         <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                              <AnimatePresence initial={false}>
                                   {filteredGenerations.length === 0 ? (
                                        <div className="bg-white/50 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-text-muted">
                                             No drafts found.
                                        </div>
                                   ) : (
                                        filteredGenerations.slice(0, visibleCount).map((g) => {
                                             const isActive = activeScheduler && activeScheduler._id === g._id;
                                             return (
                                                  <motion.div
                                                       key={g._id}
                                                       initial={{ opacity: 0, y: 10 }}
                                                       animate={{ opacity: 1, y: 0 }}
                                                       exit={{ opacity: 0, scale: 0.95 }}
                                                       onClick={() => openSchedulerForGeneration(g)}
                                                       className={`group relative p-4 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col gap-2.5 ${
                                                            isActive 
                                                                 ? "bg-white border-primary shadow-sm ring-1 ring-primary/20" 
                                                                 : "bg-white border-border hover:border-border-hover hover:shadow-sm"
                                                       }`}
                                                  >
                                                       <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-mono text-text-muted">
                                                                 {new Date(g.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                            </span>
                                                            <div className="flex items-center gap-1.5">
                                                                 <span className="text-[10px] font-medium text-primary bg-primary-subtle border border-primary-light px-2 py-0.5 rounded-full">
                                                                      {g.tone}
                                                                 </span>
                                                                 {/* Delete Button */}
                                                                 <button
                                                                      onClick={(e) => handleDeleteGeneration(g._id, e)}
                                                                      className="p-1 text-text-muted hover:text-red-500 rounded-md hover:bg-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                                                                      title="Delete draft"
                                                                 >
                                                                      <Trash2Icon className="size-3.5" />
                                                                 </button>
                                                            </div>
                                                       </div>
                                                       
                                                       <div className="flex gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                 <h4 className="text-sm font-semibold text-text truncate group-hover:text-primary transition-colors">
                                                                      {g.prompt}
                                                                 </h4>
                                                                 <p className="text-xs text-text-secondary line-clamp-2 mt-1 leading-relaxed">
                                                                      {g.content}
                                                                 </p>
                                                            </div>
                                                            {g.mediaUrl && (
                                                                 <div className="size-11 rounded-lg overflow-hidden border border-border shrink-0 bg-bg">
                                                                      <img src={g.mediaUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                                                                 </div>
                                                            )}
                                                       </div>
                                                  </motion.div>
                                             );
                                        })
                                   )}
                              </AnimatePresence>
                              {filteredGenerations.length > visibleCount && (
                                   <button
                                        onClick={() => setVisibleCount(prev => prev + 5)}
                                        className="w-full mt-3 py-2 text-xs font-semibold tracking-wider text-primary border border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary-subtle/50 rounded-xl transition-all cursor-pointer text-center"
                                   >
                                        Load More ({filteredGenerations.length - visibleCount} remaining)
                                   </button>
                              )}
                         </div>
                    </div>

                    {/* Right Panel: Active Workspace Area */}
                    <div id="workspace-area" className="flex-1 w-full bg-white rounded-2xl border border-border p-6 shadow-sm min-h-[500px]">
                         <AnimatePresence mode="wait">
                              {!activeScheduler ? (
                                   
                                   /* View 1: Compose / Generate Form */
                                   <motion.div
                                        key="composer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                   >
                                        <div className="border-b border-border pb-4">
                                             <h3 className="text-xl font-serif text-text">Compose with AI</h3>
                                             <p className="text-xs text-text-secondary mt-1">Enter a prompt and select a tone style to create your next social post.</p>
                                        </div>

                                        {/* Prompt Area */}
                                        <div className="space-y-2">
                                             <label className="text-sm font-medium text-text">What would you like to post about?</label>
                                             <textarea
                                                  value={prompt}
                                                  onChange={(e) => setPrompt(e.target.value)}
                                                  placeholder="e.g. Announcing the launch of NexaPost - the modern dashboard to schedule, draft, and track all your social media accounts in one beautiful dashboard..."
                                                  className="w-full h-36 border border-border rounded-xl p-4 text-[14px] text-text resize-none focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-all bg-bg/20 placeholder:text-text-muted/60 leading-relaxed"
                                             />
                                        </div>

                                        {/* Tone Picker */}
                                        <div className="space-y-2.5">
                                             <label className="text-sm font-medium text-text">Tone Style</label>
                                             <div className="flex flex-wrap gap-2">
                                                  {tones.map((t) => {
                                                       const isSelected = tone === t;
                                                       return (
                                                            <button
                                                                 key={t}
                                                                 type="button"
                                                                 onClick={() => setTone(t)}
                                                                 className={`px-4.5 py-2.5 rounded-full text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                                                                      isSelected
                                                                           ? "bg-primary border-primary text-white shadow-sm"
                                                                           : "bg-white text-text-secondary border-border hover:border-primary/30 hover:text-text"
                                                                 }`}
                                                            >
                                                                 {t}
                                                            </button>
                                                       );
                                                  })}
                                             </div>
                                        </div>

                                        {/* Controls and Actions */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-border pt-6 gap-4">
                                             <button
                                                  type="button"
                                                  onClick={() => setGenerateImage(!generateImage)}
                                                  className="flex items-center gap-3 text-sm text-text-secondary cursor-pointer"
                                             >
                                                  <div className={`relative w-10 h-[22px] rounded-full transition-colors duration-300 ${generateImage ? "bg-primary" : "bg-border"}`}>
                                                       <div className={`absolute top-[3px] size-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${generateImage ? "left-[22px]" : "left-[3px]"}`} />
                                                  </div>
                                                  <span className="font-medium text-xs tracking-wider uppercase text-text-secondary/80">Include AI Image</span>
                                             </button>

                                             <button
                                                  onClick={handleGenerate}
                                                  disabled={loading}
                                                  className="bg-primary hover:bg-primary-hover text-white px-7 py-3 rounded-xl text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-md ml-auto"
                                             >
                                                  {loading ? (
                                                       <><Loader2Icon className="size-4 animate-spin" /> Crafting...</>
                                                  ) : (
                                                       <>Generate Draft <Wand2Icon className="size-4" /></>
                                                  )}
                                             </button>
                                        </div>
                                   </motion.div>
                              ) : (
                                   
                                   /* View 2: Edit & Schedule Workspace */
                                   <motion.div
                                        key="editor"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                   >
                                        <div className="flex items-center justify-between border-b border-border pb-4 gap-4">
                                             <div>
                                                  <button 
                                                       onClick={() => setActiveScheduler(null)}
                                                       className="text-xs font-semibold text-text-secondary hover:text-primary flex items-center gap-1 transition-colors mb-1 cursor-pointer"
                                                  >
                                                       <ChevronLeftIcon className="size-3.5" /> Back to Compose
                                                  </button>
                                                  <h3 className="text-xl font-serif text-text">Review & Schedule</h3>
                                             </div>
                                             
                                             <div className="flex items-center gap-2">
                                                  {/* Copy Action */}
                                                  <button
                                                       onClick={() => handleCopy(editingContent || activeScheduler.content, activeScheduler._id)}
                                                       className="p-2 border border-border rounded-xl text-text-secondary hover:bg-bg transition-colors cursor-pointer"
                                                       title="Copy code"
                                                  >
                                                       {copiedId === activeScheduler._id ? <CheckIcon className="size-4 text-success" /> : <CopyIcon className="size-4" />}
                                                  </button>
                                                  {/* Delete Action inside pane */}
                                                  <button
                                                       onClick={(e) => handleDeleteGeneration(activeScheduler._id, e)}
                                                       className="p-2 border border-border rounded-xl text-text-secondary hover:text-red-500 hover:bg-red-50/50 transition-colors cursor-pointer"
                                                       title="Delete draft"
                                                  >
                                                       <Trash2Icon className="size-4" />
                                                  </button>
                                             </div>
                                        </div>

                                        {/* Prompt Summary */}
                                        <div className="bg-bg/40 p-3.5 rounded-xl border border-border text-xs text-text-secondary">
                                             <span className="font-semibold text-text">Prompt: </span>"{activeScheduler.prompt}"
                                        </div>

                                        {/* Editor Content Area */}
                                        <div className="space-y-2">
                                             <div className="flex items-center justify-between">
                                                  <label className="text-sm font-medium text-text">Post Content</label>
                                                  <button
                                                       onClick={() => {
                                                            if (isEditing) {
                                                                 toast.success("Changes saved");
                                                            }
                                                            setIsEditing(!isEditing);
                                                       }}
                                                       className="text-xs text-primary font-semibold flex items-center gap-1 cursor-pointer hover:underline"
                                                  >
                                                       <PencilIcon className="size-3" />
                                                       {isEditing ? "Save edits" : "Edit text"}
                                                  </button>
                                             </div>

                                             {isEditing ? (
                                                  <textarea
                                                       value={editingContent}
                                                       onChange={(e) => setEditingContent(e.target.value)}
                                                       className="w-full min-h-[160px] border border-primary rounded-xl p-4 text-[14px] text-text resize-none focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all leading-relaxed"
                                                       autoFocus
                                                  />
                                             ) : (
                                                  <div
                                                       onClick={() => { setIsEditing(true); }}
                                                       className="w-full min-h-[120px] border border-border rounded-xl p-4 text-[14px] text-text leading-relaxed whitespace-pre-wrap cursor-text hover:border-primary/25 transition-colors bg-bg/20"
                                                  >
                                                       {editingContent}
                                                  </div>
                                             )}
                                             <p className="text-[11px] text-text-muted mt-1.5">Characters: {editingContent.length} / 280 (Twitter limit).</p>
                                        </div>

                                        {/* Attached Image Preview */}
                                        {activeScheduler.mediaUrl && (
                                             <div className="space-y-2">
                                                  <label className="text-sm font-medium text-text block">Attached Image</label>
                                                  <div className="relative rounded-xl overflow-hidden border border-border group bg-bg max-w-md">
                                                       <img src={activeScheduler.mediaUrl} alt="AI output" className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-102" />
                                                  </div>
                                             </div>
                                        )}

                                        {/* Publishing & Scheduling Fields */}
                                        <div className="border-t border-border pt-6 space-y-5">
                                             
                                             {/* Target Platforms */}
                                             <div className="space-y-2.5">
                                                  <label className="text-sm font-medium text-text block">Publish to</label>
                                                  <div className="flex flex-wrap gap-2">
                                                       {PLATFORMS.map((p) => {
                                                            const active = selectedPlatforms.includes(p.id);
                                                            return (
                                                                 <button
                                                                      key={p.id}
                                                                      onClick={() =>
                                                                           setSelectedPlatforms((prev) =>
                                                                                prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id]
                                                                           )
                                                                      }
                                                                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                                                                           active 
                                                                                ? "bg-primary border-primary text-white shadow-sm" 
                                                                                : "bg-white border-border text-text-secondary hover:border-primary/30"
                                                                      }`}
                                                                 >
                                                                      <p.icon className="size-4" />
                                                                      {p.name}
                                                                 </button>
                                                            );
                                                       })}
                                                  </div>
                                             </div>

                                             {/* Date & Time Picker */}
                                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                  <div className="space-y-1.5">
                                                       <label className="text-xs font-medium text-text-secondary block">Date</label>
                                                       <div className="relative">
                                                            <CalendarIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                            <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                                                                 className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary bg-white transition-colors" />
                                                       </div>
                                                  </div>
                                                  <div className="space-y-1.5">
                                                       <label className="text-xs font-medium text-text-secondary block">Time</label>
                                                       <div className="relative">
                                                            <ClockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                            <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                                                                 className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary bg-white transition-colors" />
                                                       </div>
                                                  </div>
                                             </div>

                                             {/* Submit scheduling */}
                                             <button
                                                  onClick={handleSchedule}
                                                  disabled={scheduling}
                                                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm mt-4 hover:shadow-md"
                                             >
                                                  {scheduling ? (
                                                       <><Loader2Icon className="size-4 animate-spin" /> Scheduling...</>
                                                  ) : (
                                                       <><TimerIcon className="size-4" /> Schedule Post</>
                                                  )}
                                             </button>
                                        </div>
                                   </motion.div>
                              )}
                         </AnimatePresence>
                    </div>

               </div>

               {/* Mobile scroll-down button */}
               <button 
                    onClick={() => {
                         document.getElementById("workspace-area")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="lg:hidden fixed bottom-6 right-6 bg-primary hover:bg-primary-hover text-white p-3.5 rounded-full shadow-lg z-40 flex items-center justify-center transition-all animate-bounce cursor-pointer"
                    title="Go to Post Creation"
               >
                    <ArrowDown className="size-5" />
               </button>
          </div>
     );
}
