import { useState, useMemo } from 'react';
import { Star, CheckCircle, Shield, BadgeCheck, Award, Phone, Mail, Crown, Gem, Sparkles } from 'lucide-react';
import { professionals, type Professional } from '../data/professionals';

const categories = ['All', 'Realtor', 'Immigration Attorney', 'Financial Advisor', 'Physician', 'Dentist', 'Wedding Vendor'];

function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

export default function Professionals() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return professionals;
    return professionals.filter((p: Professional) => p.category === activeCategory);
  }, [activeCategory]);

  const foundingPartners = filtered.filter((p: Professional) => p.partnershipTier === 'Founding Partner');
  const others = filtered.filter((p: Professional) => p.partnershipTier !== 'Founding Partner');

  return (
    <div className="min-h-[100dvh] bg-[#FAF6F1]">
      {/* Hero */}
      <section className="bg-white pt-28 pb-12 px-4 border-b border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#0A7B6D] text-xs font-semibold uppercase tracking-[2px] mb-3">Trusted Experts</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E2328] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Verified Professionals</h1>
          <p className="text-[#6B6865] text-lg max-w-2xl mx-auto">Connect with top-rated professionals serving North Carolina's Indian community</p>
        </div>
      </section>

      {/* Category Filters */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-[72px] z-30">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#0A7B6D] text-white shadow-sm' : 'bg-gray-50 text-[#1E2328] hover:bg-[#FFF3E8]'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {foundingPartners.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C8A84E] mb-4 flex items-center gap-2">
              <Crown className="w-4 h-4" /> Founding Partners
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foundingPartners.map((pro) => <ProCard key={pro.id} pro={pro} />)}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((pro) => <ProCard key={pro.id} pro={pro} />)}
        </div>

        {filtered.length === 0 && <div className="text-center py-20"><p className="text-xl text-[#6B6865]">No professionals found in this category.</p></div>}
      </div>

      {/* Trust Signals */}
      <section className="bg-[#08574D] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>Why Verified?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <CheckCircle className="w-8 h-8" />, title: 'Community Vetted', desc: 'Every professional is reviewed by community members who have used their services' },
              { icon: <Shield className="w-8 h-8" />, title: 'License Verified', desc: 'We verify professional licenses, credentials, and insurance coverage annually' },
              { icon: <BadgeCheck className="w-8 h-8" />, title: 'Transparent Reviews', desc: 'Only verified clients can leave reviews, ensuring authentic feedback' },
            ].map((t) => (
              <div key={t.title} className="text-center p-6">
                <div className="w-14 h-14 bg-[#C8A84E]/20 rounded-full flex items-center justify-center text-[#C8A84E] mx-auto mb-4">{t.icon}</div>
                <h3 className="font-bold text-white mb-2">{t.title}</h3>
                <p className="text-white/70 text-sm">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFF3E8] py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#1E2328] mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>Are You a Professional?</h2>
          <p className="text-[#6B6865] mb-6">Join NC Desi Circle's verified network and connect with 130,000+ community members</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#/submit" className="px-6 py-3 bg-[#0A7B6D] text-white rounded-lg font-semibold hover:bg-[#08574D] transition-colors">Join as a Professional</a>
            <a href="#/about" className="px-6 py-3 border border-[#D4621A] text-[#D4621A] rounded-lg font-semibold hover:bg-[#D4621A] hover:text-white transition-colors">Learn About Partnerships</a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProCard({ pro }: { pro: Professional }) {
  const tierBadge = pro.partnershipTier === 'Founding Partner' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-[#C8A84E] to-[#D4621A] text-white text-xs font-bold rounded-full"><Crown className="w-3 h-3" /> Founding Partner</span>
  ) : pro.partnershipTier === 'Premium Partner' ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0A7B6D] text-white text-xs font-semibold rounded-full"><Gem className="w-3 h-3" /> Premium Partner</span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#D4621A]/30 text-[#D4621A] text-xs font-medium rounded-full"><Sparkles className="w-3 h-3" /> {pro.partnershipTier}</span>
  );

  const telUrl = `tel:${cleanPhone(pro.phone)}`;
  const emailUrl = `mailto:${pro.email}`;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-50">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[#FFF3E8] flex items-center justify-center text-[#D4621A] text-xl font-bold shrink-0">
          {pro.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          {tierBadge}
          <h3 className="font-bold text-[#1E2328] mt-2 truncate">{pro.name}</h3>
          <p className="text-sm text-[#0A7B6D] font-medium">{pro.title}</p>
          <p className="text-xs text-[#6B6865]">{pro.company}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3">
        <div className="flex">
          {[1,2,3,4,5].map((i) => <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(pro.rating) ? 'text-[#C8A84E] fill-[#C8A84E]' : 'text-gray-300'}`} />)}
        </div>
        <span className="text-sm text-[#6B6865] ml-1">{pro.rating} ({pro.reviewCount})</span>
      </div>

      <p className="text-sm text-[#6B6865] line-clamp-2">{pro.bio}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {pro.credentials.slice(0, 2).map((c) => <span key={c} className="flex items-center gap-1 text-xs text-[#0A7B6D] bg-[#0A7B6D]/5 px-2 py-1 rounded-full"><Award className="w-3 h-3" /> {c}</span>)}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {pro.specialties.slice(0, 3).map((s) => <span key={s} className="px-2 py-0.5 bg-[#FFF3E8] text-[#6B6865] text-xs rounded-full">{s}</span>)}
      </div>

      <div className="flex items-center gap-3 mt-3 text-xs text-[#6B6865]">
        <span>{pro.yearsExperience}+ yrs</span>
        <span>{pro.languages.slice(0, 2).join(', ')}</span>
      </div>

      {/* Clickable phone and email */}
      <div className="flex gap-2 mt-4">
        <a href={telUrl} className="flex-1 px-4 py-2 bg-[#D4621A] text-white rounded-lg text-sm font-semibold hover:bg-[#b85214] transition-colors flex items-center justify-center gap-1.5">
          <Phone className="w-4 h-4" /> Call
        </a>
        <a href={emailUrl} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
          <Mail className="w-4 h-4 text-[#6B6865]" />
        </a>
      </div>
    </div>
  );
}
