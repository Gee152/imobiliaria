import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, ShieldCheck, User, Phone, Sparkles } from 'lucide-react';

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    objective: 'Comprar para morar',
    neighborhood: 'Casa Forte',
    propertyType: 'Apartamento',
    priceRange: 'R$ 1 mi a R$ 2 milhões',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedWhatsAppUrl, setGeneratedWhatsAppUrl] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Format message for WhatsApp
    const messageLines = [
      `*Olá, Tatiana! Solicitação de Atendimento pelo Site:*`,
      `*Nome:* ${formData.name}`,
      `*WhatsApp:* ${formData.phone}`,
      `*Objetivo:* ${formData.objective}`,
      `*Região de Interesse:* ${formData.neighborhood}`,
      `*Tipo de Imóvel:* ${formData.propertyType}`,
      `*Faixa de Valor:* ${formData.priceRange}`,
      formData.message ? `*Mensagem:* ${formData.message}` : ''
    ].filter(Boolean);

    const fullMessage = messageLines.join('\n');
    const targetUrl = `https://wa.me/5581997459932?text=${encodeURIComponent(fullMessage)}`;
    setGeneratedWhatsAppUrl(targetUrl);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      // Automatically redirect/open WhatsApp
      window.open(targetUrl, '_blank');
    }, 600);
  };

  return (
    <section id="contato" className="py-20 md:py-28 bg-[#F2ECE3] border-t border-[#E5DBD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Context & Reassurance */}
          <div className="lg:col-span-5 scroll-reveal-left">
            <div className="inline-flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-[#E5DBD0] mb-4">
              <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
              <span className="text-xs uppercase tracking-widest text-[#4A2E22] font-semibold">
                Atendimento Personalizado
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-[#26160F] leading-tight mb-6">
              Conte-me o que você busca na Zona Norte.
            </h2>

            <p className="font-body text-base text-[#5A544F] leading-relaxed mb-8">
              Preencha o formulário e seus dados serão enviados diretamente para o WhatsApp pessoal de Tatiana Cavalcanti. Você receberá um atendimento consultivo e sem intermediários.
            </p>

            {/* Privacy & Trust Badge */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5DBD0] space-y-4 card-dynamic">
              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E5DBD0] flex items-center justify-center text-[#C85A32] shrink-0 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#26160F] mb-1">
                    Privacidade e Sigilo Garantidos
                  </h3>
                  <p className="text-xs text-[#6E6760] leading-relaxed">
                    Seus dados não serão repassados a terceiros nem inseridos em listas de spam. O contato é estritamente profissional.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FAF7F2] flex items-center space-x-2 text-xs text-[#26160F] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#C85A32]" />
                <span>Atendimento direto: +55 (81) 99745-9932</span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form Card */}
          <div className="lg:col-span-7 scroll-reveal-right delay-100">
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DBD0] shadow-xl card-dynamic">
              
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-1.5">
                        Seu Nome Completo *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ex: Gabriel Silva"
                        className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-4 py-3 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-1.5">
                        Seu WhatsApp com DDD *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Ex: (81) 99745-9932"
                        className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-4 py-3 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Objective */}
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-1.5">
                        Qual é o seu objetivo?
                      </label>
                      <select
                        name="objective"
                        value={formData.objective}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-4 py-3 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      >
                        <option value="Comprar para morar">Comprar para morar</option>
                        <option value="Comprar para investir">Comprar para investir</option>
                        <option value="Estou apenas pesquisando">Estou apenas pesquisando</option>
                        <option value="Quero entender financiamento">Quero entender financiamento</option>
                        <option value="Quero vender meu imóvel">Quero vender meu imóvel</option>
                      </select>
                    </div>

                    {/* Neighborhood of Interest */}
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-1.5">
                        Região de preferência
                      </label>
                      <select
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-4 py-3 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      >
                        <option value="Casa Forte">Casa Forte</option>
                        <option value="Poço da Panela">Poço da Panela</option>
                        <option value="Graças">Graças</option>
                        <option value="Espinheiro">Espinheiro</option>
                        <option value="Jaqueira">Jaqueira</option>
                        <option value="Tamarineira / Parnamirim">Tamarineira / Parnamirim</option>
                        <option value="Aflitos">Aflitos</option>
                        <option value="Outra região da Zona Norte">Outra região da Zona Norte</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Property Type */}
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-1.5">
                        Tipo de Imóvel
                      </label>
                      <select
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-4 py-3 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      >
                        <option value="Apartamento">Apartamento</option>
                        <option value="Casa em Condomínio">Casa em Condomínio</option>
                        <option value="Cobertura">Cobertura</option>
                        <option value="Studio / Flat">Studio / Flat</option>
                        <option value="Terreno / Comercial">Terreno / Comercial</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div>
                      <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-1.5">
                        Faixa de Valor Estimada
                      </label>
                      <select
                        name="priceRange"
                        value={formData.priceRange}
                        onChange={handleChange}
                        className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-4 py-3 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                      >
                        <option value="Até R$ 600 mil">Até R$ 600 mil</option>
                        <option value="R$ 600 mil a R$ 1 milhão">R$ 600 mil a R$ 1 milhão</option>
                        <option value="R$ 1 mi a R$ 2 milhões">R$ 1 mi a R$ 2 milhões</option>
                        <option value="Acima de R$ 2 milhões">Acima de R$ 2 milhões</option>
                        <option value="Ainda não defini">Ainda não defini</option>
                      </select>
                    </div>
                  </div>

                  {/* Optional Message */}
                  <div>
                    <label className="block text-xs uppercase font-semibold text-[#6E6760] tracking-wider mb-1.5">
                      Mensagem ou observações (opcional)
                    </label>
                    <textarea
                      name="message"
                      rows={3}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Ex: Gostaria de opções com pelo menos 3 quartos e varanda ventilada..."
                      className="w-full bg-[#FAF7F2] border border-[#E5DBD0] rounded-xl px-4 py-3 text-sm text-[#26160F] focus:outline-none focus:ring-2 focus:ring-[#C85A32]"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center space-x-2.5 bg-[#C85A32] hover:bg-[#AB4823] text-white py-4 px-6 rounded-xl font-semibold text-base shadow-lg shadow-[#C85A32]/25 transition-all touch-target active:scale-98 disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <span>Preparando envio...</span>
                      ) : (
                        <>
                          <MessageSquare className="w-5 h-5" />
                          <span>Enviar Dados & Conversar no WhatsApp</span>
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-[#6E6760] mt-2.5">
                      Ao clicar, você será direcionado para o WhatsApp com a mensagem já formatada para a Tatiana.
                    </p>
                  </div>

                </form>
              ) : (
                /* Success Feedback State */
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  
                  <h3 className="font-display text-2xl font-bold text-[#26160F] mb-2">
                    Solicitação enviada com sucesso!
                  </h3>
                  
                  <p className="text-sm text-[#5A544F] max-w-md mx-auto mb-6">
                    A janela do WhatsApp foi aberta. Caso ela não tenha aberto automaticamente, clique no botão abaixo para iniciar a conversa com a Tatiana:
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <a
                      href={generatedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center space-x-2 bg-[#26160F] text-white px-6 py-3.5 rounded-xl font-semibold text-sm touch-target"
                    >
                      <MessageSquare className="w-4 h-4 text-[#C85A32]" />
                      <span>Abrir WhatsApp da Tatiana</span>
                    </a>

                    <button
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-[#E5DBD0] text-sm font-semibold text-[#6E6760] hover:bg-[#FAF7F2] touch-target"
                    >
                      <span>Novo envio</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
