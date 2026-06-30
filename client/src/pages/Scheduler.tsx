import { PLATFORMS } from "../assets/assets";
import { ArrowRightIcon, CheckCircleIcon, XIcon, UploadCloudIcon, ClockIcon, ImageIcon, Pencil, Trash2 } from "lucide-react";
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
     const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
     const [editingPostId, setEditingPostId] = useState<string | null>(null);
     const [existingMediaUrl, setExistingMediaUrl] = useState<string | null>(null);

     const fetchPosts = async () => {
          try {
               const { data } = await api.get("/api/posts");
               setPosts(data);
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          }
     };

     const fetchAccounts = async () => {
          try {
               const { data } = await api.get("/api/accounts");
               const connectedIds = data.map((e: any) => e.platform);
               setConnectedPlatforms(connectedIds);
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message || "Failed to load accounts");
          }
     };

     useEffect(() => {
          fetchPosts();
          fetchAccounts();
          const interval = setInterval(fetchPosts, 10000);
          return () => clearInterval(interval);
     }, []);

     const togglePlatform = (id: string) => {
          setSelectedPlatform((prev) => prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]);
     };

     const handleSchedule = async (e: React.FormEvent) => {
          e.preventDefault();
          if (selectedPlatform.length === 0) { toast.error("Select at least one platform"); return; }

          const notConnected = selectedPlatform.filter(pId => !connectedPlatforms.some(id => id.startsWith(pId)));
          if (notConnected.length > 0) {
               toast.error(`Please connect ${notConnected.map(pId => PLATFORMS.find(p => p.id === pId)?.name || pId).join(", ")} first.`);
               return;
          }

          if (!scheduledDate || !scheduledTime) { toast.error("Select date and time"); return; }
          if (selectedPlatform.includes("instagram") && !mediaFile && !existingMediaUrl) { toast.error("Instagram requires an image or video"); return; }

          const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
          const formData = new FormData();
          formData.append("content", content);
          formData.append("scheduledFor", scheduledFor);
          formData.append("status", "scheduled");
          formData.append("platforms", JSON.stringify(selectedPlatform));
          if (mediaFile) formData.append("media", mediaFile);

          setLoading(true);
          try {
               if (editingPostId) {
                    if (!mediaFile && !existingMediaUrl) {
                         formData.append("removeMedia", "true");
                    }
                    await api.put(`/api/posts/${editingPostId}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
                    toast.success("Post updated!");
               } else {
                    await api.post("/api/posts", formData, { headers: { "Content-Type": "multipart/form-data" } });
                    toast.success("Post scheduled!");
               }
               setContent(""); setScheduledDate(""); setScheduledTime(""); setSelectedPlatform([]); setMediaFile(null);
               setEditingPostId(null); setExistingMediaUrl(null);
               fetchPosts();
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message);
          } finally {
               setLoading(false);
          }
     };

     const handleEditClick = (post: any) => {
          setEditingPostId(post._id);
          setContent(post.content);
          
          if (post.scheduledFor) {
               const dateObj = new Date(post.scheduledFor);
               const year = dateObj.getFullYear();
               const month = String(dateObj.getMonth() + 1).padStart(2, "0");
               const day = String(dateObj.getDate()).padStart(2, "0");
               setScheduledDate(`${year}-${month}-${day}`);
               
               const hours = String(dateObj.getHours()).padStart(2, "0");
               const minutes = String(dateObj.getMinutes()).padStart(2, "0");
               setScheduledTime(`${hours}:${minutes}`);
          }
          
          setMediaFile(null);
          setExistingMediaUrl(post.mediaUrl || null);
          
          const matchedPlatform = PLATFORMS.find(p => post.platform?.startsWith(p.id));
          if (matchedPlatform) {
               setSelectedPlatform([matchedPlatform.id]);
          } else {
               setSelectedPlatform([]);
          }
     };

     const handleCancelEdit = () => {
          setEditingPostId(null);
          setContent("");
          setScheduledDate("");
          setScheduledTime("");
          setSelectedPlatform([]);
          setMediaFile(null);
          setExistingMediaUrl(null);
     };

     const handleDeleteClick = async (id: string) => {
          if (!window.confirm("Are you sure you want to delete this post?")) return;
          try {
               await api.delete(`/api/posts/${id}`);
               toast.success("Post deleted successfully");
               if (editingPostId === id) {
                    handleCancelEdit();
               }
               fetchPosts();
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message || "Failed to delete post");
          }
     };

     const scheduled = posts
          .filter((p) => p.status === "scheduled")
          .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
     const published = posts
          .filter((p) => p.status === "published")
          .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime());
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
                         <h2 className="text-base font-semibold text-text">{editingPostId ? "Edit Post" : "New Post"}</h2>

                         <form className="space-y-5" onSubmit={handleSchedule}>
                              {/* Platforms */}
                              <div>
                                   <label className="text-sm font-medium text-text mb-2 block">Platforms</label>
                                   <div className="flex flex-wrap gap-2">
                                        {PLATFORMS.map((p) => {
                                             const isConnected = connectedPlatforms.some((id) => id.startsWith(p.id));
                                             const active = selectedPlatform.includes(p.id);
                                             return (
                                                  <button
                                                       key={p.id}
                                                       type="button"
                                                       disabled={!isConnected}
                                                       onClick={() => togglePlatform(p.id)}
                                                       className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium transition-all ${
                                                            !isConnected
                                                                 ? "border-border/50 text-text-muted opacity-40 cursor-not-allowed"
                                                                 : active
                                                                 ? "bg-primary-subtle border-primary-light text-primary cursor-pointer"
                                                                 : "border-border text-text-secondary hover:border-primary/30 cursor-pointer"
                                                       }`}
                                                       title={!isConnected ? `${p.name} is not connected. Connect it in Accounts first.` : undefined}
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
                                   {mediaFile || existingMediaUrl ? (
                                        <div className="relative rounded-xl overflow-hidden border border-border">
                                             {mediaFile ? (
                                                  mediaFile.type.startsWith("image/") ? (
                                                       <img src={URL.createObjectURL(mediaFile)} alt="Preview" className="w-full aspect-video object-cover" />
                                                  ) : (
                                                       <video src={URL.createObjectURL(mediaFile)} controls className="w-full aspect-video object-cover" />
                                                  )
                                             ) : (
                                                  existingMediaUrl && (existingMediaUrl.toLowerCase().includes(".mp4") || existingMediaUrl.toLowerCase().includes(".mov") || existingMediaUrl.toLowerCase().includes(".webm")) ? (
                                                       <video src={existingMediaUrl} controls className="w-full aspect-video object-cover" />
                                                  ) : (
                                                       <img src={existingMediaUrl || ""} alt="Preview" className="w-full aspect-video object-cover" />
                                                  )
                                             )}
                                             <button type="button" onClick={() => { setMediaFile(null); setExistingMediaUrl(null); }} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg cursor-pointer">
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

                               <div className="flex gap-2">
                                    {editingPostId && (
                                         <button
                                              type="button"
                                              onClick={handleCancelEdit}
                                              className="flex-1 border border-border hover:bg-bg text-text-secondary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer bg-white"
                                         >
                                              Cancel
                                         </button>
                                    )}
                                    <button
                                         type="submit"
                                         disabled={loading}
                                         className={`${editingPostId ? "flex-1" : "w-full"} bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-sm`}
                                    >
                                         {loading ? (
                                              editingPostId ? (
                                                   <><div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Updating...</>
                                              ) : (
                                                   <><div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Scheduling...</>
                                              )
                                         ) : (
                                              editingPostId ? (
                                                   <>Update Post <ArrowRightIcon className="size-4" /></>
                                              ) : (
                                                   <>Schedule Post <ArrowRightIcon className="size-4" /></>
                                              )
                                         )}
                                    </button>
                               </div>
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
                                                            {post.platform ? (() => {
                                                                 const meta = PLATFORMS.find((p) => post.platform.startsWith(p.id));
                                                                 return meta ? <meta.icon className="size-3.5 text-text-muted" /> : null;
                                                            })() : (post.platforms || []).map((pl: string) => {
                                                                 const meta = PLATFORMS.find((p) => pl.startsWith(p.id));
                                                                 return meta ? <meta.icon key={pl} className="size-3.5 text-text-muted" /> : null;
                                                            })}
                                                       </div>
                                                       <span className="text-xs text-text-muted">
                                                            {post.scheduledFor ? new Date(post.scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                                                       </span>
                                                        {tab === "published" ? (
                                                             <span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full ml-auto">Published</span>
                                                        ) : (
                                                             <div className="flex gap-1 ml-auto shrink-0">
                                                                  <button
                                                                       onClick={() => handleEditClick(post)}
                                                                       className="p-1 hover:bg-bg rounded text-text-secondary hover:text-primary transition-colors cursor-pointer"
                                                                       title="Edit Post"
                                                                  >
                                                                       <Pencil className="size-3.5" />
                                                                  </button>
                                                                  <button
                                                                       onClick={() => handleDeleteClick(post._id)}
                                                                       className="p-1 hover:bg-bg rounded text-text-secondary hover:text-red-500 transition-colors cursor-pointer"
                                                                       title="Delete Post"
                                                                  >
                                                                       <Trash2 className="size-3.5" />
                                                                  </button>
                                                             </div>
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
