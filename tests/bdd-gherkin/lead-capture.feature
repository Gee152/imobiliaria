# language: pt
Funcionalidade: Captação de Leads Consultivos para Imóveis na Zona Norte
  Como um potencial comprador de imóvel de médio/alto padrão
  Desejo preencher meus dados e preferências no formulário de contato
  Para receber uma assessoria personalizada diretamente no WhatsApp de Tatiana Cavalcanti (CRECI 8988)

  Contexto:
    Dado que o usuário acessa a página inicial de "Tatiana Cavalcanti Imóveis"
    E rola a página até a seção de contato com id "#contato"

  Cenário: Envio com sucesso do formulário com dados válidos
    Quando o usuário preenche o campo "Seu Nome Completo *" com "Dr. Rodrigo Alencar"
    E preenche o campo "Seu WhatsApp com DDD *" com "(81) 98877-6655"
    E seleciona o objetivo "Comprar para morar"
    E seleciona a região "Casa Forte"
    E seleciona o tipo de imóvel "Apartamento"
    E seleciona a faixa de valor "R$ 1 mi a R$ 2 milhões"
    E digita a mensagem opcional "Procuro apartamento com 4 quartos e varanda gourmet."
    E clica no botão "Enviar Dados & Conversar no WhatsApp"
    Então o sistema exibe a mensagem de sucesso "Solicitação enviada com sucesso!"
    E deve disponibilizar o botão de contingência "Abrir WhatsApp da Tatiana" com o link contendo o número "5581997459932" e o texto formatado
    E exibe o botão "Novo envio"

  Cenário: Validação de campos obrigatórios não preenchidos
    Quando o usuário deixa o campo "Seu Nome Completo *" vazio
    E clica no botão "Enviar Dados & Conversar no WhatsApp"
    Então o navegador deve impedir o envio destacando o campo obrigatório
    E o formulário permanece visível sem exibir o estado de sucesso

  Cenário: Realizar um novo envio após conclusão
    Dado que o formulário foi enviado com sucesso e está na tela de confirmação
    Quando o usuário clica no botão "Novo envio"
    Então o formulário de captação é restaurado com os campos disponíveis para preenchimento
