# language: pt
Funcionalidade: Catálogo Interativo e Filtros de Imóveis da Zona Norte
  Como um cliente interessado em imóveis no Recife
  Desejo filtrar propriedades por bairro, tipo e número de quartos
  E abrir os detalhes de um imóvel para inspecionar fotos e metragens
  Para escolher o imóvel ideal e tirar dúvidas diretamente pelo WhatsApp

  Contexto:
    Dado que o usuário acessa a página inicial
    E navega até a seção "#imoveis"
    Então o contador de imóveis deve exibir propriedades disponíveis

  Cenário: Filtragem por Bairro
    Quando o usuário seleciona o bairro "Casa Forte" no filtro de bairros
    Então todos os cards de imóveis exibidos devem pertencer ao bairro "Casa Forte"
    E o contador de imóveis deve refletir a quantidade encontrada

  Cenário: Filtragem por Quantidade Mínima de Quartos
    Quando o usuário seleciona "3+ quartos" no filtro de quartos
    Então todos os cards exibidos devem ter pelo menos 3 quartos
    E o botão de limpar filtros deve ficar visível

  Cenário: Restaurar e Limpar Filtros
    Dado que um ou mais filtros estão aplicados
    Quando o usuário clica no botão de limpar filtros (ícone X)
    Então todos os filtros retornam para o valor padrão "todos"
    E o catálogo volta a exibir o portfólio completo

  Cenário: Abrir e Fechar Modal de Detalhes do Imóvel
    Quando o usuário clica no botão "Ver detalhes" do primeiro imóvel listado
    Então o modal de detalhes do imóvel deve se abrir na tela
    E deve exibir o título do imóvel, valor, área em m², quartos e vagas
    E deve listar os "Destaques & Diferenciais" com itens de checklist
    Quando o usuário clica no botão de fechar modal (X)
    Então o modal de detalhes deve desaparecer da tela

  Cenário: Trocar de Imagem na Galeria do Modal
    Dado que o modal de detalhes de um imóvel com múltiplas imagens está aberto
    Quando o usuário clica na segunda miniatura de foto
    Então a foto principal em destaque é atualizada para a imagem selecionada
