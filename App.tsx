/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, Home, MapPin, Search, Plus, Trash2, Edit, Phone, Mail, 
  Check, CheckCircle2, RefreshCw, LogOut, ArrowRight, X, Calendar, 
  Smile, Shield, Image as ImageIcon, Sparkles, Filter, ChevronRight, ChevronLeft, Eye, 
  Bed, Bath, Square, Tag, Upload, ArrowUpDown, Bell, Info, Settings, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property, Lead, SiteSettings } from './types';
import { INITIAL_PROPERTIES, INITIAL_LEADS, PRESET_HOUSE_IMAGES } from './presets';
import AdvancedSearch from './components/AdvancedSearch';
import VisualEditor from './components/VisualEditor';

export default function App() {
  // State for dynamic properties & leads
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('elite_properties');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PROPERTIES;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('elite_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_LEADS;
  });

  // Dynamic Site Settings for customizable theme & text parameters
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('elite_site_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      siteName: 'Elite',
      siteSubtitle: 'Imobiliária',
      creci: 'CRECI RS 81158 F',
      heroBadge: 'Lançamentos & Curadoria Exclusiva 2026',
      heroTitle: 'Onde seus sonhos encontram endereço',
      heroDescription: 'A Imobiliária Elite é a chave para o seu próximo capítulo de sofisticação. Apresentamos uma curadoria impecável de imóveis de alto padrão, combinando excelência arquitetônica com a segurança jurídica e patrimonial que você exige.',
      heroImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
      contactPhone: '+55 (54) 99635-2992',
      contactEmail: 'miltonbarbosacorretor@gmail.com',
      contactAddress: 'Rua dos Cravos, 06 - São Lucas - RS',
      colorPrimary: '#003366',
      colorSecondary: '#FF8C00',
      showHero: true,
      showProperties: true,
      showDifferentials: true,
      showGallery: true,
      showTestimonials: true,
      showContactForm: true,
    };
  });

  // Save state updates to LocalStorage
  useEffect(() => {
    localStorage.setItem('elite_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('elite_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('elite_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  // General App UI States
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activePropertyImgIndex, setActivePropertyImgIndex] = useState(0);
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string } | null>(null);
  
  // Advanced Search interactive state representation
  const [searchFilteredProperties, setSearchFilteredProperties] = useState<Property[] | null>(null);

  // Sync index of property gallery details carousel
  useEffect(() => {
    setActivePropertyImgIndex(0);
  }, [selectedProperty]);
  
  // Lead Contact Form State
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'Dúvida Geral',
    message: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Broker authentication
  const [isBrokerLoggedIn, setIsBrokerLoggedIn] = useState(() => {
    return sessionStorage.getItem('broker_authenticated') === 'true';
  });
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Broker Dashboard states
  const [dashboardTab, setDashboardTab] = useState<'leads' | 'properties' | 'visual'>('leads');
  const [dashboardStatusFilter, setDashboardStatusFilter] = useState<string>('todos');
  const [dashboardSearch, setDashboardSearch] = useState<string>('');
  const [unseenLeadsCount, setUnseenLeadsCount] = useState<number>(0);

  // Property addition/editing state inside Broker Panel
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propertyForm, setPropertyForm] = useState({
    title: '',
    description: '',
    category: 'casa' as 'condominio' | 'apartamento' | 'casa' | 'terreno',
    value: '',
    priceNumeric: 0,
    address: '',
    city: '',
    neighborhood: '',
    specA: '', // e.g. "4 Suítes" / "Plano"
    specB: '', // e.g. "5 Banhos" / "Vista Campo de Golfe"
    specC: '', // e.g. "420m²"
    tag: 'Destaque',
    imageUrl: PRESET_HOUSE_IMAGES[0].url,
    images: [PRESET_HOUSE_IMAGES[0].url] as string[],
    bedrooms: 3,
    suites: 1,
    parkingSpots: 2,
    code: '',
    status: 'Venda' as 'Venda' | 'Locação' | 'Temporada' | 'Lançamento' | 'Em construção' | 'Outros'
  });

  const [imageTab, setImageTab] = useState<'presets' | 'url' | 'upload'>('presets');
  const [uploadedBase64, setUploadedBase64] = useState<string | null>(null);
  
  // Advanced Gallery helper states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [externalImageUrlInput, setExternalImageUrlInput] = useState('');

  // Simple hex color adjusting functions to generate theme variations
  const adjustColorBrightness = (hex: string, percent: number) => {
    try {
      let R = parseInt(hex.substring(1, 3), 16);
      let G = parseInt(hex.substring(3, 5), 16);
      let B = parseInt(hex.substring(5, 7), 16);

      R = parseInt(((R * (100 + percent)) / 100).toString());
      G = parseInt(((G * (100 + percent)) / 100).toString());
      B = parseInt(((B * (100 + percent)) / 100).toString());

      R = R < 255 ? R : 255;
      G = G < 255 ? G : 255;
      B = B < 255 ? B : 255;

      R = R > 0 ? R : 0;
      G = G > 0 ? G : 0;
      B = B > 0 ? B : 0;

      const rHex = R.toString(16).padStart(2, '0');
      const gHex = G.toString(16).padStart(2, '0');
      const bHex = B.toString(16).padStart(2, '0');

      return `#${rHex}${gHex}${bHex}`;
    } catch {
      return hex;
    }
  };

  const getSoftTint = (hex: string, opacityPercent: number) => {
    try {
      let r = parseInt(hex.substring(1, 3), 16);
      let g = parseInt(hex.substring(3, 5), 16);
      let b = parseInt(hex.substring(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacityPercent / 100})`;
    } catch {
      return hex;
    }
  };

  // Compress image helper using canvas
  const compressImage = (base64Str: string, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.75): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Str);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  // Convert files to compressed base64 list
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const converted: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const compressed = await compressImage(base64);
      converted.push(compressed);
    }
    
    setPropertyForm(prev => {
      const currentImages = prev.images || [];
      const updatedImages = [...currentImages, ...converted].slice(0, 40);
      // Ensure cover exists
      const cover = prev.imageUrl && prev.imageUrl !== PRESET_HOUSE_IMAGES[0].url ? prev.imageUrl : updatedImages[0];
      return {
        ...prev,
        images: updatedImages,
        imageUrl: cover || prev.imageUrl
      };
    });
  };

  // Drag and drop reorder logic
  const handleImageReorder = (fromIndex: number, toIndex: number) => {
    const nextImages = [...propertyForm.images];
    const [draggedItem] = nextImages.splice(fromIndex, 1);
    nextImages.splice(toIndex, 0, draggedItem);
    setPropertyForm(prev => ({ ...prev, images: nextImages }));
  };

  const moveImageElement = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= propertyForm.images.length) return;
    handleImageReorder(index, targetIndex);
  };

  const deleteImageFromGallery = (index: number) => {
    const targetImg = propertyForm.images[index];
    const nextImages = propertyForm.images.filter((_, idx) => idx !== index);
    
    setPropertyForm(prev => {
      let nextCover = prev.imageUrl;
      if (prev.imageUrl === targetImg) {
        nextCover = nextImages[0] || '';
      }
      return {
        ...prev,
        images: nextImages,
        imageUrl: nextCover
      };
    });
  };

  const setAsCoverImage = (imgUrl: string) => {
    setPropertyForm(prev => ({ ...prev, imageUrl: imgUrl }));
  };

  const handleAddExternalImageUrl = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!externalImageUrlInput.trim()) return;
    setPropertyForm(prev => {
      const nextImages = [...(prev.images || []), externalImageUrlInput.trim()].slice(0, 40);
      const cover = prev.imageUrl ? prev.imageUrl : nextImages[0];
      return {
        ...prev,
        images: nextImages,
        imageUrl: cover
      };
    });
    setExternalImageUrlInput('');
  };
  
  // Refs
  const contactFormSectionRef = useRef<HTMLDivElement>(null);
  const propertyFormRef = useRef<HTMLDivElement>(null);

  // Sync count of unread (Novo) leads
  useEffect(() => {
    const freshCount = leads.filter(l => l.status === 'Novo').length;
    setUnseenLeadsCount(freshCount);
  }, [leads]);

  // Handle lead submission
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);

    setTimeout(() => {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: leadForm.name,
        email: leadForm.email,
        phone: leadForm.phone,
        interest: leadForm.interest,
        message: leadForm.message || undefined,
        status: 'Novo',
        createdAt: new Date().toISOString()
      };

      setLeads(prev => [newLead, ...prev]);
      setSubmitLoading(false);
      setToastMessage('Solicitação cadastrada! Nossos consultores especialistas Elite entrarão em contato em até 15 minutos.');
      
      // Reset form
      setLeadForm({
        name: '',
        email: '',
        phone: '',
        interest: 'Dúvida Geral',
        message: ''
      });

      // Clear toast after 5s
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);
    }, 1200);
  };

  const fillInterest = (propertyTitle: string) => {
    setLeadForm(prev => ({
      ...prev,
      interest: propertyTitle
    }));

    // Scroll to form with visual pulse
    contactFormSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    contactFormSectionRef.current?.classList.add('ring-4', 'ring-brand-orange/30');
    setTimeout(() => {
      contactFormSectionRef.current?.classList.remove('ring-4', 'ring-brand-orange/30');
    }, 1500);
  };

  // Login handlers
  const handleBrokerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPassword === 'elite2026') {
      setIsBrokerLoggedIn(true);
      sessionStorage.setItem('broker_authenticated', 'true');
      setLoginError(false);
      setIsLoginModalOpen(false);
      setIsDashboardOpen(true);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsBrokerLoggedIn(false);
    sessionStorage.removeItem('broker_authenticated');
    setIsDashboardOpen(false);
  };

  // Lead status transition
  const cycleLeadStatus = (leadId: string, currentStatus: string) => {
    let next: 'Novo' | 'Em Atendimento' | 'Finalizado' = 'Novo';
    if (currentStatus === 'Novo') next = 'Em Atendimento';
    else if (currentStatus === 'Em Atendimento') next = 'Finalizado';
    else if (currentStatus === 'Finalizado') next = 'Novo';

    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: next } : lead
    ));
  };

  // Remove lead
  const handleDeleteLead = (leadId: string) => {
    if (window.confirm('Excluir este lead permanentemente?')) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
    }
  };

  // Image Upload handler (Base64 conversion)
  const handleImageUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setUploadedBase64(base64String);
        setPropertyForm(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Property Form validation and save
  const handlePropertyFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!propertyForm.title || !propertyForm.value || !propertyForm.address) {
      alert('Por favor, preencha os campos obrigatórios (Título, Valor e Endereço).');
      return;
    }

    const calculatedPrice = propertyForm.priceNumeric || parseInt(propertyForm.value.replace(/[^0-9]/g, ''), 10) || 0;
    const assignedCode = propertyForm.code || `EL-${Math.floor(1000 + Math.random() * 9000)}`;

    if (editingPropertyId) {
      // Edit existing
      setProperties(prev => prev.map(prop => 
        prop.id === editingPropertyId 
          ? { 
              ...prop, 
              title: propertyForm.title,
              category: propertyForm.category,
              description: propertyForm.description,
              value: propertyForm.value,
              priceNumeric: calculatedPrice,
              address: propertyForm.address,
              city: propertyForm.city || propertyForm.address.split(',').pop()?.trim() || '',
              neighborhood: propertyForm.neighborhood || '',
              specA: propertyForm.specA || 'N/A',
              specB: propertyForm.specB || 'N/A',
              specC: propertyForm.specC || 'N/A',
              tag: propertyForm.tag || undefined,
              imageUrl: propertyForm.imageUrl,
              images: propertyForm.images,
              bedrooms: propertyForm.bedrooms,
              suites: propertyForm.suites,
              parkingSpots: propertyForm.parkingSpots,
              code: assignedCode,
              status: propertyForm.status
            }
          : prop
      ));
      setEditingPropertyId(null);
    } else {
      // Create new
      const newProperty: Property = {
        id: `prop-${Date.now()}`,
        title: propertyForm.title,
        description: propertyForm.description || 'Nenhum detalhe extra fornecido.',
        category: propertyForm.category,
        value: propertyForm.value,
        priceNumeric: calculatedPrice,
        address: propertyForm.address,
        city: propertyForm.city || propertyForm.address.split(',').pop()?.trim() || '',
        neighborhood: propertyForm.neighborhood || '',
        specA: propertyForm.specA || 'N/A',
        specB: propertyForm.specB || 'N/A',
        specC: propertyForm.specC || 'N/A',
        imageUrl: propertyForm.imageUrl,
        images: propertyForm.images,
        bedrooms: propertyForm.bedrooms,
        suites: propertyForm.suites,
        parkingSpots: propertyForm.parkingSpots,
        code: assignedCode,
        status: propertyForm.status,
        tag: propertyForm.tag || undefined,
        createdAt: new Date().toISOString()
      };
      setProperties(prev => [newProperty, ...prev]);
    }

    // Reset Form
    handleCancelEdit();
    alert(editingPropertyId ? 'Imóvel atualizado com sucesso!' : 'Novo imóvel adicionado com sucesso!');
  };

  // Load existing property into form for editing
  const startEditingProperty = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setPropertyForm({
      title: prop.title,
      description: prop.description,
      category: prop.category,
      value: prop.value,
      priceNumeric: prop.priceNumeric || parseInt(prop.value.replace(/[^0-9]/g, ''), 10) || 0,
      address: prop.address,
      city: prop.city || '',
      neighborhood: prop.neighborhood || '',
      specA: prop.specA,
      specB: prop.specB,
      specC: prop.specC,
      tag: prop.tag || '',
      imageUrl: prop.imageUrl,
      images: prop.images || [prop.imageUrl],
      bedrooms: prop.bedrooms !== undefined ? prop.bedrooms : 3,
      suites: prop.suites !== undefined ? prop.suites : 1,
      parkingSpots: prop.parkingSpots !== undefined ? prop.parkingSpots : 2,
      code: prop.code || '',
      status: prop.status || 'Venda'
    });

    if (prop.imageUrl.startsWith('data:image')) {
      setUploadedBase64(prop.imageUrl);
      setImageTab('upload');
    } else {
      const isPreset = PRESET_HOUSE_IMAGES.some(ph => ph.url === prop.imageUrl);
      setImageTab(isPreset ? 'presets' : 'url');
    }

    // Smooth scroll to the property creation form inside the dialog container
    propertyFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditingPropertyId(null);
    setPropertyForm({
      title: '',
      description: '',
      category: 'casa',
      value: '',
      priceNumeric: 0,
      address: '',
      city: '',
      neighborhood: '',
      specA: '',
      specB: '',
      specC: '',
      tag: 'Destaque',
      imageUrl: PRESET_HOUSE_IMAGES[0].url,
      images: [PRESET_HOUSE_IMAGES[0].url],
      bedrooms: 3,
      suites: 1,
      parkingSpots: 2,
      code: '',
      status: 'Venda'
    });
    setUploadedBase64(null);
  };

  // Delete dynamic property
  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm('Tem certeza que deseja despublicar e remover este imóvel do portfólio da imobiliária?')) {
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      if (editingPropertyId === propertyId) {
        handleCancelEdit();
      }
    }
  };

  // Filtering calculations on public view in sync with AdvancedSearch parameters
  const currentPropertiesList = searchFilteredProperties !== null ? searchFilteredProperties : properties;

  const filteredProperties = currentPropertiesList.filter(prop => {
    if (activeFilter === 'todos') return true;
    return prop.category === activeFilter;
  });

  // Filtering calculations on Broker panel
  const brokerFilteredLeads = leads.filter(lead => {
    const matchesStatus = dashboardStatusFilter === 'todos' || lead.status === dashboardStatusFilter;
    const matchesSearch = 
      lead.name.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      lead.phone.includes(dashboardSearch) ||
      lead.interest.toLowerCase().includes(dashboardSearch.toLowerCase()) ||
      (lead.message && lead.message.toLowerCase().includes(dashboardSearch.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  // Helper date formatter
  const formatDateFriendly = (isoString: string) => {
    try {
      const d = new Date(isoString);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hour = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} às ${hour}:${min}`;
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-white text-gray-800 antialiased font-sans min-h-screen selection:bg-brand-orange selection:text-white">
      <style>{`
        :root {
          --color-brand-blue: ${siteSettings.colorPrimary || '#003366'};
          --color-brand-blue-light: ${adjustColorBrightness(siteSettings.colorPrimary || '#003366', 20)};
          --color-brand-blue-dark: ${adjustColorBrightness(siteSettings.colorPrimary || '#003366', -30)};
          --color-brand-blue-soft: ${getSoftTint(siteSettings.colorPrimary || '#003366', 8)};
          --color-brand-orange: ${siteSettings.colorSecondary || '#FF8C00'};
          --color-brand-orange-hover: ${adjustColorBrightness(siteSettings.colorSecondary || '#FF8C00', -15)};
          --color-brand-orange-soft: ${getSoftTint(siteSettings.colorSecondary || '#FF8C00', 8)};
        }
      `}</style>

      {/* FIXED NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#inicio" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-brand-blue flex items-center justify-center rounded-lg shadow-md group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-brand-blue uppercase leading-tight">{siteSettings.siteName}</span>
                <span className="text-[10px] font-semibold tracking-widest text-brand-orange uppercase leading-none">{siteSettings.siteSubtitle}</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-600">
              <a href="#inicio" className="hover:text-brand-blue transition-colors relative py-2 block">Início</a>
              <a href="#imoveis" className="hover:text-brand-blue transition-colors relative py-2 block">Imóveis</a>
              <a href="#diferenciais" className="hover:text-brand-blue transition-colors relative py-2 block">Diferenciais</a>
              <a href="#galeria" className="hover:text-brand-blue transition-colors relative py-2 block">Galeria</a>
              <a href="#contato" className="hover:text-brand-blue transition-colors relative py-2 block font-semibold text-brand-orange">Contato</a>
            </nav>

            {/* Action Call WhatsApp */}
            <div className="flex items-center gap-4">
              <a 
                href={`https://wa.me/${siteSettings.contactPhone.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 transition-transform hover:-translate-y-0.5 shadow-sm"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span className="hidden sm:inline">Falar via WhatsApp</span>
                <span className="sm:hidden">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      {siteSettings.showHero && (
        <section id="inicio" className="relative min-h-[95vh] flex items-center pt-20 bg-brand-blue-dark">
          <div className="absolute inset-0 z-0">
            <img 
              src={siteSettings.heroImageUrl} 
              alt="Residência de Alto Padrão de Luxo" 
              className="w-full h-full object-cover opacity-35" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue-dark/95 via-brand-blue-dark/80 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-white">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider bg-brand-orange/20 text-brand-orange border border-brand-orange/30 uppercase mb-6">
                <Sparkles className="w-3 h-3 text-brand-orange animate-pulse" />
                {siteSettings.heroBadge}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
                {siteSettings.siteSubtitle && siteSettings.heroTitle.includes('sonhos') ? (
                  <>Onde seus <span className="text-brand-orange font-black">sonhos</span> encontram endereço</>
                ) : siteSettings.heroTitle}
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
                {siteSettings.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <a 
                  href="#contato" 
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transform hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-brand-orange/30"
                >
                  Fale com um Especialista
                  <ArrowRight className="w-5 h-5 border-none" />
                </a>
                <a 
                  href="#imoveis" 
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center hover:-translate-y-1 transition-all duration-300"
                >
                  Conhecer Empreendimentos
                </a>
              </div>

              {/* Quick Metrics in Hero */}
              <div className="grid grid-cols-3 gap-4 mt-16 pt-8 border-t border-white/10">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">R$ 2Bi+</p>
                  <p className="text-xs sm:text-sm text-gray-400">Em negócios</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">4.500+</p>
                  <p className="text-xs sm:text-sm text-gray-400">Chaves entregues</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">99.8%</p>
                  <p className="text-xs sm:text-sm text-gray-400">De satisfação</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PROPERTIES DISPLAY SECTION */}
      {siteSettings.showProperties && (
        <section id="imoveis" className="py-24 bg-brand-blue-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-extrabold text-brand-orange tracking-widest uppercase block mb-3 font-mono">CONHEÇA NOSSO PORTFÓLIO</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue tracking-tight">Imóveis Executivos em Destaque</h2>
              <div className="w-16 h-1 bg-brand-orange mx-auto mt-4 rounded"></div>
              <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">
                Casas e apartamentos selecionados minuciosamente para oferecer o maior conforto, mobilidade e sofisticação para seu estilo de vida único. Adicione seus próprios imóveis no Painel do Corretor para vê-los aqui em tempo real!
              </p>
            </div>

            {/* INTERACTIVE ADVANCED SEARCH SYSTEM */}
            <AdvancedSearch 
              properties={properties} 
              onFilterChange={(results) => setSearchFilteredProperties(results)} 
              activeCategory={activeFilter}
              setActiveCategory={setActiveFilter}
            />

            {/* Dynamically Filter Tabs */}
            <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-3 mb-12">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'condominio', label: 'Condomínios' },
                { id: 'apartamento', label: 'Apartamentos' },
                { id: 'casa', label: 'Casas' },
                { id: 'terreno', label: 'Terrenos' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    activeFilter === tab.id 
                      ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-brand-blue/30 hover:bg-brand-blue/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map(property => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={property.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full overflow-hidden"
                    >
                      {/* Image Area with Badge Tag */}
                      <div className="relative h-56 overflow-hidden bg-gray-50 shrink-0">
                        <img 
                          src={property.imageUrl} 
                          alt={property.title} 
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-4 left-4 bg-brand-blue text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm capitalize">
                          {property.category === 'condominio' ? 'Condomínio' : property.category}
                        </span>
                        {property.tag && (
                          <span className="absolute top-4 right-4 bg-emerald-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                            {property.tag}
                          </span>
                        )}
                        {property.status && (
                          <span className="absolute bottom-4 left-4 bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                            {property.status}
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        <h3 className="text-lg font-bold text-brand-blue mb-1 leading-snug line-clamp-2 h-14">
                          {property.title}
                        </h3>
                        
                        <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                          <span className="truncate">{property.address}</span>
                        </p>

                        {/* Specs Area */}
                        <div className="grid grid-cols-3 gap-1 py-3 border-t border-b border-gray-100 mb-5 text-gray-600 text-center font-medium">
                          <div className="px-1">
                            <span className="block text-[9px] text-gray-400 uppercase font-extrabold tracking-wider truncate">
                              {property.category === 'terreno' ? 'Topologia' : 'Dormitórios'}
                            </span>
                            <span className="text-[11px] font-semibold text-gray-700 block truncate" title={property.specA}>
                              {property.specA}
                            </span>
                          </div>
                          <div className="border-l border-r border-gray-100 px-1">
                            <span className="block text-[9px] text-gray-400 uppercase font-extrabold tracking-wider truncate">
                              {property.category === 'terreno' ? 'Vista' : 'Banheiros'}
                            </span>
                            <span className="text-[11px] font-semibold text-gray-700 block truncate" title={property.specB}>
                              {property.specB}
                            </span>
                          </div>
                          <div className="px-1">
                            <span className="block text-[9px] text-gray-400 uppercase font-extrabold tracking-wider truncate">
                              {property.category === 'terreno' ? 'Tamanho' : 'Área Útil'}
                            </span>
                            <span className="text-[11px] font-semibold text-gray-700 block truncate" title={property.specC}>
                              {property.specC}
                            </span>
                          </div>
                        </div>

                        {/* Bottom Price & Call To Action */}
                        <div className="mt-auto">
                          <p className="text-gray-400 text-[11px] font-medium uppercase tracking-wider">Valor do Investimento</p>
                          <p className="text-xl font-extrabold text-brand-blue mb-4">{property.value}</p>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <button 
                              onClick={() => setSelectedProperty(property)}
                              className="py-2.5 px-2 border border-brand-blue/20 text-brand-blue hover:bg-brand-blue/5 text-xs font-bold rounded-lg transition-colors cursor-pointer text-center"
                            >
                              Detalhes
                            </button>
                            <button 
                              onClick={() => fillInterest(property.title)}
                              className="py-2.5 px-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer text-center"
                            >
                              Interesse
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100">
                    <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-brand-blue">Portfólio em Reformulação</h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                      Nenhum imóvel adicionado nesta categoria no momento. Acesse o Painel do Corretor no rodapé para adicionar novos empreendimentos agora!
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </section>
      )}

      {/* TRUST DIFFERENTIALS */}
      {siteSettings.showDifferentials && (
        <section id="diferenciais" className="py-24 bg-white fade-in-section visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-extrabold text-brand-orange tracking-widest uppercase block mb-3 font-mono">SEGURANÇA E TRANSPARÊNCIA</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue tracking-tight">Nossos Diferenciais de Confiança</h2>
              <div className="w-16 h-1 bg-brand-orange mx-auto mt-4 rounded"></div>
              <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">
                Garantimos uma jornada de compra e locação de luxo fluida, pautada por total transparência do início ao fim do processo de aquisição do seu patrimônio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              
              {/* Box 1 */}
              <div className="bg-brand-blue-soft p-8 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6">
                  <Calendar className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-brand-blue mb-3">Compromisso no Prazo</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Trabalhamos exclusivamente com as construtoras mais sólidas do mercado e garantimos rigores contratuais em todos os cronogramas estabelecidos de entrega de chaves.
                </p>
              </div>

              {/* Box 2 */}
              <div className="bg-brand-blue-soft p-8 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6">
                  <Smile className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-brand-blue mb-3">Atendimento Premium</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Nosso atendimento consultivo e pós-venda focado em satisfação total garante que as expectativas estruturais e de decoração de sua família sejam plenamente atendidas.
                </p>
              </div>

              {/* Box 3 */}
              <div className="bg-brand-blue-soft p-8 rounded-2xl border border-gray-100 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange mb-6">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-brand-blue mb-3">Assessoria Jurídica Ativa</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Contamos com uma experiente assessoria jurídica imobiliária para validar toda documentação, certidão e contratos, garantindo 100% de segurança legal em cada negócio.
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* LIGHTBOX DE AMBIENTES */}
      {siteSettings.showGallery && (
        <section id="galeria" className="py-24 bg-brand-blue-soft fade-in-section visible">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-extrabold text-brand-orange tracking-widest uppercase block mb-3 font-mono">ARQUITETURA REFINADA</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue tracking-tight">Galeria de Ambientes Elite</h2>
              <div className="w-16 h-1 bg-brand-orange mx-auto mt-4 rounded"></div>
              <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed">
                Explore a iluminação natural, o acabamento meticuloso com pedras nobres e o mobiliário refinado presentes em cada uma de nossas propriedades exclusivas.
              </p>
            </div>

            {/* Grid de Fotos de Luxo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 'g-1',
                  title: 'Amplo Living Integrado Clássico',
                  desc: 'Living em conceito aberto com lareira central de mármore e esquadrias de teto.',
                  img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
                },
                {
                  id: 'g-2',
                  title: 'Cozinha Gourmet Alta Tecnologia',
                  desc: 'Eletrodomésticos importados embutidos e ilha em iluminação interna em LED.',
                  img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
                },
                {
                  id: 'g-3',
                  title: 'Suíte Master Climatizada com Closet',
                  desc: 'Espaço requintado para o descanso com enxoval egípcio e sala de banho.',
                  img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
                },
                {
                  id: 'g-4',
                  title: 'Área Externa Lazer com Piscina',
                  desc: 'Varanda gourmet acoplada com solarium de Ipê e bordas de granito térmico.',
                  img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
                }
              ].map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => setLightboxImg({ url: photo.img, title: photo.title })}
                  className="group relative rounded-2xl overflow-hidden h-72 shadow-md cursor-pointer border border-gray-200"
                >
                  <img 
                    src={photo.img} 
                    alt={photo.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/90 via-brand-blue-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <span className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-2 inline-block">
                        Visualizar
                      </span>
                      <h4 className="text-white font-bold text-base">{photo.title}</h4>
                      <p className="text-xs text-gray-300">{photo.desc}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full text-white pointer-events-none group-hover:bg-brand-orange transition-colors">
                    <Search className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* TESTIMONIALS OF SATISFACTION */}
      {siteSettings.showTestimonials && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-sm font-extrabold text-brand-orange tracking-widest uppercase block mb-3 font-mono">CONQUISTAS REAIS</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-blue tracking-tight">O que dizem nossos Clientes Elite</h2>
              <div className="w-16 h-1 bg-brand-orange mx-auto mt-4 rounded"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  id: 't-1',
                  name: 'Dr. Carlos Eduardo Menezes',
                  title: 'Diretor de Tecnologia',
                  img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
                  quote: 'Comprar nossa mansão em Alphaville com a Imobiliária Elite foi uma experiência impecável. Eles entenderam perfeitamente nossas necessidades e a assessoria jurídica nos deu total tranquilidade.'
                },
                {
                  id: 't-2',
                  name: 'Beatriz Porto',
                  title: 'Investidora Imobiliária',
                  img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
                  quote: 'Fiquei encantada com a cobertura no Rio de Janeiro e o profissionalismo de toda a equipe. Desde a primeira visita com o corretor até a entrega final das chaves, o padrão de atendimento foi altíssimo.'
                },
                {
                  id: 't-3',
                  name: 'Ricardo Guimarães',
                  title: 'Arquiteto e Urbanista',
                  img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                  quote: 'O atendimento da Elite é diferenciado. Eles economizaram meu tempo ao fazer uma super filtragem de lotes condizentes ao meu projeto construtivo. Recomendo fortemente para negócios premium.'
                }
              ].map(test => (
                <div 
                  key={test.id}
                  className="bg-brand-blue-soft p-8 rounded-2xl border border-gray-100 relative shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-6xl text-brand-orange/20 absolute -top-2 left-6 pointer-events-none font-serif select-none">“</span>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 pt-4 relative z-10 italic">
                    "{test.quote}"
                  </p>
                  <div className="flex items-center gap-4 border-t border-gray-150 pt-5">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <img src={test.img} alt={test.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-blue leading-snug">{test.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{test.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* LEAD CONTACT FORM SECTION */}
      {siteSettings.showContactForm && (
        <section id="contato" className="py-24 bg-brand-blue text-white relative overflow-hidden">
          
          {/* Abstract vector gradients decoration */}
          <div className="absolute -top-36 -right-36 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-36 -left-36 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-36 -left-36 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Information Block */}
            <div className="space-y-8">
              <div>
                <span className="text-xs font-bold text-brand-orange tracking-widest uppercase block mb-3 font-mono">ATENDIMENTO EXCLUSIVO PERSONALIZADO</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">Pronto para dar o próximo passo na sua conquista?</h2>
                <div className="w-12 h-1 bg-brand-orange mt-4 rounded"></div>
              </div>
              
              <p className="text-gray-300 text-base leading-relaxed font-light">
                Indique seu imóvel de interesse e deixe seus dados de contato. Um de nossos corretores especialistas do time do Milton Barbosa entrará em contato com você em no máximo 15 minutos para agendar uma visita privativa e confidencial.
              </p>

              {/* Contact Detail Cards */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-white/10 rounded-xl text-brand-orange shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Telefone e WhatsApp Reservados</h4>
                    <p className="text-white font-semibold text-base mt-0.5">+55 (54) 99635-2992</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-white/10 rounded-xl text-brand-orange shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">E-mail Corporativo de Vendas</h4>
                    <p className="text-white font-semibold text-base mt-0.5">miltonbarbosacorretor@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3.5 bg-white/10 rounded-xl text-brand-orange shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs text-gray-400 font-extrabold uppercase tracking-wider">Bureau de Negócios Físico</h4>
                    <p className="text-white font-semibold text-base mt-0.5">Rua dos Cravos, 06 - São Lucas - RS</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Form wrapper */}
            <div 
              ref={contactFormSectionRef}
              className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl text-gray-800 transition-all duration-300"
            >
              <h3 className="text-2xl font-extrabold text-brand-blue mb-2">Solicitar Atendimento</h3>
              <p className="text-xs text-gray-400 mb-6 font-medium leading-relaxed">
                Suas informações serão transmitidas eletronicamente com criptografia de ponta de forma segura em nosso sistema.
              </p>

              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                    Seu Nome Completo *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={leadForm.name}
                    onChange={e => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite seu nome..." 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25 transition-all bg-brand-blue-soft text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                      E-mail Principal *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={leadForm.email}
                      onChange={e => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="seu@principal.com" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25 transition-all bg-brand-blue-soft text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                      WhatsApp / Telefone *
                    </label>
                    <input 
                      type="tel" 
                      required
                      value={leadForm.phone}
                      onChange={e => setLeadForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(54) 99999-9999" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25 transition-all bg-brand-blue-soft text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                    Empreendimento de Interesse
                  </label>
                  <select 
                    value={leadForm.interest}
                    onChange={e => setLeadForm(prev => ({ ...prev, interest: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25 transition-all bg-brand-blue-soft text-gray-900 cursor-pointer"
                  >
                    <option value="Dúvida Geral">Selecione ou clique em um imóvel...</option>
                    {properties.map(p => (
                      <option key={p.id} value={p.title}>{p.title} ({p.value})</option>
                    ))}
                    <option value="Outro Empreendimento">Outras Opções / Dúvida Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-1">
                    Mensagem (Opcional)
                  </label>
                  <textarea 
                    rows={3} 
                    value={leadForm.message}
                    onChange={e => setLeadForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Escreva detalhes adicionais ou o melhor horário de contato..." 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/25 transition-all bg-brand-blue-soft text-gray-900"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submitLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin mr-1" />
                      Transmitindo Dados...
                    </>
                  ) : (
                    <>
                      Enviar Informações de Contato Secure
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
      )}

      {/* FOOTER */}
      <footer className="bg-brand-blue-dark text-gray-400 py-16 border-t border-white/5 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Bureau info */}
            <div>
              <a href="#inicio" className="flex items-center gap-2 mb-4 group max-w-max">
                <div className="w-8 h-8 bg-brand-blue flex items-center justify-center rounded-lg shadow-md">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg font-black text-white tracking-tight uppercase leading-none mb-0">{siteSettings.siteName}</p>
              </a>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                {siteSettings.creci}<br />
                Excelência ética e consultoria estratégica de imóveis selecionados de alto padrão em todo o território nacional.
              </p>
            </div>

            {/* Nav links */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Navegação</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#inicio" className="hover:text-brand-orange transition-colors">Início</a></li>
                <li><a href="#imoveis" className="hover:text-brand-orange transition-colors">Imóveis Executivos</a></li>
                <li><a href="#diferenciais" className="hover:text-brand-orange transition-colors">Nossos Diferenciais</a></li>
                <li><a href="#galeria" className="hover:text-brand-orange transition-colors">Galeria Arquitetônica</a></li>
                <li><a href="#contato" className="hover:text-brand-orange transition-colors">Atendimento Exclusivo</a></li>
              </ul>
            </div>

            {/* Quick Filter actions */}
            <div>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Filtro Reservado</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => { setActiveFilter('condominio'); document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left w-full hover:text-brand-orange transition-colors">
                    Mansões em Condomínio
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveFilter('apartamento'); document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left w-full hover:text-brand-orange transition-colors">
                    Apartamentos & Coberturas
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveFilter('casa'); document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left w-full hover:text-brand-orange transition-colors">
                    Casas Inteligentes
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveFilter('terreno'); document.getElementById('imoveis')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-left w-full hover:text-brand-orange transition-colors">
                    Lotes & Glebas Nobres
                  </button>
                </li>
              </ul>
            </div>

            {/* Badges SSL check */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Acesso Seguro</h4>
              <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg max-w-max">
                <span className="block text-[9px] font-extrabold uppercase text-gray-400">Atendimento Digital Seguro</span>
                <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Conexão HTTPS Ativa
                </span>
              </div>
            </div>

          </div>

          {/* Bottom segment */}
          <div className="border-t border-white/5 pt-8 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p>© 2026 Imobiliária Elite. Todos os direitos reservados. Projeto Modelo de Portfólio.</p>
            
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <a href="#" className="hover:underline">Políticas de Privacidade</a>
              <span>•</span>
              <a href="#" className="hover:underline">Termos de Uso</a>
              <span>•</span>
              
              {/* Trigger Broker Panel Login / Dashboard directly */}
              <button 
                onClick={() => {
                  if (isBrokerLoggedIn) {
                    setIsDashboardOpen(true);
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
                className="hover:text-brand-orange text-gray-200 font-bold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer bg-brand-blue/30 px-3.5 py-1.5 rounded-full border border-white/10"
              >
                <Shield className="w-4 h-4 text-brand-orange shrink-0" />
                <span>Painel do Corretor (Admin)</span>
                {unseenLeadsCount > 0 && (
                  <span className="bg-brand-orange text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full leading-none animate-bounce">
                    {unseenLeadsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* POPUP DETAIL MODAL */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 bg-brand-blue-dark/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* INTERACTIVE COMPREHENSIVE CAROUSEL SLIDESHOW */}
              {(() => {
                const galleryList = selectedProperty.images && selectedProperty.images.length > 0
                  ? selectedProperty.images
                  : [selectedProperty.imageUrl];
                const activeIndex = activePropertyImgIndex < galleryList.length ? activePropertyImgIndex : 0;
                const activeImage = galleryList[activeIndex] || selectedProperty.imageUrl;

                return (
                  <div className="relative group w-full bg-black/10">
                    {/* Main Active Slide Display */}
                    <div className="relative w-full h-[320px] sm:h-[400px] overflow-hidden bg-black/5 flex items-center justify-center">
                      <img 
                        src={activeImage} 
                        alt={`${selectedProperty.title} - Imagem ${activeIndex + 1}`} 
                        className="w-full h-full object-cover transition-all duration-300"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80';
                        }}
                      />

                      {/* Pill Image Indicator Counter */}
                      <span className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-sm text-white text-[11px] font-bold font-mono px-3 py-1 rounded-full shadow-md z-10">
                        {activeIndex + 1} / {galleryList.length}
                      </span>
                      
                      {/* Navigation Overlays */}
                      {galleryList.length > 1 && (
                        <>
                          <button 
                            type="button"
                            onClick={() => setActivePropertyImgIndex(prev => (prev === 0 ? galleryList.length - 1 : prev - 1))}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-brand-blue rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer z-10"
                            title="Imagem Anterior"
                          >
                            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                          </button>
                          <button 
                            type="button"
                            onClick={() => setActivePropertyImgIndex(prev => (prev === galleryList.length - 1 ? 0 : prev + 1))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-brand-blue rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer z-10"
                            title="Próxima Imagem"
                          >
                            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Horizontal Scrollable Thumbnails Strip Selector */}
                    {galleryList.length > 1 && (
                      <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50 border-b border-gray-100 scrollbar-thin scrollbar-thumb-brand-blue/30 max-h-24">
                        {galleryList.map((thumbUrl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActivePropertyImgIndex(idx)}
                            className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                              activeIndex === idx 
                                ? 'border-brand-orange scale-95 ring-2 ring-brand-orange/30 shadow-md' 
                                : 'border-transparent opacity-75 hover:opacity-100 hover:border-gray-300'
                            }`}
                          >
                            <img src={thumbUrl} alt="" className="w-full h-full object-cover animate-fade-in" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="p-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-brand-blue-soft text-brand-blue text-xs font-bold uppercase px-3 py-1 rounded-full">
                    {selectedProperty.category === 'condominio' ? 'Condomínio de Alto Luxo' : selectedProperty.category}
                  </span>
                  {selectedProperty.tag && (
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold uppercase px-3 py-1 rounded-full">
                      {selectedProperty.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-bold text-brand-blue mb-2">{selectedProperty.title}</h3>
                <p className="text-2xl font-extrabold text-brand-orange mb-4">{selectedProperty.value}</p>

                <p className="text-xs text-gray-500 mb-6 flex items-center gap-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                  <span>Endereço: {selectedProperty.address}</span>
                </p>

                <div className="grid grid-cols-3 gap-2 bg-brand-blue-soft p-4 rounded-xl text-center text-xs text-gray-600 font-semibold mb-6">
                  <div>
                    <span className="block text-gray-400 text-[10px] font-extrabold uppercase mb-1">
                      {selectedProperty.category === 'terreno' ? 'Topologia' : 'Dormitórios'}
                    </span>
                    <span className="text-gray-800 text-[13px]">{selectedProperty.specA}</span>
                  </div>
                  <div className="border-l border-r border-gray-200">
                    <span className="block text-gray-400 text-[10px] font-extrabold uppercase mb-1">
                      {selectedProperty.category === 'terreno' ? 'Vista' : 'Banheiros'}
                    </span>
                    <span className="text-gray-800 text-[13px]">{selectedProperty.specB}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 text-[10px] font-extrabold uppercase mb-1">
                      {selectedProperty.category === 'terreno' ? 'Tamanho' : 'Área Útil'}
                    </span>
                    <span className="text-gray-800 text-[13px]">{selectedProperty.specC}</span>
                  </div>
                </div>

                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Descrição Completa</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 bg-brand-blue-soft/20 p-4 rounded-xl border border-dashed border-gray-200">
                  {selectedProperty.description}
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setSelectedProperty(null);
                      fillInterest(selectedProperty.title);
                    }}
                    className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 rounded-xl font-bold transition-colors shadow-sm cursor-pointer text-center"
                  >
                    Demonstrar Interesse Prévio
                  </button>
                  <a 
                    href={`https://wa.me/5554996352992?text=Olá%20Milton,%20gostaria%20de%20saber%20mais%20detalhes%20sobre%20${encodeURIComponent(selectedProperty.title)}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Phone className="w-5 h-5 fill-white" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LIGHTBOX FOR AMBIENTES ARCHITECTURE */}
      <AnimatePresence>
        {lightboxImg && (
          <div className="fixed inset-0 z-50 bg-brand-blue-dark/95 flex flex-col items-center justify-center p-4">
            <button 
              onClick={() => setLightboxImg(null)}
              className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl w-full flex flex-col items-center gap-4">
              <motion.img 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                src={lightboxImg.url} 
                alt={lightboxImg.title} 
                className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl" 
                referrerPolicy="no-referrer"
              />
              <p className="text-white font-bold text-lg text-center tracking-wide">{lightboxImg.title}</p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* LEAD SUBMISSION TOAST */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-white border-l-4 border-emerald-500 rounded-xl shadow-2xl p-4 flex items-center gap-3 max-w-md"
          >
            <div className="p-2 bg-emerald-500/10 rounded-full text-emerald-500 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-brand-blue">Mensagem Enviada!</h4>
              <p className="text-xs text-gray-500 mt-0.5">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-gray-600 ml-auto cursor-pointer p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BROKER LOGIN MODAL */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-50 bg-brand-blue-dark/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl p-8 relative"
            >
              <button 
                onClick={() => { setIsLoginModalOpen(false); setLoginError(false); }}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue flex items-center justify-center rounded-full mx-auto mb-3">
                  <Shield className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold text-brand-blue">Acesso do Corretor</h3>
                <p className="text-xs text-gray-400 mt-1">Para segurança, insira a senha de corretor homologada.</p>
              </div>

              <form onSubmit={handleBrokerLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">
                    Senha Secreta de Acesso
                  </label>
                  <input 
                    type="password"
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="Digite a senha..."
                    required 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/25 focus:border-brand-orange transition-all text-center font-bold tracking-widest bg-brand-blue-soft"
                  />
                  <p className="text-[10px] text-gray-400 text-center mt-2 font-semibold">
                    Dica: Use a senha padrão <code className="bg-brand-blue-soft px-1.5 py-0.5 rounded text-brand-orange">elite2026</code>
                  </p>
                </div>

                {loginError && (
                  <div className="text-red-500 text-xs font-bold text-center">
                    Senha inválida. Entre com a senha corporativa correta!
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  Entrar no Painel do Corretor
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLY FUNCTIONAL DYNAMIC BROKER DASHBOARD MODAL */}
      <AnimatePresence>
        {isDashboardOpen && (
          <div className="fixed inset-0 z-50 bg-brand-blue-dark/90 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-8">
            <motion.div 
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-6xl h-[95vh] sm:h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* TOP HEADER */}
              <div className="px-6 py-4 bg-brand-blue text-white flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange select-none">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold tracking-tight">Painel do Corretor - Imobiliária Elite</h2>
                    <p className="text-[11px] text-brand-orange font-bold uppercase tracking-widest">Painel Administrativo Hub</p>
                  </div>
                </div>

                {/* Dashboard Tabs Selector */}
                <div className="flex items-center gap-2 self-center sm:self-auto">
                  <button 
                    onClick={() => setDashboardTab('leads')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      dashboardTab === 'leads'
                        ? 'bg-brand-orange text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    Solicitações ({leads.length})
                  </button>
                  <button 
                    onClick={() => setDashboardTab('properties')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      dashboardTab === 'properties'
                        ? 'bg-brand-orange text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Gerenciar Imóveis ({properties.length})
                  </button>
                  <button 
                    onClick={() => setDashboardTab('visual')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                      dashboardTab === 'visual'
                        ? 'bg-brand-orange text-white'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    Editor Visual
                  </button>
                </div>

                {/* Header Action Controls */}
                <div className="flex items-center gap-2 justify-end sm:justify-start">
                  <button 
                    onClick={handleLogout}
                    className="px-3.5 py-2 bg-red-600 hover:bg-red-700 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sair
                  </button>
                  <button 
                    onClick={() => setIsDashboardOpen(false)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DYNAMIC DASHBOARD CONTAINER BODY */}
              <div className="flex-1 bg-gray-50 overflow-hidden flex flex-col md:flex-row">
                
                {/* INTERACTIVE LEADS MANAGEMENT VIEW */}
                {dashboardTab === 'leads' && (
                  <>
                    {/* Left sidebar metric stats & filter leads */}
                    <div className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-r border-gray-100 p-5 flex flex-col gap-6 shrink-0 overflow-y-auto">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-3 font-mono">Status Físico</h3>
                        <div className="grid grid-cols-3 md:grid-cols-1 gap-2.5">
                          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex flex-col">
                            <span className="text-[9px] text-blue-600 font-bold uppercase tracking-wider font-mono">Totais</span>
                            <span className="text-xl font-black text-brand-blue mt-0.5">{leads.length}</span>
                          </div>
                          <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex flex-col">
                            <span className="text-[9px] text-orange-600 font-bold uppercase tracking-wider font-mono">Novos</span>
                            <span className="text-xl font-black text-brand-orange mt-0.5 animate-pulse">{leads.filter(l => l.status === 'Novo').length}</span>
                          </div>
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col">
                            <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider font-mono">Finalizados</span>
                            <span className="text-xl font-black text-emerald-600 mt-0.5">{leads.filter(l => l.status === 'Finalizado').length}</span>
                          </div>
                        </div>
                      </div>

                      {/* Filters leads by status */}
                      <div>
                        <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider mb-2 font-mono">Filtrar Atendimentos</h3>
                        <div className="flex flex-col gap-1">
                          {[
                            { id: 'todos', label: 'Todos os Leads' },
                            { id: 'Novo', label: 'Não Atendidos (Novos)' },
                            { id: 'Em Atendimento', label: 'Em Atendimento' },
                            { id: 'Finalizado', label: 'Finalizados (Concluídos)' }
                          ].map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setDashboardStatusFilter(opt.id)}
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                dashboardStatusFilter === opt.id
                                  ? 'bg-brand-blue text-white shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-brand-blue-soft border border-gray-100 rounded-xl p-4 mt-auto hidden md:block">
                        <span className="flex items-center gap-1.5 text-xs font-extrabold text-brand-blue mb-1 font-mono">
                          <Info className="w-4 h-4 text-brand-orange" />
                          CONTROLE TOTAL
                        </span>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                          Fale com o cliente em 1 clique avançando o status para acompanhar o pós-venda.
                        </p>
                      </div>
                    </div>

                    {/* Central Area: Grid leads list */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                      
                      {/* Search lead bar */}
                      <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between gap-4 shrink-0">
                        <div className="relative flex-1 max-w-md">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Search className="w-4 h-4" />
                          </span>
                          <input 
                            type="text" 
                            value={dashboardSearch}
                            onChange={e => setDashboardSearch(e.target.value)}
                            placeholder="Pesquise por nome, e-mail, interesse ou observações..." 
                            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-orange border border-gray-200 bg-gray-50"
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                          Mostrando {brokerFilteredLeads.length} leads
                        </span>
                      </div>

                      {/* Leads list scrolls */}
                      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
                        {brokerFilteredLeads.length > 0 ? (
                          <div className="space-y-3">
                            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 font-bold text-[10px] text-brand-blue uppercase tracking-widest bg-brand-blue-soft/50 rounded-xl">
                              <span className="col-span-3">Cliente / Contato</span>
                              <span className="col-span-2 text-center">Data Recebido</span>
                              <span className="col-span-3">Interesse / Mensagem</span>
                              <span className="col-span-2 text-center">Status Atendimento</span>
                              <span className="col-span-2 text-right">Ação Rápida</span>
                            </div>

                            {brokerFilteredLeads.map(lead => {
                              // Format whatsapp URL trigger link
                              const formattedPhone = lead.phone.replace(/[^0-9]/g, '');
                              const waMessage = `Olá ${lead.name}, aqui é da Imobiliária Elite. Recebemos seu contato sobre o imóvel "${lead.interest}". Como podemos lhe ajudar hoje?`;
                              const waUrl = `https://wa.me/${formattedPhone.length === 11 || formattedPhone.length === 10 ? '55' + formattedPhone : formattedPhone}?text=${encodeURIComponent(waMessage)}`;

                              return (
                                <div 
                                  key={lead.id} 
                                  className="bg-white border border-gray-100 rounded-xl p-4 lg:grid lg:grid-cols-12 lg:gap-4 items-center shadow-sm hover:shadow-md transition-shadow"
                                >
                                  {/* Info */}
                                  <div className="col-span-3 pb-2.5 lg:pb-0 mb-2.5 lg:mb-0 border-b lg:border-b-0 border-gray-100 flex flex-col">
                                    <span className="text-xs font-bold text-brand-blue">{lead.name}</span>
                                    <span className="text-[10px] text-gray-500 font-medium truncate mt-0.5">{lead.email}</span>
                                    <span className="text-[11px] font-bold text-gray-600 mt-1">{lead.phone}</span>
                                  </div>

                                  {/* Date */}
                                  <div className="col-span-2 text-center pb-2 lg:pb-0 mb-2 lg:mb-0 border-b lg:border-b-0 border-gray-100">
                                    <span className="text-[10px] text-gray-400 font-mono font-semibold">
                                      {formatDateFriendly(lead.createdAt)}
                                    </span>
                                  </div>

                                  {/* Interest message */}
                                  <div className="col-span-3 pb-2.5 lg:pb-0 mb-2.5 lg:mb-0 border-b lg:border-b-0 border-gray-100 flex flex-col">
                                    <span className="text-xs font-bold text-brand-blue bg-brand-blue-soft px-2 py-1 rounded inline-block max-w-max">
                                      🏠 {lead.interest}
                                    </span>
                                    {lead.message && (
                                      <p className="text-[10px] text-gray-500 mt-1.5 italic bg-yellow-50 border border-yellow-100 p-2 rounded leading-relaxed line-clamp-2 hover:line-clamp-none transition-all cursor-help">
                                        "{lead.message}"
                                      </p>
                                    )}
                                  </div>

                                  {/* Status badge and modification */}
                                  <div className="col-span-2 text-center pb-2 lg:pb-0 mb-2 lg:mb-0 border-b lg:border-b-0 border-gray-100 flex justify-between lg:justify-center items-center">
                                    <span className="lg:hidden text-[10px] font-bold text-gray-400 uppercase">Status:</span>
                                    <div className="flex items-center gap-1.5">
                                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                        lead.status === 'Novo' 
                                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                          : lead.status === 'Em Atendimento'
                                            ? 'bg-orange-50 text-orange-600 border border-orange-100 animate-pulse'
                                            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                      }`}>
                                        {lead.status}
                                      </span>
                                      
                                      {/* Cycle Status button */}
                                      <button 
                                        onClick={() => cycleLeadStatus(lead.id, lead.status)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-brand-orange transition-colors cursor-pointer"
                                        title="Avançar status"
                                      >
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="col-span-2 flex justify-end gap-1.5 pt-2 lg:pt-0 shrink-0">
                                    <a 
                                      href={`tel:${lead.phone}`}
                                      className="p-2 bg-brand-blue-soft hover:bg-brand-blue hover:text-white rounded-lg text-brand-blue transition-colors cursor-pointer"
                                      title="Ligar telefone"
                                    >
                                      <Phone className="w-3.5 h-3.5" />
                                    </a>
                                    <a 
                                      href={waUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white rounded-lg text-emerald-500 transition-colors cursor-pointer"
                                      title="Responder no WhatsApp"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                        <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.371a9.918 9.918 0 0 0 4.777 1.22c5.505 0 9.988-4.478 9.989-9.984.001-5.506-4.482-9.985-9.987-9.985zm5.799 14.167c-.244.686-1.42 1.258-1.95 1.314-.482.051-.97.078-2.61-.58a11.97 11.97 0 0 1-5.111-4.49c-.615-.817-1.034-1.764-1.034-2.766 0-2.029 1.543-2.616 1.83-2.73.208-.083.414-.131.62-.131.206 0 .411.004.593.04.195.039.435-.078.679.51.25.603.856 2.083.931 2.232.075.15.124.324.025.523-.099.199-.149.324-.298.497l-.46.536c-.15.174-.306.363-.122.68.183.314.811 1.341 1.737 2.164.793.705 1.459.923 1.782 1.057.244.1.388.083.535-.083.149-.166.643-.75.816-1.002.173-.252.348-.21.583-.122.235.088 1.488.702 1.745.83.257.127.428.19.49.298.062.108.062.622-.182 1.308z"/>
                                      </svg>
                                    </a>
                                    <a 
                                      href={`mailto:${lead.email}`}
                                      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors cursor-pointer"
                                      title="Enviar E-mail"
                                    >
                                      <Mail className="w-3.5 h-3.5" />
                                    </a>
                                    <span className="w-px bg-gray-150 self-stretch my-1 text-transparent select-none shrink-0 border-r border-gray-200"></span>
                                    <button 
                                      onClick={() => handleDeleteLead(lead.id)}
                                      className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                      title="Apagar lead"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <Smile className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h4 className="text-base font-bold text-brand-blue">Tudo em dia por aqui!</h4>
                            <p className="text-xs text-gray-500 mt-1">Nenhum atendimento corresponde aos filtros aplicados.</p>
                          </div>
                        )}
                      </div>

                    </div>
                  </>
                )}

                {/* THE AMAZING BRAND-NEW PROPERTIES CREATION & EDITING SECTION */}
                {dashboardTab === 'properties' && (
                  <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                    
                    {/* LEFT CONTAINER: ADD / EDIT PROPERTY FORM */}
                    <div 
                      ref={propertyFormRef}
                      className="w-full md:w-[450px] bg-white p-6 border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto shrink-0 flex flex-col gap-4 text-gray-800"
                    >
                      <div>
                        <div className="flex justify-between items-center bg-brand-blue-soft p-3 rounded-lg border border-brand-blue/10">
                          <span className="text-xs font-bold text-brand-blue uppercase font-mono flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" />
                            {editingPropertyId ? 'Editar Imóvel Ativo' : 'Novo Imóvel'}
                          </span>
                          {editingPropertyId && (
                            <button 
                              onClick={handleCancelEdit}
                              className="text-gray-400 hover:text-red-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1 font-medium italic">
                          O empreendimento aparecerá de forma automatizada no catálogo na página inicial.
                        </p>
                      </div>

                      <form onSubmit={handlePropertyFormSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
                            Título do Imóvel ou Lote *
                          </label>
                          <input 
                            type="text"
                            required
                            placeholder="Ex: Mansão de Campo Alphaville"
                            value={propertyForm.title}
                            onChange={e => setPropertyForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-gray-50"
                          />
                        </div>

                        {/* Category & Tag */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
                              Categoria *
                            </label>
                            <select
                              value={propertyForm.category}
                              onChange={e => setPropertyForm(prev => ({ 
                                ...prev, 
                                category: e.target.value as any,
                                // Automatically preset matching dynamic tags when changing category
                                specA: e.target.value === 'terreno' ? 'Plano' : '3 Quartos',
                                specB: e.target.value === 'terreno' ? 'Golf Club' : '2 Banhos',
                                specC: e.target.value === 'terreno' ? '600m²' : '150m²'
                              }))}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-gray-50 cursor-pointer"
                            >
                              <option value="casa">Casa</option>
                              <option value="condominio">Condomínio</option>
                              <option value="apartamento">Apartamento</option>
                              <option value="terreno">Terreno</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
                              Selo / Tag Destaque
                            </label>
                            <input 
                              type="text"
                              placeholder="Ex: Destaque, Vista Mar, Oferta"
                              value={propertyForm.tag}
                              onChange={e => setPropertyForm(prev => ({ ...prev, tag: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-gray-50"
                            />
                          </div>
                        </div>

                        {/* Price & Address */}
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
                              Valor *
                            </label>
                            <input 
                              type="text"
                              required
                              placeholder="Ex: R$ 1.250.000"
                              value={propertyForm.value}
                              onChange={e => setPropertyForm(prev => ({ ...prev, value: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
                              Cidade / UF Estado *
                            </label>
                            <input 
                              type="text"
                              required
                              placeholder="Ex: Barueri, São Paulo"
                              value={propertyForm.address}
                              onChange={e => setPropertyForm(prev => ({ ...prev, address: e.target.value }))}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-gray-50"
                            />
                          </div>
                        </div>

                        {/* Property Specs (Dormitorios, Banheiros, Area etc) */}
                        <div className="bg-brand-blue-soft/50 p-3.5 rounded-xl border border-gray-100 space-y-3">
                          <span className="text-[10px] font-bold uppercase text-brand-blue block font-mono h-3">
                            Características Estruturais
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-tight truncate mb-1">
                                {propertyForm.category === 'terreno' ? 'Topologia' : 'Dormitórios'}
                              </label>
                              <input 
                                type="text"
                                placeholder={propertyForm.category === 'terreno' ? 'Plano, Aclive' : '3 Quartos'}
                                value={propertyForm.specA}
                                onChange={e => setPropertyForm(prev => ({ ...prev, specA: e.target.value }))}
                                className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-tight truncate mb-1">
                                {propertyForm.category === 'terreno' ? 'Vista' : 'Banheiros'}
                              </label>
                              <input 
                                type="text"
                                placeholder={propertyForm.category === 'terreno' ? 'Golf, Atlântico' : '2 Banhos'}
                                value={propertyForm.specB}
                                onChange={e => setPropertyForm(prev => ({ ...prev, specB: e.target.value }))}
                                className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-tight truncate mb-1">
                                {propertyForm.category === 'terreno' ? 'Tamanho' : 'Área Útil'}
                              </label>
                              <input 
                                type="text"
                                placeholder={propertyForm.category === 'terreno' ? '1.200m²' : '150m²'}
                                value={propertyForm.specC}
                                onChange={e => setPropertyForm(prev => ({ ...prev, specC: e.target.value }))}
                                className="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* IMAGE SOURCE INTEGRATION (EASY CONTROLS) */}
                        <div className="bg-brand-blue-soft/50 p-3 rounded-xl border border-gray-100 text-gray-800">
                          <span className="text-[10px] font-bold uppercase text-brand-blue block font-mono">
                            Imagem do Empreendimento
                          </span>
                          
                          {/* Image Tabs selector */}
                          <div className="flex border-b border-gray-200 mb-3 mt-2 text-center text-xs">
                            <button
                              type="button"
                              onClick={() => setImageTab('presets')}
                              className={`flex-1 pb-1.5 font-bold cursor-pointer border-b-2 hover:text-brand-orange transition-all ${
                                imageTab === 'presets' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500'
                              }`}
                            >
                              Modelos
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageTab('url')}
                              className={`flex-1 pb-1.5 font-bold cursor-pointer border-b-2 hover:text-brand-orange transition-all ${
                                imageTab === 'url' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500'
                              }`}
                            >
                              URL Web
                            </button>
                            <button
                              type="button"
                              onClick={() => setImageTab('upload')}
                              className={`flex-1 pb-1.5 font-bold cursor-pointer border-b-2 hover:text-brand-orange transition-all ${
                                imageTab === 'upload' ? 'border-brand-orange text-brand-orange' : 'border-transparent text-gray-500'
                              }`}
                            >
                              Upload Local
                            </button>
                          </div>

                          {/* Image choices content */}
                          {imageTab === 'presets' && (
                            <div className="space-y-2">
                              <label className="text-[9px] text-gray-500 block font-semibold leading-relaxed">
                                Clique para selecionar instantaneamente uma foto de portfólio elegante:
                              </label>
                              <div className="grid grid-cols-4 gap-2 overflow-y-auto max-h-36 p-1">
                                {PRESET_HOUSE_IMAGES.map((preset, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    onClick={() => setPropertyForm(prev => ({ ...prev, imageUrl: preset.url }))}
                                    className={`relative rounded-lg overflow-hidden h-10 border transition-all cursor-pointer ${
                                      propertyForm.imageUrl === preset.url 
                                        ? 'border-brand-orange ring-2 ring-brand-orange/30 scale-95' 
                                        : 'border-gray-200'
                                    }`}
                                    title={preset.name}
                                  >
                                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {imageTab === 'url' && (
                            <div>
                              <label className="text-[10px] text-gray-500 block font-bold mb-1.5">
                                Link Absolute da Imagem
                              </label>
                              <input 
                                type="url"
                                placeholder="Cole o link https://images.unsplash.com/... da sua foto"
                                value={propertyForm.imageUrl.startsWith('data:image') ? '' : propertyForm.imageUrl}
                                onChange={e => setPropertyForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange bg-white text-gray-900"
                              />
                            </div>
                          )}

                          {imageTab === 'upload' && (
                            <div className="space-y-2">
                              <label className="text-[10px] text-gray-500 block font-bold">
                                Carregar Arquivo de Foto do Computador
                              </label>
                              <div className="flex items-center justify-center w-full">
                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                  <div className="flex flex-col items-center justify-center pt-3 pb-3">
                                    <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                    <p className="text-[10px] text-gray-500 font-bold hover:underline">
                                      {uploadedBase64 ? 'Foto Carregada!' : 'Selecionar Imagem'}
                                    </p>
                                    <p className="text-[8px] text-gray-400 mt-0.5">PNG, JPG, BMP</p>
                                  </div>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden" 
                                    onChange={handleImageUploadChange}
                                  />
                                </label>
                              </div>
                              {uploadedBase64 && (
                                <div className="flex items-center gap-2 bg-white text-gray-800 p-2 border border-emerald-200 rounded-lg">
                                  <img src={uploadedBase64} alt="Pre-Visualizacao" className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0" />
                                  <span className="text-[9px] text-emerald-600 font-extrabold truncate">Imagem Convertida com Sucesso</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Quick Preview Area */}
                          <div className="mt-3 bg-white border border-gray-200 p-2 rounded-lg flex items-center gap-3">
                            <span className="text-[9px] font-bold text-gray-500 uppercase shrink-0">Preview:</span>
                            <div className="w-12 h-10 rounded overflow-hidden border border-gray-100 shrink-0">
                              <img 
                                src={propertyForm.imageUrl || 'https://placehold.co/100'} 
                                alt="Pre-visualização" 
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                            </div>
                            <span className="text-[9px] text-gray-400 line-clamp-2 select-none h-6">
                              {propertyForm.imageUrl ? propertyForm.imageUrl.slice(0, 80) + '...' : 'Sem imagem selecionada'}
                            </span>
                          </div>
                        </div>

                        {/* DETAILED EXPANDED GALLERY SECTION */}
                        <div className="bg-brand-blue-soft/50 p-4 rounded-xl border border-gray-150">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold uppercase text-brand-blue block font-mono">
                              Galeria de Fotos (Até 40)
                            </span>
                            <span className="bg-brand-blue text-white text-[9px] font-black px-2 py-0.5 rounded-full font-mono">
                              {propertyForm.images?.length || 0} / 40
                            </span>
                          </div>

                          <p className="text-[9px] text-gray-400 mb-3 leading-relaxed">
                            A galeria expandida suporta múltiplos uploads simultâneos de fotos de alta qualidade, reordenação arrastando, exclusão e definição rápida da Imagem de Capa.
                          </p>

                          {/* Multiple Upload Area with Drag-and-Drop */}
                          <div 
                            className="border-2 border-dashed border-gray-300 hover:border-brand-orange bg-white rounded-xl p-4 text-center cursor-pointer transition-all mb-4"
                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-brand-orange', 'bg-brand-orange-soft/10'); }}
                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-brand-orange', 'bg-brand-orange-soft/10'); }}
                            onDrop={async (e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove('border-brand-orange', 'bg-brand-orange-soft/10');
                              const files = e.dataTransfer.files;
                              if (files && files.length > 0) {
                                const inputEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
                                await handleMultipleImagesUpload(inputEvent);
                              }
                            }}
                          >
                            <label className="cursor-pointer block">
                              <Upload className="w-6 h-6 text-brand-orange mx-auto mb-1 animate-bounce" />
                              <span className="block text-xs font-bold text-gray-700">Arrastar & soltar múltiplas fotos</span>
                              <span className="block text-[9px] text-gray-400 mt-1 font-semibold underline hover:text-brand-orange">ou clicar para selecionar arquivos</span>
                              <input 
                                type="file" 
                                multiple 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleMultipleImagesUpload} 
                              />
                            </label>
                          </div>

                          {/* Add Single Image URL manually input option */}
                          <div className="flex gap-2 mb-4 bg-white p-2 border border-blue-100 rounded-xl">
                            <input 
                              type="url" 
                              placeholder="Adicionar foto via URL externa..." 
                              value={externalImageUrlInput}
                              onChange={e => setExternalImageUrlInput(e.target.value)}
                              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2 text-[10px] focus:outline-none"
                            />
                            <button 
                              type="button"
                              onClick={handleAddExternalImageUrl}
                              className="px-3 py-1 bg-brand-blue hover:bg-brand-blue-light text-white text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Adicionar
                            </button>
                          </div>

                          {/* Thumbnail List Grid inside Form */}
                          {propertyForm.images && propertyForm.images.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                              {propertyForm.images.map((imgUrl, srcIndex) => {
                                const isCover = propertyForm.imageUrl === imgUrl;
                                return (
                                  <div 
                                    key={srcIndex}
                                    draggable
                                    onDragStart={() => setDraggedIndex(srcIndex)}
                                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('scale-105', 'opacity-70'); }}
                                    onDragLeave={(e) => { e.currentTarget.classList.remove('scale-105', 'opacity-70'); }}
                                    onDrop={() => {
                                      if (draggedIndex !== null && draggedIndex !== srcIndex) {
                                        handleImageReorder(draggedIndex, srcIndex);
                                      }
                                      setDraggedIndex(null);
                                    }}
                                    className={`group relative rounded-lg border overflow-hidden aspect-video transition-all shadow-sm cursor-move bg-gray-100 ${
                                      isCover ? 'border-brand-orange ring-2 ring-brand-orange/30' : 'border-gray-200'
                                    }`}
                                    title="Arraste para reordenar"
                                  >
                                    <img src={imgUrl} alt={`Foto ${srcIndex + 1}`} className="w-full h-full object-cover pointer-events-none" />
                                    
                                    {/* Cover Star indicator / button */}
                                    <button
                                      type="button"
                                      onClick={() => setAsCoverImage(imgUrl)}
                                      className={`absolute top-0.5 left-0.5 p-1 rounded-md text-[10px] font-extrabold text-white transition-opacity ${
                                        isCover ? 'bg-brand-orange opacity-100' : 'bg-gray-800/60 opacity-0 group-hover:opacity-100'
                                      }`}
                                      title={isCover ? 'Capa Principal Ativa' : 'Definir como Imagem de Capa'}
                                    >
                                      ★
                                    </button>

                                    {/* Action individual image delete */}
                                    <button
                                      type="button"
                                      onClick={() => deleteImageFromGallery(srcIndex)}
                                      className="absolute top-0.5 right-0.5 p-1 bg-red-600 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      title="Remover esta foto da galeria"
                                    >
                                      <Trash2 className="w-2.5 h-2.5" />
                                    </button>

                                    {/* Reordering helper arrows for mobile accessibility */}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-0.5 px-1 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity text-[8px] text-white font-bold select-none pointer-events-auto">
                                      <button 
                                        type="button" 
                                        onClick={() => moveImageElement(srcIndex, 'left')} 
                                        disabled={srcIndex === 0}
                                        className="hover:text-brand-orange disabled:opacity-30"
                                      >
                                        ◀
                                      </button>
                                      <span className="text-[7px]">nº {srcIndex + 1}</span>
                                      <button 
                                        type="button" 
                                        onClick={() => moveImageElement(srcIndex, 'right')} 
                                        disabled={srcIndex === propertyForm.images.length - 1}
                                        className="hover:text-brand-orange disabled:opacity-30"
                                      >
                                        ▶
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center p-6 bg-white border border-gray-150 rounded-xl text-gray-400 text-[10px] uppercase font-bold italic">
                              Nenhuma imagem na galeria. Carregue fotos acima!
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1">
                            Descrição Detalhada do Empreendimento
                          </label>
                          <textarea 
                            rows={3}
                            placeholder="Descreva a arquitetura, acabamentos, localização premium..."
                            value={propertyForm.description}
                            onChange={e => setPropertyForm(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange text-gray-900 bg-gray-50"
                          />
                        </div>

                        {/* Action Submit */}
                        <div className="pt-2">
                          <button 
                            type="submit"
                            className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {editingPropertyId ? (
                              <>
                                <Edit className="w-4 h-4" />
                                Salvar Alterações no Portfólio
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Publicar Imóvel no Catalog
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* RIGHT CONTAINER: ACTIVE PROPERTIES GRID LIST FOR MANAGEMENT */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-gray-800">
                      <div>
                        <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider font-mono h-4">
                          Imóveis Atualmente Publicados no Catálogo ({properties.length})
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 font-medium">
                          Lista em tempo real. Você pode editar os parâmetros ou excluir qualquer empreendimento.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map(item => (
                          <div 
                            key={item.id}
                            className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col shadow-sm hover:shadow-md transition-shadow relative"
                          >
                            <div className="flex items-center gap-3 mb-3 border-b border-gray-50 pb-2">
                              <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded object-cover border border-gray-100 shrink-0" />
                              <div className="truncate min-w-0">
                                <h4 className="text-xs font-bold text-brand-blue truncate" title={item.title}>
                                  {item.title}
                                </h4>
                                <span className="inline-block text-[9px] text-gray-400 font-bold uppercase tracking-wider capitalize">
                                  📂 {item.category}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm font-extrabold text-brand-orange font-mono mb-2">
                              {item.value}
                            </p>

                            <p className="text-[10px] text-gray-500 mb-4 h-12 line-clamp-3">
                              {item.description}
                            </p>

                            <div className="grid grid-cols-2 gap-2 mt-auto border-t border-gray-50 pt-2.5">
                              <button
                                onClick={() => startEditingProperty(item)}
                                className="py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-blue-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(item.id)}
                                className="py-2 bg-red-50 hover:bg-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Excluir
                              </button>
                            </div>
                            
                            {/* Visual highlight if is currently in edit mode */}
                            {editingPropertyId === item.id && (
                              <div className="absolute inset-0 bg-brand-orange/5 border-2 border-brand-orange rounded-xl pointer-events-none select-none animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>
                )}

                {/* DYNAMIC VISUAL PORTAL EDITOR */}
                {dashboardTab === 'visual' && (
                  <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50">
                    <div className="mb-6">
                      <h3 className="text-xs font-extrabold uppercase text-gray-400 tracking-wider font-mono">
                        Editor Visual do Website (Sem Programação)
                      </h3>
                      <p className="text-[11px] text-gray-500 mt-1 font-medium">
                        Personalize textos, cores corporativas, dados de contato e decida quais seções ficarão visíveis para seus visitantes imediatamente.
                      </p>
                    </div>
                    <VisualEditor 
                      settings={siteSettings} 
                      onSave={(newSettings) => {
                        setSiteSettings(newSettings);
                        // Also show a success message
                        setToastMessage("Configurações visuais do portal publicadas com sucesso!");
                      }} 
                      onReset={() => {
                        if (confirm("Deseja realmente redefinir as configurações visuais para os padrões originais?")) {
                          const defaults = {
                            siteName: 'Elite',
                            siteSubtitle: 'Imobiliária',
                            creci: 'CRECI RS 81158 F',
                            heroBadge: 'Lançamentos & Curadoria Exclusiva 2026',
                            heroTitle: 'Onde seus sonhos encontram endereço',
                            heroDescription: 'A Imobiliária Elite é a chave para o seu próximo capítulo de sofisticação. Apresentamos uma curadoria impecável de imóveis de alto padrão, combinando excelência arquitetônica com a segurança jurídica e patrimonial que você exige.',
                            heroImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80',
                            contactPhone: '+55 (54) 99635-2992',
                            contactEmail: 'miltonbarbosacorretor@gmail.com',
                            contactAddress: 'Rua dos Cravos, 06 - São Lucas - RS',
                            colorPrimary: '#003366',
                            colorSecondary: '#FF8C00',
                            showHero: true,
                            showProperties: true,
                            showDifferentials: true,
                            showGallery: true,
                            showTestimonials: true,
                            showContactForm: true,
                          };
                          setSiteSettings(defaults);
                          setToastMessage("Configurações restauradas com sucesso!");
                        }
                      }}
                    />
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
