import { motion } from "framer-motion";
import aiAvatar from "@/assets/ai-avatar.png";

interface AiAvatarProps {
  size?: "sm" | "md" | "lg";
  isTyping?: boolean;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-24 h-24",
};

const AiAvatar = ({ size = "md", isTyping = false }: AiAvatarProps) => {
  return (
    <motion.div
      className={`${sizeMap[size]} relative flex-shrink-0`}
      animate={isTyping ? { scale: [1, 1.05, 1] } : {}}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      <div className="w-full h-full rounded-full overflow-hidden border-2 border-primary/30 shadow-glow">
        <img
          src={aiAvatar}
          alt="ET AI Concierge"
          className="w-full h-full object-cover"
          width={512}
          height={512}
        />
      </div>
      {isTyping && (
        <motion.div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary"
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.div>
  );
};

export default AiAvatar;
