import { CheckCircleIcon, ExternalLink, XIcon } from "lucide-react";
import { PLATFORMS } from "../assets/assets";
import { motion } from "framer-motion";

interface PlatformPickerProps {
    connectedIds: string[];
    connecting: string | null;
    onClose: () => void;
    onConnect: (platformId: string) => void;
}

export function PlatformPicker({
    connectedIds,
    connecting,
    onClose,
    onConnect
}: PlatformPickerProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <h3 className="text-lg font-semibold text-text">Connect a Platform</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-text-muted hover:bg-bg transition-colors cursor-pointer"
                    >
                        <XIcon className="size-5" />
                    </button>
                </div>

                {/* Platform list */}
                <div className="p-4 flex flex-col gap-2">
                    {PLATFORMS.map((p) => {
                        const isConnected = connectedIds.some((id) => id.startsWith(p.id));
                        const isConnecting = connecting === p.id;
                        return (
                            <button
                                key={p.id}
                                disabled={isConnected || isConnecting}
                                onClick={() => onConnect(p.id)}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all border text-left cursor-pointer group ${
                                    isConnected
                                        ? "bg-primary-subtle border-primary-light text-text"
                                        : "border-border hover:bg-bg hover:border-primary/20"
                                }`}
                            >
                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    isConnected ? "bg-white text-primary border border-primary-light" : "bg-bg text-text-secondary"
                                }`}>
                                    <p.icon className="size-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-text">{p.name}</div>
                                    <div className="text-xs text-text-muted mt-0.5">
                                        {isConnected ? "Already connected" : p.description}
                                    </div>
                                </div>

                                {isConnected && <CheckCircleIcon className="size-5 text-primary shrink-0" />}
                                {isConnecting && (
                                    <div className="animate-spin rounded-full size-4 border-2 border-primary-light border-t-primary shrink-0" />
                                )}
                                {!isConnected && !isConnecting && (
                                    <ExternalLink className="size-4 text-text-muted shrink-0 group-hover:text-text-secondary transition-colors" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </motion.div>
        </div>
    )
}
