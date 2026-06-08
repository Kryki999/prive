import ServicesBentoGrid from '@/components/ServicesBentoGrid';

export default function Newswire() {
  return (
    <section
      id="newswire"
      className="scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] w-full border-t border-prive-border bg-white pt-8 pb-12 md:pb-16"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <ServicesBentoGrid />
      </div>
    </section>
  );
}
