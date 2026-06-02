import React, { useState } from 'react';
import { Save, RefreshCw, Eye, Sparkles, Layout, Palette, Phone, Mail, MapPin } from 'lucide-react';
import { SiteSettings } from '../types';

interface VisualEditorProps {
  settings: SiteSettings;
  onSave: (newSettings: SiteSettings) => void;
  onReset: () => void;
}

export default function VisualEditor({ settings, onSave, onReset }: VisualEditorProps) {
  const [form, setForm] = useState<SiteSettings>({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState<'textos' | 'cores' | 'contato' | 'secoes'>('textos');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const handleToggle = (key: keyof SiteSettings) => {
    setForm(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 text-gray-800">
      
      {/* Left Selector: Menu Options */}
      <div className="w-full md:w-56 shrink-0 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('textos')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
            activeSubTab === 'textos' ? 'bg-brand-blue text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Textos e Banners
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('cores')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
            activeSubTab === 'cores' ? 'bg-brand-blue text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Palette className="w-4 h-4" />
          Identidade Visual & Cores
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('contato')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
            activeSubTab === 'contato' ? 'bg-brand-blue text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Phone className="w-4 h-4" />
          Dados de Contato
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('secoes')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all cursor-pointer ${
            activeSubTab === 'secoes' ? 'bg-brand-blue text-white shadow-sm' : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <Layout className="w-4 h-4" />
          Seções da Página Inicial
        </button>

        <div className="border-t border-gray-150 pt-4 mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 text-gray-500 hover:text-brand-orange hover:bg-gray-50 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Restaurar Padrões
          </button>
        </div>
      </div>

      {/* Right Container: Form fields */}
      <form onSubmit={handleSubmit} className="flex-1 bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-6">
        
        {activeSubTab === 'textos' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-blue border-b border-gray-100 pb-2">Customização de Conteúdo Textual</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Nome da Imobiliária</label>
                <input
                  type="text"
                  value={form.siteName}
                  onChange={e => setForm({ ...form, siteName: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Subtítulo / Marca</label>
                <input
                  type="text"
                  value={form.siteSubtitle}
                  onChange={e => setForm({ ...form, siteSubtitle: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Creci / Registro Profissional</label>
                <input
                  type="text"
                  value={form.creci}
                  onChange={e => setForm({ ...form, creci: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Selo de Notificação (Badge)</label>
                <input
                  type="text"
                  value={form.heroBadge}
                  onChange={e => setForm({ ...form, heroBadge: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Título de Entrada Principal (Headline)</label>
              <input
                type="text"
                value={form.heroTitle}
                onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                className="w-full mt-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Parágrafo Comercial de Apresentação</label>
              <textarea
                rows={3}
                value={form.heroDescription}
                onChange={e => setForm({ ...form, heroDescription: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Imagem de Fundo do Banner (URL Unsplash / Web)</label>
              <input
                type="text"
                value={form.heroImageUrl}
                onChange={e => setForm({ ...form, heroImageUrl: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
              />
              <p className="text-[9px] text-gray-400 mt-1 italic">Dica: Utilize imagens com alta resolução de preferência paisagens horizontais.</p>
            </div>
          </div>
        )}

        {activeSubTab === 'cores' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-blue border-b border-gray-100 pb-2">Definição Cromática do Portal</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Altere as cores principais de botões, tags, cabeçalhos e decorações para combinar perfeitamente com sua agência imobiliária com visualização na hora!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Primary Color selection */}
              <div className="space-y-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <span className="text-[11px] font-bold uppercase text-gray-600 block">Tom de Base Nobre (Azul Elite)</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.colorPrimary}
                    onChange={e => setForm({ ...form, colorPrimary: e.target.value })}
                    className="w-12 h-12 border border-gray-200 rounded-xl cursor-pointer"
                  />
                  <div>
                    <input
                      type="text"
                      value={form.colorPrimary}
                      onChange={e => setForm({ ...form, colorPrimary: e.target.value })}
                      className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono"
                    />
                    <span className="block text-[8px] text-gray-400 mt-1">Geralmente cor sobria ou escura.</span>
                  </div>
                </div>
              </div>

              {/* Secondary Color selection */}
              <div className="space-y-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <span className="text-[11px] font-bold uppercase text-gray-600 block">Tom de Acordo Comercial (Laranja)</span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={form.colorSecondary}
                    onChange={e => setForm({ ...form, colorSecondary: e.target.value })}
                    className="w-12 h-12 border border-gray-200 rounded-xl cursor-pointer"
                  />
                  <div>
                    <input
                      type="text"
                      value={form.colorSecondary}
                      onChange={e => setForm({ ...form, colorSecondary: e.target.value })}
                      className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-xs font-mono"
                    />
                    <span className="block text-[8px] text-gray-400 mt-1">Botões de ação e tags de destaque.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeSubTab === 'contato' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-blue border-b border-gray-100 pb-2">Informações Digitais e Físicas de Contato</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-brand-orange" /> WhatsApp Oficial de Atendimento
                </span>
                <input
                  type="text"
                  value={form.contactPhone}
                  onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-brand-orange" /> E-mail Profissional
                </span>
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-orange" /> Bureau de Negócios / Endereço Físico
              </span>
              <input
                type="text"
                value={form.contactAddress}
                onChange={e => setForm({ ...form, contactAddress: e.target.value })}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>
        )}

        {activeSubTab === 'secoes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-brand-blue border-b border-gray-100 pb-2">Organização Estrutural da Página</h3>
            <p className="text-[11px] text-gray-500 mb-4 font-medium">
              Ative ou desative blocos inteiros de conteúdo da Landing Page de acordo com suas necessidades estratégicas do momento:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'showHero', label: 'Banner de Boas-vindas (Hero)' },
                { key: 'showProperties', label: 'Módulo de Catálogo de Imóveis' },
                { key: 'showDifferentials', label: 'Módulo de Diferenciais / Vantagens' },
                { key: 'showGallery', label: 'Módulo de Ambientes em Grid (Galeria)' },
                { key: 'showTestimonials', label: 'Módulo de Depoimentos / Avaliações' },
                { key: 'showContactForm', label: 'Módulo de Formulário de Captação' }
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => handleToggle(item.key as any)}
                  className="flex items-center justify-between p-3.5 bg-gray-55 border border-gray-200 hover:border-brand-blue/30 rounded-xl cursor-pointer transition-all hover:bg-brand-blue-soft/30"
                >
                  <span className="text-xs font-bold text-gray-700">{item.label}</span>
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${
                    form[item.key as keyof SiteSettings] ? 'bg-brand-orange justify-end' : 'bg-gray-300 justify-start'
                  }`}>
                    <span className="w-4 h-4 rounded-full bg-white shadow-sm"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BOTTOM GLOBAL ACTION */}
        <div className="border-t border-gray-100 pt-5 flex items-center justify-between gap-4">
          <span className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
            <Eye className="w-4 h-4" /> Alterações salvas instantâneas para clientes!
          </span>
          
          <button
            type="submit"
            className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-brand-orange/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Publicar Novas Configurações
          </button>
        </div>

      </form>

    </div>
  );
}
