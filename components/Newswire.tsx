import ServicesBentoGrid from '@/components/ServicesBentoGrid';

export default function Newswire() {
  return (
    <section
      id="newswire"
      className="newswire-scroll-bg scroll-mt-[calc(var(--site-header-h,5rem)+1rem)] w-full pt-8 pb-12 md:pb-16"
    >
      <div className="newswire-scroll-bg__layer" aria-hidden="true" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        <ServicesBentoGrid />
      </div>
    </section>
  );
}
