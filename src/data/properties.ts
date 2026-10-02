export interface Property {
  id: string;
  title: string;
  slug: string;
  type: 'Apartamento' | 'Casa' | 'Cobertura' | 'Studio';
  neighborhood: string;
  city: string;
  price: string;
  priceRaw?: number;
  area: number;
  bedrooms: number;
  suites: number;
  parkingSpaces: number;
  purpose: 'morar' | 'investir';
  status: 'Pronto para Morar' | 'Lançamento' | 'Exclusividade' | 'Em Construção' | 'Alto Padrão';
  description: string;
  highlight: string;
  features: string[];
  images: string[];
  floorPlan?: string;
  referenceCode: string;
}

export const PROPERTIES: Property[] = [
  {
    id: 'prop-01',
    title: 'Edifício Parque Casa Forte',
    slug: 'edificio-parque-casa-forte',
    type: 'Apartamento',
    neighborhood: 'Casa Forte',
    city: 'Recife - PE',
    price: 'R$ 1.890.000',
    priceRaw: 1890000,
    area: 172,
    bedrooms: 4,
    suites: 3,
    parkingSpaces: 3,
    purpose: 'morar',
    status: 'Exclusividade',
    highlight: 'A 200m da Praça de Casa Forte, varanda integrada com vista para a copa das árvores.',
    description: 'Imóvel singular em rua arborizada no coração de Casa Forte. Planta generosa com ventilação leste/sul permanente, sala para 3 ambientes climatizados, piso em porcelanato travertino e suíte master com closet walk-in. Edifício com segurança 24h patrimonial e área de lazer completa.',
    features: ['Varanda Gourmet', '3 Vagas Cobertas', 'Piscina Semi-Olímpica', 'Gerador Full', 'Segurança 24h', 'Acabamento Premium'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80'
    ],
    referenceCode: 'TC-CF172'
  },
  {
    id: 'prop-02',
    title: 'Reserva Poço da Panela',
    slug: 'reserva-poco-da-panela',
    type: 'Casa',
    neighborhood: 'Poço da Panela',
    city: 'Recife - PE',
    price: 'R$ 2.450.000',
    priceRaw: 2450000,
    area: 280,
    bedrooms: 4,
    suites: 4,
    parkingSpaces: 4,
    purpose: 'morar',
    status: 'Exclusividade',
    highlight: 'Casa em condomínio fechado com jardim privativo e tranquilidade bucólica.',
    description: 'Viver no Poço da Panela com total segurança. Residência com arquitetura contemporânea que abraça a história do bairro: pé-direito duplo na sala, espaço gourmet privativo com churrasqueira e piscina aquecida, energia solar instalada e documentação 100% regularizada.',
    features: ['Jardim Privativo', 'Condomínio Fechado', 'Espaço Gourmet', 'Energia Solar', '4 Suítes', 'Piscina Privativa'],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80'
    ],
    referenceCode: 'TC-PP280'
  },
  {
    id: 'prop-03',
    title: 'Mirante das Graças',
    slug: 'mirante-das-gracas',
    type: 'Apartamento',
    neighborhood: 'Graças',
    city: 'Recife - PE',
    price: 'R$ 1.280.000',
    priceRaw: 1280000,
    area: 125,
    bedrooms: 3,
    suites: 2,
    parkingSpaces: 2,
    purpose: 'morar',
    status: 'Pronto para Morar',
    highlight: 'Localização nobre, próximo aos melhores colégios e cafés do bairro.',
    description: 'Apartamento impecável e reformado nas Graças. Planta funcional com excelente aproveitamento de espaço, varanda com cortina de vidro e ventilação cruzada privilegiada. Cozinha planejada de alto padrão e dependência completa.',
    features: ['Varanda com Cortina de Vidro', '2 Vagas Livres', 'Salão de Festas Climatizado', 'Academia Equipada', 'Playground'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    referenceCode: 'TC-GR125'
  },
  {
    id: 'prop-04',
    title: 'Terrace Jaqueira Residence',
    slug: 'terrace-jaqueira-residence',
    type: 'Cobertura',
    neighborhood: 'Jaqueira',
    city: 'Recife - PE',
    price: 'Sob Consulta',
    area: 310,
    bedrooms: 4,
    suites: 4,
    parkingSpaces: 4,
    purpose: 'morar',
    status: 'Alto Padrão',
    highlight: 'Vista panorâmica cinematográfica definitiva para o Parque da Jaqueira.',
    description: 'Uma das coberturas mais desejadas da Zona Norte. Deck privativo com piscina com borda infinita, vista frontal para a imensidão verde do Parque da Jaqueira, acabamento em mármore importado e automação residencial completa.',
    features: ['Vista Parque da Jaqueira', 'Piscina Privativa', 'Deck Panorâmico', 'Automação', '4 Vagas Cobertas', 'Depósito Privativo'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80'
    ],
    referenceCode: 'TC-JQ310'
  },
  {
    id: 'prop-05',
    title: 'Design Studio Espinheiro',
    slug: 'design-studio-espinheiro',
    type: 'Studio',
    neighborhood: 'Espinheiro',
    city: 'Recife - PE',
    price: 'R$ 490.000',
    priceRaw: 490000,
    area: 42,
    bedrooms: 1,
    suites: 1,
    parkingSpaces: 1,
    purpose: 'investir',
    status: 'Lançamento',
    highlight: 'Alta rentabilidade com locação por temporada ou longo prazo no polo médico/cultural.',
    description: 'Excelente oportunidade de investimento imobiliário na Zona Norte. Studios inteligentes concebidos para alta taxa de ocupação, fechadura eletrônica, coworking integrado, rooftop com lounge bar e lavanderia compartilhada OMO.',
    features: ['Rooftop Lounge', 'Coworking', 'Alta Rentabilidade', 'Fechadura Digital', 'Piscina Panorâmica'],
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    ],
    referenceCode: 'TC-ES042'
  },
  {
    id: 'prop-06',
    title: 'Vila Tamarineira Boulevard',
    slug: 'vila-tamarineira-boulevard',
    type: 'Apartamento',
    neighborhood: 'Tamarineira',
    city: 'Recife - PE',
    price: 'R$ 960.000',
    priceRaw: 960000,
    area: 98,
    bedrooms: 3,
    suites: 2,
    parkingSpaces: 2,
    purpose: 'morar',
    status: 'Pronto para Morar',
    highlight: 'Planta moderna integrada, condomínio clube para famílias com crianças.',
    description: 'Apartamento perfeito para quem busca comodidade próximo a supermercados, colégios e serviços da Tamarineira e Parnamirim. Varanda ampla integrada com a sala, cozinha americana e condomínio com lazer de resort.',
    features: ['Condomínio Clube', 'Cozinha Americana', '2 Vagas', 'Brinquedoteca', 'Piscina com Raia'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80'
    ],
    referenceCode: 'TC-TM098'
  }
];

