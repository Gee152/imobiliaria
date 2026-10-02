# language: pt
Funcionalidade: Identidade da Marca, Conformidade Legal (CRECI 8988) e Navegação
  Como um visitante e investidor imobiliário
  Desejo verificar a credencial profissional da corretora Tatiana Cavalcanti
  E navegar fluidamente pelas seções institucionais do site

  Contexto:
    Dado que o usuário acessa a página inicial

  Cenário: Identidade Visual e Credencial CRECI 8988 no Topo
    Então o cabeçalho fixo deve conter o nome "TATIANA CAVALCANTI"
    E deve exibir a inscrição profissional "CRECI 8988"
    E deve exibir os ícones de acesso rápido ao Instagram e WhatsApp junto ao nome

  Cenário: Navegação por Âncoras do Menu Principal
    Quando o usuário clica no link "Tati Explica" do menu
    Então a página deve rolar suavemente até a seção "#tati-explica"
    Quando o usuário clica no link "Segurança" do menu
    Então a página deve navegar até a seção "#seguranca" com o posicionamento "Só é dono quem registra"

  Cenário: Verificação da Seção de Segurança Jurídica
    Dado que a seção "#seguranca" está visível
    Então deve exibir a fundamentação "Só é dono quem registra"
    E deve listar os pontos de auditoria de certidões cíveis, fiscais e matrícula atualizada no RGI
