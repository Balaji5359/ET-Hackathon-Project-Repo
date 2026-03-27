import { motion } from "framer-motion";
import AiAvatar from "./AiAvatar";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; url: string }[];
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  index: number;
}

const MessageBubble = ({ message, index }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={cn("flex gap-3 max-w-[85%]", isUser ? "ml-auto flex-row-reverse" : "")}
    >
      {!isUser && <AiAvatar size="sm" />}
      <div>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-card border border-border rounded-bl-md shadow-card"
          )}
        >
          {message.content}
        </div>
        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.actions.map((action, i) => (
              <a
                key={i}
                href={action.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-accent/15 text-accent-foreground border border-accent/30 hover:bg-accent/25 transition-colors"
              >
                {action.label} →
              </a>
            ))}
          </div>
        )}
        <p className={cn(
          "text-[10px] mt-1 text-muted-foreground",
          isUser ? "text-right" : ""
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
