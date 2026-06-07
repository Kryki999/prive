import { cn } from '@/lib/utils';

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'mx-auto grid max-w-6xl md:auto-rows-[18rem] md:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  );
}
