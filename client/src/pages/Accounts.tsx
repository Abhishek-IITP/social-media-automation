import { useEffect, useState } from "react"
import { PLATFORMS } from "../assets/assets";
import { PlusIcon, Share2Icon } from "lucide-react";
import { AccountList } from "../components/AccountList";
import { PlatformPicker } from "../components/PlatformPicker";
import toast from "react-hot-toast";
import { api } from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";

export function Accounts() {
     const [accounts, setAccounts] = useState<any[]>([]);
     const [connecting, setConnecting] = useState<string | null>(null);
     const [showPlatformPicker, setShowPlatformPicker] = useState<boolean>(false);

     const fetchAccount = async (isSync = false, platform?: string | null, successMsg?: string) => {
          try {
               if (isSync) {
                    const label = platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : "Social Media";
                    toast.loading(`Syncing ${label} account...`, { id: "sync" });
                    await api.get("/api/oauth/sync");
                    toast.success(successMsg || "Accounts synced!", { id: "sync" })
               }

               const { data } = await api.get("/api/accounts")
               setAccounts(data)
          } catch (error: any) {
               toast.error(error?.response?.data?.message || error?.message || "Failed to load accounts");
          }
     }

     useEffect(() => {
          const params = new URLSearchParams(window.location.search);
          const connectedPlatform = params.get("connected");
          const connectedUsername = params.get("username");
          const syncNeeded = params.get("sync") === "true";
          const errorMsg = params.get("error")

          window.history.replaceState({}, document.title, window.location.pathname)

          if (connectedPlatform) {
               const label = connectedPlatform.charAt(0).toUpperCase() + connectedPlatform.slice(1);
               const handle = connectedUsername ? `(@${connectedUsername})` : ""
               fetchAccount(true, connectedPlatform, `${label} ${handle} connected!`)
          } else if (errorMsg) {
               toast.error(`Connection failed: ${decodeURIComponent(errorMsg)}`)
               fetchAccount();
          } else if (syncNeeded) {
               fetchAccount(true, null, "Accounts synced!")
          } else {
               fetchAccount()
          }
     }, [])

     const handleConnect = async (platformId: string) => {
          setConnecting(platformId);
          try {
               const { data } = await api.get(`/api/oauth/${platformId}/url`);
               window.location.href = data.url;
          } catch (err: any) {
               toast.error(err?.response?.data?.message || err?.message || `Failed to connect ${platformId}`)
               setConnecting(null)
          }
     }

     const connectedIds = accounts.map((e) => e.platform)

     return (
          <div className="max-w-4xl space-y-10 pb-16">
               {/* Header */}
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                         <div>
                              <h1 className="text-3xl font-serif text-text">Connected Accounts</h1>
                              <p className="text-text-secondary mt-2 text-[15px]">
                                   {accounts.length} of {PLATFORMS.length} platforms connected
                              </p>
                         </div>
                         <button
                              onClick={() => setShowPlatformPicker(true)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm"
                         >
                              <PlusIcon className="size-4" /> Connect Platform
                         </button>
                    </div>
               </motion.div>

               {/* Platform Picker Modal */}
               <AnimatePresence>
                    {showPlatformPicker && (
                         <PlatformPicker
                              connectedIds={connectedIds}
                              connecting={connecting}
                              onClose={() => setShowPlatformPicker(false)}
                              onConnect={handleConnect}
                         />
                    )}
               </AnimatePresence>

               {/* Account List */}
               <AccountList
                    accounts={accounts}
                    onDisconnect={async (accountId: string) => {
                         try {
                              await api.delete(`/api/accounts/${accountId}`)
                              toast.success("Account disconnected")
                              await fetchAccount();
                         } catch (err: any) {
                              toast.error(err?.response?.data?.message || err?.message || `Failed to disconnect account`)
                              setConnecting(null)
                         }
                    }}
               />
          </div>
     )
}
