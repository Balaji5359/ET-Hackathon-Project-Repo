import { motion } from "framer-motion";

interface OnboardingBannerProps {
  step: number;
  totalSteps: number;
}

const OnboardingBanner = ({ step, totalSteps }: OnboardingBannerProps) => {
  const progress = Math.min((step / totalSteps) * 100, 100);
  const isComplete = step >= totalSteps;

  if (isComplete) return null;

  return (
    <div className="px-4 md:px-8 py-3 border-b border-border bg-primary/5">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        <div>
          <p className="text-xs font-semibold text-primary">Onboarding in progress</p>
          <p className="text-[11px] text-muted-foreground">
            Step {step} of {totalSteps} — Building your financial profile
          </p>
        </div>
        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingBanner;
