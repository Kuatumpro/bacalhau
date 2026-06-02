export interface Property {
  id: string;
  title: string;
  description: string;
  category: 'condominio' | 'apartamento' | 'casa' | 'terreno';
  value: string;
  priceNumeric?: number; // Numeric value for price range slider
  address: string;
  city?: string; // Cidade
  neighborhood?: string; // Bairro
  specA: string; // e.g. "4 Suítes" or "Plano"
  specB: string; // e.g. "5 Banhos" or "Golf Club"
  specC: string; // e.g. "420m²" or "600m²"
  bedrooms?: number; // Número de dormitórios
  suites?: number; // Número de suítes
  parkingSpots?: number; // Número de vagas de garagem
  code?: string; // Código do imóvel
  status?: 'Venda' | 'Locação' | 'Temporada' | 'Lançamento' | 'Em construção' | 'Outros'; // Status do imóvel
  imageUrl: string; // Main image (capa)
  images?: string[]; // Up to 40 images
  tag?: string; // e.g., "Destaque", "Vista Mar", "Oportunidade", "Exclusividade"
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message?: string;
  status: 'Novo' | 'Em Atendimento' | 'Finalizado';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteSubtitle: string;
  creci: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  colorPrimary: string; // e.g. Hex code
  colorSecondary: string; // e.g. Hex code
  showHero: boolean;
  showProperties: boolean;
  showDifferentials: boolean;
  showGallery: boolean;
  showTestimonials: boolean;
  showContactForm: boolean;
}
