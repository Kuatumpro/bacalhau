import { Property, Lead } from './types';

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    title: 'Mansão Alphaville Residencial',
    category: 'condominio',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    tag: 'Destaque',
    value: 'R$ 3.800.000',
    priceNumeric: 3800000,
    address: 'Alameda das Esmeraldas, 452 - Barueri, São Paulo',
    city: 'Barueri',
    neighborhood: 'Alphaville',
    specA: '4 Suítes',
    specB: '5 Banhos',
    specC: '420m²',
    bedrooms: 4,
    suites: 4,
    parkingSpots: 4,
    code: 'EL-1001',
    status: 'Venda',
    description: 'Mansão espetacular com projeto contemporâneo, piscina de borda infinita, ampla área gourmet integrada, pé direito duplo, automação residencial de ponta e segurança blindada armada 24h.',
    createdAt: new Date('2026-05-15T10:00:00Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prop-2',
    title: 'Elite Residence Penthouse',
    category: 'apartamento',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    tag: 'Vista Mar',
    value: 'R$ 2.100.000',
    priceNumeric: 2100000,
    address: 'Av. Atlântica, 1200 - Bela Vista, Rio de Janeiro',
    city: 'Rio de Janeiro',
    neighborhood: 'Bela Vista',
    specA: '3 Suítes',
    specB: '4 Banhos',
    specC: '210m²',
    bedrooms: 3,
    suites: 3,
    parkingSpots: 2,
    code: 'EL-1002',
    status: 'Venda',
    description: 'Cobertura linear magnífica com acabamentos em mármore Carrara, adega climatizada para 120 garrafas, spa privativo com hidromassagem e vista integral de 180 graus para as mais belas paisagens do Rio de Janeiro.',
    createdAt: new Date('2026-05-16T14:30:00Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prop-3',
    title: 'Villa Di Toscana Residência',
    category: 'casa',
    imageUrl: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    tag: 'Oportunidade',
    value: 'R$ 950.000',
    priceNumeric: 950000,
    address: 'Rua das Figueiras, 88 - Campinas, São Paulo',
    city: 'Campinas',
    neighborhood: 'Chácara Primavera',
    specA: '3 Quartos',
    specB: '3 Banhos',
    specC: '180m²',
    bedrooms: 3,
    suites: 1,
    parkingSpots: 3,
    code: 'EL-1003',
    status: 'Locação',
    description: 'Uma charmosa casa inspirada na arquitetura toscana clássica, com ampla iluminação natural, lindo jardim com árvores frutíferas já formadas, garagem para 3 veículos e projeto moderno integrado, perfeita para receber a família.',
    createdAt: new Date('2026-05-20T09:15:00Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prop-4',
    title: 'Lote Elite Club & Golf',
    category: 'terreno',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    tag: 'Exclusividade',
    value: 'R$ 680.000',
    priceNumeric: 680000,
    address: 'Rodovia Dom Gabriel, Km 72 - Itupeva, São Paulo',
    city: 'Itupeva',
    neighborhood: 'Golf Club',
    specA: 'Plano',
    specB: 'Golf Club',
    specC: '600m²',
    bedrooms: 0,
    suites: 0,
    parkingSpots: 0,
    code: 'EL-1004',
    status: 'Venda',
    description: 'Loteamento totalmente plano em área nobre de alta valorização ao lado de lagos contemplativos de carpas, complexo esportivo completo e campo profissional de Golf.',
    createdAt: new Date('2026-05-22T11:00:00Z').toISOString(),
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Carlos Eduardo Menezes',
    email: 'carlos.menezes@exemplo.com',
    phone: '11999998888',
    interest: 'Mansão Alphaville Residencial',
    message: 'Gostaria de agendar uma visita para este sábado à tarde, se possível.',
    status: 'Em Atendimento',
    createdAt: new Date('2026-05-28T16:00:00Z').toISOString()
  },
  {
    id: 'lead-2',
    name: 'Beatriz Porto',
    email: 'beatriz.porto@exemplo.com',
    phone: '21988887777',
    interest: 'Elite Residence Penthouse',
    message: 'Tenho interesse em conhecer as condições de financiamento direto.',
    status: 'Novo',
    createdAt: new Date('2026-05-29T10:30:00Z').toISOString()
  },
  {
    id: 'lead-3',
    name: 'Ricardo Guimarães',
    email: 'ricardo.g@exemplo.com',
    phone: '19977776666',
    interest: 'Lote Elite Club & Golf',
    message: 'Sou arquiteto e tenho um cliente interessado na compra do lote para construir uma casa de campo contemporânea.',
    status: 'Finalizado',
    createdAt: new Date('2026-05-30T14:15:00Z').toISOString()
  }
];

// Preset luxurious house image options for quick insertion
export const PRESET_HOUSE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    name: 'Mansão Moderna com Piscina'
  },
  {
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    name: 'Casa Contemporânea Branca'
  },
  {
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    name: 'Prédio Penthouse de Vidro'
  },
  {
    url: 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?auto=format&fit=crop&w=800&q=80',
    name: 'Casa Estilo Clássico Toscana'
  },
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    name: 'Lote Terreno Gramado'
  },
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    name: 'Fachada Minimalista Escura'
  },
  {
    url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    name: 'Mansão Futurista com Deck'
  },
  {
    url: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    name: 'Chácara Luxo Integrada'
  }
];
