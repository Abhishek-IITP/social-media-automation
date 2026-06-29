import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CalendarDaysIcon, CheckCircleIcon, XIcon, UploadCloudIcon, ClockIcon, ImageIcon } from "lucide-react";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Scheduler() {
     const [posts, setPosts] = useState<any[]>([]);
     const [content, setContent] = useState("");
     const [scheduledDate, setScheduledDate] = useState("");
     const [scheduledTime, setScheduledTime] = useState("");
     const [selectedPlatform, setSelectedPlatform] = useState<string[]>([]);
     const [mediaFile, setMediaFile] = useState<File | null>(null);
     const [loading, setLoading] = useState(false);
     const [tab, setTab] = useState<"scheduled" | "published">("scheduled");

     const fetchPosts = async () => {
          try {
               const { data } = await api.get("/api/posts");
               setPosts(data);
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          }
     };

     useEffect(() => {
          fetchPosts();
          const interval = setInterval(fetchPosts, 10000);
          return () => clearInterval(interval);
     }, []);

     const togglePlatform = (id: string) => {
          setSelectedPlatform((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
     };

     const handleSchedule = async (e: React.FormEvent) => {
          e.preventDefault();
          if (selectedPlatform.length === 0) { toast.error("Select at least one platform"); return; }
          if (!scheduledDate || !scheduledTime) { toast.error("Select date and time"); return; }
          if (selectedPlatform.includes("instagram") && !mediaFile) { toast.error("Instagram requires an image or video"); return; }

          const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
          const formData = new FormData();
          formData.append("content", content);
          formData.append("scheduledFor", scheduledFor);
          formData.append("status", "scheduled");
          formData.append("platforms", JSON.stringify(selectedPlatform));
          if (mediaFile) formData.append("media", mediaFile);

          setLoading(true);
          try {
               await api.post("/api/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
               toast.success("Post scheduled!");
               setContent(""); setScheduledDate(""); setScheduledTime(""); setSelectedPlatform([]); setMediaFile(null);
               fetchPosts();
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          } finally {
               setLoading(false);
          }
     };

     const scheduled = posts.filter((p) => p.status === "scheduled");
     const published = posts.filter((p) => p.status === "published");
     const activeList = tab === "scheduled" ? scheduled : published;

     return (
          <div className="max-w-5xl space-y-10 pb-16">
               {/* Header */}
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl font-serif text-text">Scheduler</h1>
                    <p className="text-text-secondary mt-2 text-[15px]">Create posts manually and schedule them for automatic publishing.</p>
               </motion.div>

               <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left: Compose Form */}
                    <motion.div
                         initial={{ opacity: 0, y: 12 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.05 }}
                         className="w-full lg:w-[400px] shrink-0 bg-white rounded-2xl border border-border p-6 space-y-5"
                    >
                         <h2 className="text-base font-semibold text-text">New Post</h2>

                         <form className="space-y-5" onSubmit={handleSchedule}>
                              {/* Platforms */}
                              <div>
                                   <label className="text-sm font-medium text-text mb-2 block">Platforms</label>
                                   <div className="flex flex-wrap gap-2">
                                        {PLATFORMS.map((p) => {
                                             const active = selectedPlatform.includes(p.id);
                                             return (
                                                  <button
                                                       key={p.id}
                                                       type="button"
                                                       onClick={() => togglePlatform(p.id)}
                                                       className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-all ${
                                                            active ? "bg-primary-subtle border-primary-light text-primary" : "border-border text-text-secondary hover:border-primary/30"
                                                       }`}
                                                  >
                                                       <p.icon className="size-4" />
                                                       <span className="hidden sm:inline">{p.name}</span>
                                                  </button>
                                             );
                                        })}
                                   </div>
                              </div>

                              {/* Content */}
                              <div>
                                   <label className="text-sm font-medium text-text mb-1.5 block">Content</label>
                                   <textarea
                                        required
                                        rows={4}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="w-full p-3.5 border border-border rounded-xl text-sm text-text resize-none focus:outline-none focus:border-primary transition-colors bg-bg/30"
                                        placeholder="What do you want to share?"
                                   />
                                   <p className={`text-right text-xs mt-1 ${content.length > 280 ? "text-primary font-medium" : "text-text-muted"}`}>
                                        {content.length} / 280
                                   </p>
                              </div>

                              {/* Media */}
                              <div>
                                   <label className="text-sm font-medium text-text mb-1.5 block">Media <span className="text-text-muted font-normal">(optional)</span></label>
                                   {mediaFile ? (
                                        <div className="relative rounded-xl overflow-hidden border border-border">
                                             {mediaFile.type.startsWith("image/") ? (
                                                  <img src={URL.createObjectURL(mediaFile)} alt="Preview" className="w-full aspect-video object-cover" />
                                             ) : (
                                                  <video src={URL.createObjectURL(mediaFile)} controls className="w-full aspect-video object-cover" />
                                             )}
                                             <button type="button" onClick={() => setMediaFile(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg cursor-pointer">
                                                  <XIcon className="size-4" />
                                             </button>
                                        </div>
                                   ) : (
                                        <label htmlFor="media" className="flex flex-col items-center justify-center w-full h-24 border border-dashed border-border rounded-xl cursor-pointer hover:bg-primary-subtle/20 hover:border-primary-light transition-all gap-1.5">
                                             <UploadCloudIcon className="size-5 text-text-muted" />
                                             <span className="text-xs text-text-secondary font-medium">Click to upload image or video</span>
                                        </label>
                                   )}
                                   <input type="file" id="media" accept="image/*,video/*" onChange={(e) => setMediaFile(e.target.files?.[0] || null)} className="hidden" />
                              </div>

                              {/* Date & Time */}
                              <div className="grid grid-cols-2 gap-3">
                                   <div>
                                        <label className="text-sm font-medium text-text mb-1.5 block">Date</label>
                                        <input type="date" required value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)}
                                             className="w-full p-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                                   </div>
                                   <div>
                                        <label className="text-sm font-medium text-text mb-1.5 block">Time</label>
                                        <input type="time" required value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                                             className="w-full p-2.5 border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors" />
                                   </div>
                              </div>

                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                              >
                                   {loading ? (
                                        <><div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Scheduling...</>
                                   ) : (
                                        <>Schedule Post <ArrowRightIcon className="size-4" /></>
                                   )}
                              </button>
                         </form>
                    </motion.div>

                    {/* Right: Post Queue */}
                    <motion.div
                         initial={{ opacity: 0, y: 12 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.1 }}
                         className="flex-1 min-w-0"
                    >
                         {/* Tabs */}
                         <div className="flex gap-1 mb-5 bg-bg rounded-xl p-1 border border-border w-fit">
                              <button
                                   onClick={() => setTab("scheduled")}
                                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                        tab === "scheduled" ? "bg-white text-text shadow-sm" : "text-text-muted hover:text-text-secondary"
                                   }`}
                              >
                                   Scheduled ({scheduled.length})
                              </button>
                              <button
                                   onClick={() => setTab("published")}
                                   className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                                        tab === "published" ? "bg-white text-text shadow-sm" : "text-text-muted hover:text-text-secondary"
                                   }`}
                              >
                                   Published ({published.length})
                              </button>
                         </div>

                         {/* Post List */}
                         {activeList.length === 0 ? (
                              <div className="bg-white rounded-2xl border border-dashed border-border py-16 text-center">
                                   {tab === "scheduled" ? (
                                        <ClockIcon className="size-8 text-border mx-auto mb-3" />
                                   ) : (
                                        <CheckCircleIcon className="size-8 text-border mx-auto mb-3" />
                                   )}
                                   <p className="text-text-secondary font-medium">
                                        {tab === "scheduled" ? "No posts scheduled" : "No published posts yet"}
                                   </p>
                                   <p className="text-sm text-text-muted mt-1">
                                        {tab === "scheduled" ? "Create a post using the form to get started." : "Scheduled posts will appear here after publishing."}
                                   </p>
                              </div>
                         ) : (
                              <div className="space-y-3">
                                   {activeList.map((post) => (
                                        <div key={post._id} className="bg-white rounded-xl border border-border p-4 flex gap-4 items-start hover:border-primary/15 transition-colors">
                                             {/* Media thumbnail */}
                                             {post.mediaUrl ? (
                                                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                                                       {post.mediaType === "video" ? (
                                                            <video src={post.mediaUrl} className="w-full h-full object-cover" />
                                                       ) : (
                                                            <img src={post.mediaUrl} alt="media" className="w-full h-full object-cover" />
                                                       )}
                                                  </div>
                                             ) : (
                                                  <div className="w-16 h-16 rounded-lg border border-border bg-bg flex items-center justify-center shrink-0">
                                                       <ImageIcon className="size-5 text-text-muted" />
                                                  </div>
                                             )}

                                             <div className="flex-1 min-w-0">
                                                  {/* Platform icons */}
                                                  <div className="flex items-center gap-2 mb-1.5">
                                                       <div className="flex gap-1">
                                                            {(post.platforms || []).map((pl: string) => {
                                                                 const meta = PLATFORMS.find((p) => pl.startsWith(p.id));
                                                                 return meta ? <meta.icon key={pl} className="size-3.5 text-text-muted" /> : null;
                                                            })}
                                                       </div>
                                                       <span className="text-xs text-text-muted">
                                                            {post.scheduledFor ? new Date(post.scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                                                       </span>
                                                       {tab === "published" && (
                                                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full ml-auto">Published</span>
                                                       )}
                                                  </div>

                                                  <p className="text-sm text-text leading-relaxed line-clamp-2">{post.content}</p>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </motion.div>
               </div>
          </div>
     );
}
