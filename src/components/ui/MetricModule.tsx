import { memo, type ReactNode } from 'react';
import { motion } from 'motion/react';

interface MetricModuleProps {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
  trend: string;
  trendUp?: boolean;
  color: string;
}

const MetricModule = /*#__PURE__*/ memo(function MetricModule({ icon, label, value, unit, trend, trendUp, color }: MetricModuleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card-impact space-y-8 group border-accent/5"
    >
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-bg rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        <div className={`text-[10px] font-bold uppercase tracking-widest ${color}`}>
          {trendUp !== undefined ? (trendUp ? '\u2191' : '\u2193') : '\u2022'} {trend}
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-[10px] uppercase font-bold text-text-muted/60 tracking-widest">{label}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-serif text-accent leading-none">{value}</span>
          <span className="text-xl font-serif text-text-muted italic">{unit}</span>
        </div>
      </div>
      <div className="pt-2">
        <div className="h-1 w-full bg-bg rounded-full overflow-hidden relative">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '60%' }}
            className="h-full bg-accent/20"
          />
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute inset-0 bg-accent/5 skew-x-[-20deg] w-1/4 motion-reduce:animate-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </motion.div>
  );
});

export default MetricModule;