export const NEIGHBORHOODS = [
  {
    name: 'Casa Forte',
    tagline: 'Tradição, praças históricas e arborização nobre',
    description: 'O epicentro do charme na Zona Norte, famoso pela icônica Praça de Casa Forte desenhada por Burle Marx, colégios renomados e restaurantes gastronômicos.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    highlights: ['Praça de Casa Forte', 'Colégios Tradicionais', 'Alta Valorização']
  },
  {
    name: 'Poço da Panela',
    tagline: 'Refúgio bucólico e preservação arquitetônica',
    description: 'Casarios coloniais, ruas calçadas a paralelepípedo e um estilo de vida silencioso e acolhedor às margens do Rio Capibaribe.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    highlights: ['Clima Bucólico', 'Casas e Condomínios', 'Vizinhança Exclusiva']
  },
  {
    name: 'Graças',
    tagline: 'Mobilidade, cafés charmosos e vida a pé',
    description: 'Um dos bairros mais queridos do Recife, com alamedas sombreadas, proximidade de centros médicos, clubes e livrarias tradicionais.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    highlights: ['Vida Pedestre', 'Cafés e Bistrôs', 'Fácil Acesso à Agamenon']
  },
  {
    name: 'Espinheiro',
    tagline: 'Elegância residencial e conveniência gastronômica',
    description: 'Ruas densamente arborizadas com uma das melhores ofertas de comércio refinado, padarias artesanais e apartamentos espaçosos.',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    highlights: ['Polo Gastronômico', 'Ruas Arborizadas', 'Imóveis de Médio/Alto Padrão']
  },
  {
    name: 'Jaqueira',
    tagline: 'Qualidade de vida ao redor do parque mais amado',
    description: 'Viver em frente ou a passos do Parque da Jaqueira é sinônimo de saúde, esporte, segurança e valorização patrimonial perpétua.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    highlights: ['Parque da Jaqueira', 'Endereço Mais Nobre', 'Metragem Generosa']
  },
  {
    name: 'Tamarineira / Parnamirim',
    tagline: 'Equilíbrio ideal entre tranquilidade e serviços',
    description: 'Bairros vizinhos que oferecem escolas conceituadas, hospitais de ponta e condomínios com infraestrutura moderna de lazer.',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    highlights: ['Excelente Custo-Benefício', 'Infraestrutura Completa', 'Famílias Jovens']
  }
];
