import { useEffect, useState } from "react";
import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarIcon, ClockIcon, HistoryIcon, Loader2Icon, TimerIcon, Wand2Icon, XIcon, PencilIcon, CopyIcon, CheckIcon } from "lucide-react";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export function AiComposer() {
     const [prompt, setPrompt] = useState("");
     const [tone, setTone] = useState("Professional");
     const [generateImage, setGenerateImage] = useState(true);
     const [loading, setLoading] = useState(false);
     const [generations, setGenerations] = useState<any[]>([]);

     // Schedule modal
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
               // Auto-open the result for editing
               const gen = data.generation;
               setActiveScheduler(gen);
               setEditingContent(gen.content);
               setIsEditing(false);
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
               toast.success("Post scheduled!");
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

     return (
          <div className="max-w-4xl space-y-10 pb-20">
               {/* Header */}
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-serif text-text">AI Composer</h1>
                    <p className="text-text-secondary mt-2 text-[15px]">Generate social media posts with AI, edit them, and schedule across your platforms.</p>
               </motion.div>

               {/* Composer Card */}
               <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-white rounded-2xl border border-border p-6 space-y-5"
               >
                    <textarea
                         value={prompt}
                         onChange={(e) => setPrompt(e.target.value)}
                         placeholder="Describe what you want to post about..."
                         className="w-full h-28 border border-border rounded-xl p-4 text-[15px] text-text resize-none focus:outline-none focus:border-primary transition-colors bg-bg/30"
                    />

                    {/* Tone pills */}
                    <div className="flex flex-wrap gap-2">
                         {tones.map((t) => (
                              <button
                                   key={t}
                                   onClick={() => setTone(t)}
                                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer ${
                                        tone === t
                                             ? "bg-primary border-primary text-white"
                                             : "bg-white text-text-secondary border-border hover:border-primary/30 hover:text-text"
                                   }`}
                              >
                                   {t}
                              </button>
                         ))}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between pt-2">
                         <button
                              onClick={() => setGenerateImage(!generateImage)}
                              className="flex items-center gap-3 text-sm text-text-secondary cursor-pointer"
                         >
                              <div className={`relative w-10 h-[22px] rounded-full transition-colors ${generateImage ? "bg-primary" : "bg-border"}`}>
                                   <div className={`absolute top-[3px] size-4 rounded-full bg-white shadow-sm transition-transform ${generateImage ? "left-[22px]" : "left-[3px]"}`} />
                              </div>
                              Include AI image
                         </button>

                         <button
                              onClick={handleGenerate}
                              disabled={loading}
                              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                         >
                              {loading ? <><Loader2Icon className="size-4 animate-spin" /> Generating...</> : <>Generate <ArrowRightIcon className="size-4" /></>}
                         </button>
                    </div>
               </motion.div>

               {/* Generations */}
               <div className="space-y-5">
                    <div className="flex items-center justify-between">
                         <h2 className="text-lg font-semibold text-text flex items-center gap-2">
                              <HistoryIcon className="size-5 text-text-muted" /> Generated Posts
                         </h2>
                         <span className="text-sm text-text-muted">{generations.length} drafts</span>
                    </div>

                    {generations.length === 0 ? (
                         <div className="bg-white rounded-2xl border border-dashed border-border py-16 text-center">
                              <Wand2Icon className="size-8 text-border mx-auto mb-3" />
                              <p className="text-text-secondary font-medium">No drafts yet</p>
                              <p className="text-sm text-text-muted mt-1">Enter a prompt above and generate your first post.</p>
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              {generations.map((g) => (
                                   <motion.div
                                        key={g._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-2xl border border-border p-5 flex flex-col gap-4 hover:border-primary/20 transition-colors group"
                                   >
                                        <div className="flex items-center justify-between">
                                             <span className="text-xs text-text-muted">
                                                  {new Date(g.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                             </span>
                                             <span className="text-xs font-medium text-primary bg-primary-subtle px-2.5 py-1 rounded-full">{g.tone}</span>
                                        </div>

                                        <p className="text-sm text-text leading-relaxed line-clamp-4">{g.content}</p>

                                        {g.mediaUrl && (
                                             <div className="rounded-xl overflow-hidden border border-border">
                                                  <img src={g.mediaUrl} alt="AI Generated" className="w-full aspect-video object-cover" />
                                             </div>
                                        )}

                                        <div className="flex gap-2 mt-auto pt-2">
                                             <button
                                                  onClick={() => openSchedulerForGeneration(g)}
                                                  className="flex-1 bg-primary text-white text-sm font-medium py-2.5 rounded-xl hover:bg-primary-hover transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                                             >
                                                  <PencilIcon className="size-3.5" /> Edit & Schedule
                                             </button>
                                             <button
                                                  onClick={() => handleCopy(g.content, g._id)}
                                                  className="px-3 py-2.5 rounded-xl border border-border text-text-secondary hover:bg-bg transition-colors cursor-pointer"
                                                  title="Copy content"
                                             >
                                                  {copiedId === g._id ? <CheckIcon className="size-4 text-emerald-600" /> : <CopyIcon className="size-4" />}
                                             </button>
                                        </div>
                                   </motion.div>
                              ))}
                         </div>
                    )}
               </div>

               {/* Edit & Schedule Modal */}
               <AnimatePresence>
                    {activeScheduler && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setActiveScheduler(null)}>
                              <motion.div
                                   initial={{ opacity: 0, scale: 0.96, y: 12 }}
                                   animate={{ opacity: 1, scale: 1, y: 0 }}
                                   exit={{ opacity: 0, scale: 0.96, y: 12 }}
                                   transition={{ duration: 0.2 }}
                                   onClick={(e) => e.stopPropagation()}
                                   className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-border flex flex-col max-h-[90vh] overflow-hidden"
                              >
                                   {/* Modal Header */}
                                   <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                        <h3 className="text-lg font-semibold text-text">Edit & Schedule</h3>
                                        <button onClick={() => setActiveScheduler(null)} className="p-1.5 rounded-lg text-text-muted hover:bg-bg transition-colors cursor-pointer">
                                             <XIcon className="size-5" />
                                        </button>
                                   </div>

                                   {/* Modal Body */}
                                   <div className="flex-1 overflow-y-auto p-6 space-y-5">
                                        {/* Editable Content */}
                                        <div>
                                             <div className="flex items-center justify-between mb-2">
                                                  <label className="text-sm font-medium text-text">Post Content</label>
                                                  <button
                                                       onClick={() => {
                                                            if (isEditing) {
                                                                 toast.success("Changes saved");
                                                            }
                                                            setIsEditing(!isEditing);
                                                       }}
                                                       className="text-sm text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline"
                                                  >
                                                       <PencilIcon className="size-3.5" />
                                                       {isEditing ? "Save edits" : "Edit content"}
                                                  </button>
                                             </div>

                                             {isEditing ? (
                                                  <textarea
                                                       value={editingContent}
                                                       onChange={(e) => setEditingContent(e.target.value)}
                                                       className="w-full min-h-[160px] border border-primary rounded-xl p-4 text-sm text-text resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                                       autoFocus
                                                  />
                                             ) : (
                                                  <div
                                                       onClick={() => { setIsEditing(true); }}
                                                       className="w-full min-h-[100px] border border-border rounded-xl p-4 text-sm text-text leading-relaxed whitespace-pre-wrap cursor-text hover:border-primary/30 transition-colors bg-bg/30"
                                                  >
                                                       {editingContent}
                                                  </div>
                                             )}
                                             <p className="text-xs text-text-muted mt-1.5">Click "Edit content" or click the text to add hashtags, links, or modify the copy.</p>
                                        </div>

                                        {/* Media Preview */}
                                        {activeScheduler.mediaUrl && (
                                             <div>
                                                  <label className="text-sm font-medium text-text mb-2 block">Attached Media</label>
                                                  <img src={activeScheduler.mediaUrl} alt="preview" className="w-full aspect-video object-cover rounded-xl border border-border" />
                                             </div>
                                        )}
                                   </div>

                                   {/* Modal Footer — Scheduling Controls */}
                                   <div className="p-6 border-t border-border bg-bg/30 space-y-4">
                                        {/* Platform Selection */}
                                        <div>
                                             <label className="text-sm font-medium text-text mb-2 block">Publish to</label>
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
                                                                 className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                                                                      active ? "bg-primary border-primary text-white" : "bg-white border-border text-text-secondary hover:border-primary/30"
                                                                 }`}
                                                            >
                                                                 <p.icon className="size-4" />
                                                                 {p.name}
                                                            </button>
                                                       );
                                                  })}
                                             </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="grid grid-cols-2 gap-4">
                                             <div>
                                                  <label className="text-sm font-medium text-text mb-1.5 block">Date</label>
                                                  <div className="relative">
                                                       <CalendarIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                       <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                                                            className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                                                  </div>
                                             </div>
                                             <div>
                                                  <label className="text-sm font-medium text-text mb-1.5 block">Time</label>
                                                  <div className="relative">
                                                       <ClockIcon className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                                                       <input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                                                            className="w-full pl-10 pr-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                                                  </div>
                                             </div>
                                        </div>

                                        <button
                                             onClick={handleSchedule}
                                             disabled={scheduling}
                                             className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                                        >
                                             {scheduling ? <Loader2Icon className="size-4 animate-spin" /> : <TimerIcon className="size-4" />}
                                             Schedule Post
                                        </button>
                                   </div>
                              </motion.div>
                         </div>
                    )}
               </AnimatePresence>
          </div>
     );
}
