import { cn } from '@/lib/utils';

export const SECTION_GRADIENT_HEADING_CLASS =
  'text-prive-gradient text-xl font-black uppercase tracking-wider md:text-2xl';

type SectionGradientHeadingProps = {
  id?: string;
  title: string;
  subtitle?: string;
  as?: 'h2' | 'h3';
  className?: string;
  headingClassName?: string;
};

export function SectionGradientHeading({
  id,
  title,
  subtitle,
  as: Tag = 'h2',
  className,
  headingClassName,
}: SectionGradientHeadingProps) {
  return (
    <div className={cn('text-left md:text-center', className)}>
      <Tag id={id} className={cn(SECTION_GRADIENT_HEADING_CLASS, headingClassName)}>
        {title}
      </Tag>
      {subtitle ? (
        <p className="mt-3 text-sm text-prive-text-muted md:mt-4 md:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}
