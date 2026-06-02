import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, MapPin, Tag, Building, DollarSign } from 'lucide-react';
import { Property } from '../types';

interface AdvancedSearchProps {
  properties: Property[];
  onFilterChange: (filtered: Property[]) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function AdvancedSearch({ properties, onFilterChange, activeCategory, setActiveCategory }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter states
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('todos');
  const [type, setType] = useState('todos');
  const [city, setCity] = useState('todos');
  const [neighborhood, setNeighborhood] = useState('todos');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('todos');
  const [suites, setSuites] = useState('todos');
  const [parking, setParking] = useState('todos');

  // Dynamically obtain unique cities and neighborhoods from database
  const cities = Array.from(new Set(properties.map(p => p.city || p.address.split(',').pop()?.trim()).filter(Boolean)));
  const neighborhoods = Array.from(new Set(properties.map(p => p.neighborhood).filter(Boolean)));

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const filtered = properties.filter(prop => {
      // 1. Keyword search (Code or Title)
      if (code) {
        const lowerCode = code.toLowerCase();
        const matchesCode = prop.code?.toLowerCase().includes(lowerCode) || prop.id.toLowerCase().includes(lowerCode);
        const matchesTitle = prop.title.toLowerCase().includes(lowerCode);
        const matchesAddress = prop.address.toLowerCase().includes(lowerCode);
        if (!matchesCode && !matchesTitle && !matchesAddress) return false;
      }

      // 2. Status filter
      if (status !== 'todos') {
        if (!prop.status || prop.status !== status) return false;
      }

      // 3. Property Type category
      const targetType = type === 'todos' ? activeCategory : type;
      if (targetType !== 'todos') {
        if (prop.category !== targetType) return false;
      }

      // 4. City filter
      if (city !== 'todos') {
        const propCity = prop.city || prop.address.split(',').pop()?.trim();
        if (propCity !== city) return false;
      }

      // 5. Neighborhood filter
      if (neighborhood !== 'todos') {
        if (prop.neighborhood !== neighborhood) return false;
      }

      // 6. Bedrooms
      if (bedrooms !== 'todos') {
        const minBed = parseInt(bedrooms, 10);
        if (prop.bedrooms === undefined || prop.bedrooms < minBed) return false;
      }

      // 7. Suites
      if (suites !== 'todos') {
        const minSuite = parseInt(suites, 10);
        if (prop.suites === undefined || prop.suites < minSuite) return false;
      }

      // 8. Parking spots
      if (parking !== 'todos') {
        const minPark = parseInt(parking, 10);
        if (prop.parkingSpots === undefined || prop.parkingSpots < minPark) return false;
      }

      // 9. Price dynamic parsing
      // Parse numeric price from prop value (e.g. "R$ 3.800.000" -> 3800000)
      const propPrice = prop.priceNumeric || parseInt(prop.value.replace(/[^0-9]/g, ''), 10) || 0;
      if (minPrice) {
        const min = parseInt(minPrice, 10);
        if (propPrice < min) return false;
      }
      if (maxPrice) {
        const max = parseInt(maxPrice, 10);
        if (propPrice > max) return false;
      }

      return true;
    });

    onFilterChange(filtered);
  };

  const handleResetFilters = () => {
    setCode('');
    setStatus('todos');
    setType('todos');
    setCity('todos');
    setNeighborhood('todos');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('todos');
    setSuites('todos');
    setParking('todos');
    setActiveCategory('todos');
    onFilterChange(properties);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-6 -mt-16 relative z-30 transition-all">
      <form onSubmit={(e) => { e.preventDefault(); handleApplyFilters(); }} className="space-y-4">
        
        {/* Row 1: Fast basic parameters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          
          {/* Main search text / Code */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Buscar por Código ou Nome</label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Ex. EL-1001, Mansão..."
                className="w-full pl-10 pr-4 py-3 bg-gray-55 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-gray-800"
              />
            </div>
          </div>

          {/* Tipo de Imóvel */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Tipo de Imóvel</label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  if (e.target.value !== 'todos') setActiveCategory(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-55 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-gray-800 cursor-pointer appearance-none"
              >
                <option value="todos">Todos os Tipos</option>
                <option value="casa">Casa</option>
                <option value="condominio">Condomínio</option>
                <option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno</option>
              </select>
            </div>
          </div>

          {/* Status (Venda, Locação, etc) */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Status</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/30 text-gray-800 cursor-pointer"
              >
                <option value="todos">Todos os Status</option>
                <option value="Venda">Venda</option>
                <option value="Locação">Locação</option>
                <option value="Temporada">Temporada</option>
                <option value="Lançamento">Lançamento</option>
                <option value="Em construção">Em construção</option>
                <option value="Outros">Outros</option>
              </select>
            </div>
          </div>

          {/* Buttons: Search, Toggle Advanced */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`px-4 py-3 border rounded-xl flex items-center gap-1.5 text-sm font-semibold transition-all cursor-pointer ${
                isOpen ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrar
              {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            
            <button
              type="submit"
              className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 px-5 rounded-xl text-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md shadow-brand-orange/20 cursor-pointer transition-all"
            >
              <Search className="w-4 h-4" />
              Buscar
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Section */}
        {isOpen && (
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn transition-all">
            
            {/* City Selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Cidade</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-gray-850 cursor-pointer"
                >
                  <option value="todos">Qualquer Cidade</option>
                  {cities.map((element, i) => (
                    <option key={i} value={element}>{element}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Neighborhood Selection */}
            {neighborhoods.length > 0 && (
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Bairro</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-orange" />
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-gray-850 cursor-pointer"
                  >
                    <option value="todos">Qualquer Bairro</option>
                    {neighborhoods.map((element, i) => (
                      <option key={i} value={element}>{element}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Price Min/Max bounds */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Faixa de Preço (R$)</label>
              <div className="flex gap-2 items-center">
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Mínimo"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>
                <span className="text-gray-400 text-xs font-semibold">-</span>
                <div className="relative flex-1">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Máximo"
                    className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Dormitórios Mín.</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-gray-850 cursor-pointer"
              >
                <option value="todos">Qualquer quantidade</option>
                <option value="1">1 ou mais</option>
                <option value="2">2 ou mais</option>
                <option value="3">3 ou mais</option>
                <option value="4">4 ou mais</option>
                <option value="5">5 ou mais</option>
              </select>
            </div>

            {/* Suites selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Suítes Mín.</label>
              <select
                value={suites}
                onChange={(e) => setSuites(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-gray-850 cursor-pointer"
              >
                <option value="todos">Qualquer quantidade</option>
                <option value="1">1 ou mais</option>
                <option value="2">2 ou mais</option>
                <option value="3">3 ou mais</option>
                <option value="4">4 ou mais</option>
              </select>
            </div>

            {/* Parking space selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Vagas Garagem Mín.</label>
              <select
                value={parking}
                onChange={(e) => setParking(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-gray-850 cursor-pointer"
              >
                <option value="todos">Qualquer quantidade</option>
                <option value="1">1 ou mais</option>
                <option value="2">2 ou mais</option>
                <option value="3">3 ou mais</option>
                <option value="4">4 ou mais</option>
              </select>
            </div>

            {/* Clean action */}
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full text-center py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Limpar Filtros
              </button>
            </div>

          </div>
        )}

      </form>
    </div>
  );
}
