import { Map } from 'lucide-react';

export default function CommunityMap() {
  return (
    <div className="pt-[72px] min-h-[100dvh] bg-warm-cream">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <p className="text-teal text-[13px] font-medium uppercase tracking-[1.5px] mb-3">Map</p>
          <h1 className="font-display text-[40px] md:text-[56px] font-bold text-charcoal leading-tight tracking-tight mb-4">
            Community Map
          </h1>
          <p className="text-warm-gray text-[18px] max-w-[560px] mx-auto">
            Interactive map of businesses and events across NC.
          </p>
        </div>
        <div className="flex justify-center">
          <Map className="w-12 h-12 text-saffron/30" />
        </div>
        <p className="text-center text-warm-gray mt-8">Full map page coming soon.</p>
      </div>
    </div>
  );
}
