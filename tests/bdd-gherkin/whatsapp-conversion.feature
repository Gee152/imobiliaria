# language: pt
Funcionalidade: Pontos de Conversão Direta via WhatsApp
  Como um cliente pronto para conversar com a Tatiana
  Desejo ter acesso rápido a botões de WhatsApp em posições estratégicas
  Para iniciar uma conversa com mensagem pré-formatada

  Contexto:
    Dado que o usuário acessa a página inicial

  Cenário: Botão Flutuante de WhatsApp Sempre Acessível
    Então o botão flutuante "#floating-whatsapp" deve estar visível e fixado no canto inferior direito
    E deve conter um link direcionando para o domínio da API do WhatsApp ("wa.me")
    E o link deve conter o número de telefone "5581997459932"
    E no desktop deve exibir o balão indicativo ao passar o mouse

  Cenário: Botão de Contato no Catálogo de Imóveis
    Dado que o usuário visualiza o primeiro imóvel do catálogo
    Quando o usuário clica no botão de WhatsApp do card
    Então o link gerado deve incluir o título e o código de referência do imóvel na mensagem URL
