import React, { useState, useMemo, useRef, useEffect } from 'react'
import { PROPERTIES, type Property } from '../data/properties'
import { Building2, MapPin, Maximize2, Bed, Car, SlidersHorizontal, 
  X, MessageSquare, Check, ChevronRight, ChevronLeft } from 'lucide-react'

export default function PropertyCatalog() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('todos');
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedPurpose, setSelectedPurpose] = useState<string>('todos');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>('todos');
  const [activePropertyModal, setActivePropertyModal] = useState<Property | null>(null);
  const [activeModalImageIndex, setActiveModalImageIndex] = useState<number>(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const firstCard = sliderRef.current.firstElementChild as HTMLElement | null;
      const cardWidth = firstCard ? firstCard.clientWidth : 300;
      const scrollDistance = cardWidth + 18;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth'
      });
    }
  };

  // Available neighborhoods list dynamically extracted
  const neighborhoods = useMemo(() => {
    const list = Array.from(new Set(PROPERTIES.map(p => p.neighborhood)));
    return ['todos', ...list];
  }, []);

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(p => {
      if (selectedNeighborhood !== 'todos' && p.neighborhood !== selectedNeighborhood) return false;
      if (selectedType !== 'todos' && p.type !== selectedType) return false;
      if (selectedPurpose !== 'todos' && p.purpose !== selectedPurpose) return false;
      if (selectedBedrooms !== 'todos' && p.bedrooms < parseInt(selectedBedrooms)) return false;
      return true;
    });
  }, [selectedNeighborhood, selectedType, selectedPurpose, selectedBedrooms]);

  // Reset slider position whenever filtered properties change
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [filteredProperties]);

  const resetFilters = () => {
    setSelectedNeighborhood('todos');
    setSelectedType('todos');
    setSelectedPurpose('todos');
    setSelectedBedrooms('todos');
  };

  const openPropertyDetails = (property: Property) => {
    setActivePropertyModal(property);
    setActiveModalImageIndex(0);
  };

  const getWhatsAppLinkForProperty = (property: Property) => {
    const text = encodeURIComponent(
      `Olá, Tatiana! Vi o imóvel "${property.title}" (Ref: ${property.referenceCode}) no seu site e gostaria de agendar uma conversa e receber mais informações.`
    );
    return `https://wa.me/5581997459932?text=${text}`;
  };

  return (
    <section id="imoveis" className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 scroll-reveal-down">
          <div>
            <div className="inline-flex items-center space-x-2 bg-[#F2ECE3] px-3.5 py-1.5 rounded-full border border-[#E5DBD0] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
              <span className="text-xs uppercase tracking-widest text-[#4A2E22] font-semibold">
                Portfólio Selecionado
              </span>
            </div>
            
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#26160F] leading-tight">
              Imóveis na Zona Norte do Recife
            </h2>
            
            <p className="font-body text-sm sm:text-base text-[#6E6760] mt-3 max-w-xl">
              Cada imóvel em nossa carteira passa por curadoria arquitetônica e verificação documental prévia.
            </p>
          </div>

          {/* Quick status counter & mobile filter button */}
          <div className="mt-6 md:mt-0 flex items-center space-x-3">
            <span className="text-xs sm:text-sm font-medium text-[#4A2E22] bg-[#F2ECE3] px-4 py-2 rounded-full border border-[#E5DBD0]">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel disponível' : 'imóveis disponíveis'}
            </span>

            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden inline-flex items-center space-x-2 bg-[#26160F] text-white px-4 py-2 rounded-full text-xs font-medium touch-target"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {/* Filters Bar: Desktop & Tablet */}
        <div className="hidden md:block bg-white p-5 rounded-2xl border border-[#E5DBD0] shadow-sm mb-12 scroll-reveal-down delay-100 card-dynamic">
          <div className="grid grid-cols-4 gap-4 items-center">
            
            {/* Neighborhood Filter */}
            <div>
              <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-2">
                Bairro (Zona Norte)
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-3.5 py-2.5 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32] font-medium"
              >
                <option value="todos">Todos os bairros</option>
                {neighborhoods.filter(n => n !== 'todos').map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-2">
                Tipo de Imóvel
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-3.5 py-2.5 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32] font-medium"
              >
                <option value="todos">Todos os tipos</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa em Condomínio</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            {/* Purpose Filter */}
            <div>
              <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-2">
                Objetivo
              </label>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-3.5 py-2.5 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32] font-medium"
              >
                <option value="todos">Morar ou Investir</option>
                <option value="morar">Para Morar</option>
                <option value="investir">Para Investir</option>
              </select>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-2">
                Quartos
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-3.5 py-2.5 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32] font-medium"
                >
                  <option value="todos">Qualquer quantidade</option>
                  <option value="1">1+ quartos</option>
                  <option value="2">2+ quartos</option>
                  <option value="3">3+ quartos</option>
                  <option value="4">4+ quartos</option>
                </select>

                {(selectedNeighborhood !== 'todos' || selectedType !== 'todos' || selectedPurpose !== 'todos' || selectedBedrooms !== 'todos') && (
                  <button
                    onClick={resetFilters}
                    className="p-2.5 text-[#C85A32] hover:bg-[#F2ECE3] rounded-xl transition-colors shrink-0"
                    title="Limpar filtros"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="md:hidden bg-white p-5 rounded-2xl border border-[#E5DBD0] shadow-lg mb-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DBD0]">
              <span className="font-semibold text-sm text-[#26160F]">Filtros de busca</span>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-[#6E6760] hover:text-[#26160F]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6760] mb-1">Bairro</label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => setSelectedNeighborhood(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl p-3 text-sm"
              >
                <option value="todos">Todos os bairros</option>
                {neighborhoods.filter(n => n !== 'todos').map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6760] mb-1">Tipo de Imóvel</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl p-3 text-sm"
              >
                <option value="todos">Todos os tipos</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Cobertura">Cobertura</option>
                <option value="Studio">Studio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6760] mb-1">Objetivo</label>
              <select
                value={selectedPurpose}
                onChange={(e) => setSelectedPurpose(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl p-3 text-sm"
              >
                <option value="todos">Todos os objetivos</option>
                <option value="morar">Para Morar</option>
                <option value="investir">Para Investir</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#6E6760] mb-1">Quartos</label>
              <select
                value={selectedBedrooms}
                onChange={(e) => setSelectedBedrooms(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl p-3 text-sm"
              >
                <option value="todos">Qualquer quantidade</option>
                <option value="1">1+ quartos</option>
                <option value="2">2+ quartos</option>
                <option value="3">3+ quartos</option>
                <option value="4">4+ quartos</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={resetFilters}
                className="w-1/2 py-3 border border-[#E5DBD0] rounded-xl text-xs font-semibold text-[#6E6760]"
              >
                Limpar
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 bg-[#26160F] text-white rounded-xl text-xs font-semibold"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}

        {/* Empty state if nothing matches */}
        {filteredProperties.length === 0 && (
          <div className="bg-white p-12 rounded-3xl border border-[#E5DBD0] text-center max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-[#C85A32] mx-auto mb-4" />
            <h3 className="font-display text-xl font-medium text-[#26160F] mb-2">
              Nenhum imóvel encontrado para estes filtros
            </h3>
            <p className="text-sm text-[#6E6760] mb-6">
              A Tatiana possui imóveis em captação exclusiva ou pode buscar a unidade perfeita para você na Zona Norte.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center space-x-2 bg-[#C85A32] text-white px-6 py-3 rounded-xl text-sm font-semibold touch-target"
            >
              <span>Restaurar filtros</span>
            </button>
          </div>
        )}

        {/* Property Cards - Centered if single result, Slider on Mobile, Grid on Desktop */}
        <div 
          ref={sliderRef}
          className={
            filteredProperties.length === 1
              ? "flex justify-center w-full px-4 sm:px-0 pb-2 pt-1 md:pb-0 md:pt-0"
              : filteredProperties.length === 2
              ? "flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4.5 pb-2 pt-1 md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0 md:pt-0 md:max-w-4xl md:mx-auto"
              : "flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 gap-4.5 pb-2 pt-1 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 md:pt-0"
          }
        >
          {filteredProperties.map((property, index) => {
            const animDirection = index % 3 === 0 
              ? 'scroll-reveal-left delay-100' 
              : index % 3 === 1 
              ? 'scroll-reveal-down delay-200' 
              : 'scroll-reveal-right delay-300';
            return (
              <div
                key={property.id}
                className={
                  filteredProperties.length === 1
                    ? `w-full max-w-[380px] md:max-w-md mx-auto group bg-white rounded-2xl border border-[#E5DBD0] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between card-dynamic ${animDirection}`
                    : `w-[85vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink md:snap-align-none group bg-white rounded-2xl border border-[#E5DBD0] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between card-dynamic ${animDirection}`
                }
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#F2ECE3]">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                    
                    {/* Status Tag */}
                    <span className="absolute top-3 left-3 bg-[#26160F]/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                      {property.status}
                    </span>

                    {/* Price Tag in Image */}
                    <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#26160F] text-xs sm:text-sm font-bold px-3 py-1 rounded-lg">
                      {property.price}
                    </span>

                    {/* Reference code */}
                    <span className="absolute bottom-3 right-3 text-[10px] text-white/90 font-mono">
                      Ref: {property.referenceCode}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center space-x-1.5 text-xs text-[#C85A32] font-semibold uppercase tracking-wider mb-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{property.neighborhood} • {property.type}</span>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-[#26160F] group-hover:text-[#C85A32] transition-colors line-clamp-1 mb-2">
                      {property.title}
                    </h3>

                    <p className="text-xs text-[#6E6760] line-clamp-2 leading-relaxed mb-4">
                      {property.highlight}
                    </p>

                    {/* Specs Pill Matrix */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#E5DBD0] text-center text-xs text-[#4A2E22]">
                      <div className="flex items-center justify-center space-x-1">
                        <Maximize2 className="w-3.5 h-3.5 text-[#6E6760]" />
                        <span className="font-semibold">{property.area} m²</span>
                      </div>

                      <div className="flex items-center justify-center space-x-1">
                        <Bed className="w-3.5 h-3.5 text-[#6E6760]" />
                        <span className="font-semibold">{property.bedrooms} qtos</span>
                      </div>

                      <div className="flex items-center justify-center space-x-1">
                        <Car className="w-3.5 h-3.5 text-[#6E6760]" />
                        <span className="font-semibold">{property.parkingSpaces} vag</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center space-x-3">
                  <button
                    onClick={() => openPropertyDetails(property)}
                    className="flex-1 py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE3] text-[#26160F] text-xs font-semibold border border-[#E5DBD0] transition-colors touch-target"
                  >
                    Ver detalhes
                  </button>

                  <a
                    href={getWhatsAppLinkForProperty(property)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#C85A32] hover:bg-[#AB4823] text-white p-3 rounded-xl transition-colors touch-target"
                    title="Tirar dúvidas sobre este imóvel no WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Mobile Navigation Controls & Swipe Helper */}
        {filteredProperties.length > 1 && (
          <div className="flex md:hidden flex-col items-center justify-center gap-2.5 mt-5">
            {/* Centered navigation buttons */}
            <div className="flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={() => scrollSlider('left')}
                className="w-10 h-10 rounded-full bg-white border border-[#E5DBD0] flex items-center justify-center text-[#26160F] shadow-xs active:scale-95 transition-all touch-target"
                aria-label="Ver imóvel anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollSlider('right')}
                className="w-10 h-10 rounded-full bg-white border border-[#E5DBD0] flex items-center justify-center text-[#26160F] shadow-xs active:scale-95 transition-all touch-target"
                aria-label="Ver próximo imóvel"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-[#6E6760] font-medium flex items-center space-x-1.5">
              <span>Deslize para ver mais</span>
              <span className="text-[#C85A32] font-semibold">→</span>
            </span>
          </div>
        )}

        {/* Property Detail Modal */}
        {activePropertyModal && (
          <div
            onClick={() => setActivePropertyModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5DBD0] my-auto max-h-[96dvh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            >
              
              {/* Main Gallery Display */}
              <div className="relative h-66 sm:h-72 sm:aspect-[16/9] bg-black shrink-0">
                <img
                  src={activePropertyModal.images[activeModalImageIndex]}
                  alt={activePropertyModal.title}
                  className="w-full h-full object-cover"
                />

                {/* Close Button */}
                <button
                  onClick={() => setActivePropertyModal(null)}
                  className="absolute top-3 right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors touch-target"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Thumbnail selector */}
                {activePropertyModal.images.length > 1 && (
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex space-x-2 overflow-x-auto pb-0.5">
                    {activePropertyModal.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveModalImageIndex(i)}
                        className={`w-14 h-10 sm:w-16 sm:h-11 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                          activeModalImageIndex === i ? 'border-[#C85A32] scale-105' : 'border-white/50 opacity-70'
                        }`}
                      >
                        <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-4 sm:p-7 overflow-y-auto flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                    <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#C85A32] uppercase tracking-wider">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{activePropertyModal.neighborhood} • {activePropertyModal.city}</span>
                    </div>
                    <span className="text-xs font-mono text-[#6E6760]">
                      Ref: {activePropertyModal.referenceCode}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 mb-3">
                    <h3 className="font-display text-xl sm:text-2xl font-semibold text-[#26160F] truncate">
                      {activePropertyModal.title}
                    </h3>
                    <span className="text-lg sm:text-2xl font-bold text-[#C85A32] shrink-0">
                      {activePropertyModal.price}
                    </span>
                  </div>

                  {/* Specs */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DBD0] mb-3.5 text-center text-xs">
                    <div>
                      <span className="block text-xs text-[#6E6760]">Área</span>
                      <strong className="text-[#26160F] text-sm sm:text-base font-semibold">{activePropertyModal.area} m²</strong>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6760]">Quartos</span>
                      <strong className="text-[#26160F] text-sm sm:text-base font-semibold">{activePropertyModal.bedrooms} ({activePropertyModal.suites} stes)</strong>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6760]">Vagas</span>
                      <strong className="text-[#26160F] text-sm sm:text-base font-semibold">{activePropertyModal.parkingSpaces} vag</strong>
                    </div>
                    <div>
                      <span className="block text-xs text-[#6E6760]">Perfil</span>
                      <strong className="text-[#26160F] text-sm sm:text-base font-semibold capitalize">{activePropertyModal.purpose}</strong>
                    </div>
                  </div>

                  <div className="mb-3.5">
                    <h4 className="text-xs uppercase font-bold text-[#6E6760] tracking-wider mb-1">
                      Sobre o Imóvel
                    </h4>
                    <p className="text-xs sm:text-sm text-[#4A2E22] leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {activePropertyModal.description}
                    </p>
                  </div>

                  <div className="mb-4 sm:mb-5">
                    <h4 className="text-xs uppercase font-bold text-[#6E6760] tracking-wider mb-1.5">
                      Destaques & Diferenciais
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {activePropertyModal.features.map((f, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#F2ECE3] text-xs font-medium text-[#26160F]"
                        >
                          <Check className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                          <span>{f}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal CTA */}
                <div className="pt-3 sm:pt-4 border-t border-[#E5DBD0] flex items-center gap-2.5">
                  <a
                    href={getWhatsAppLinkForProperty(activePropertyModal)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 bg-[#C85A32] hover:bg-[#AB4823] text-white py-3 sm:py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm transition-all touch-target shadow-md shadow-[#C85A32]/20 active:scale-95 text-center"
                  >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span>Quero conhecer este imóvel (WhatsApp)</span>
                  </a>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
