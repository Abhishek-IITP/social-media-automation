import { UnplugIcon, Share2Icon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";
import { motion } from "framer-motion";

interface AccountListProps {
    accounts: any[];
    onDisconnect: (accountId: string) => Promise<void>;
}

export function AccountList({ accounts, onDisconnect }: AccountListProps) {
    const handleDisconnect = async (accountId: string) => {
        try {
            const confirm = window.confirm("Are you sure you want to disconnect this account?")
            if (!confirm) return;
            await onDisconnect(accountId);
        } catch (error) {
            console.log("Error disconnecting", error);
        }
    }

    if (accounts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-dashed border-border flex flex-col items-center justify-center py-20 px-6"
            >
                <Share2Icon className="size-8 text-border mb-3" />
                <p className="text-text font-semibold text-base">No connected accounts</p>
                <p className="text-sm text-text-muted mt-1.5 max-w-xs text-center leading-relaxed">
                    Connect your first platform to start scheduling and publishing posts automatically.
                </p>
            </motion.div>
        );
    }

    return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account, index) => {
            const meta = PLATFORMS.find((p) =>
                account.platform.startsWith(p.id)
            );

            if (!meta) return null;

            return (
                <motion.div
                    key={account._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.3,
                        delay: index * 0.08,
                        ease: "easeOut",
                    }}
                    className="bg-white rounded-2xl border border-border hover:border-primary/15 p-5 transition-colors flex flex-col justify-between gap-4 group"
                >
                    {/* Account info */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="size-10 rounded-xl bg-bg border border-border flex items-center justify-center shrink-0 text-text-secondary group-hover:text-primary transition-colors">
                                <meta.icon className="size-5" />
                            </div>

                            <div className="min-w-0">
                                <h4 className="text-sm font-semibold text-text truncate">
                                    {account.handle}
                                </h4>
                                <p className="text-xs text-text-muted mt-0.5">
                                    {meta.name}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDisconnect(account._id)}
                            title="Disconnect account"
                            className="shrink-0 p-2 text-text-muted hover:text-primary hover:bg-primary-subtle rounded-lg transition-all cursor-pointer"
                        >
                            <UnplugIcon className="size-4" />
                        </button>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between border-t border-border pt-3.5">
                        <span className="text-xs text-text-muted">Status</span>

                        <div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium select-none border ${
                                account.status === "connected"
                                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                    : "bg-amber-50 border-amber-100 text-amber-700"
                            }`}
                        >
                            <span className="relative flex h-1.5 w-1.5">
                                {account.status === "connected" && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                                )}

                                <span
                                    className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                                        account.status === "connected"
                                            ? "bg-emerald-500"
                                            : "bg-amber-500"
                                    }`}
                                />
                            </span>

                            {account.status === "connected"
                                ? "Connected"
                                : "Disconnected"}
                        </div>
                    </div>
                </motion.div>
            );
        })}
    </div>
);
}
