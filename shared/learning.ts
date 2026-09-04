export type LearningSection = {
  title: string;
  body: string;
};

export type LearningTrack = {
  id: string;
  imageUrl?: string;
  order: number;
  title: string;
  durationMinutes: number;
  objective: string;
  sections: LearningSection[];
  practice: string;
  action: string;
};

export const learningTracks: LearningTrack[] = [
  {
    id: "numbers",
    imageUrl: "/manus-storage/trilha-numeros_9aca9830.png",
    order: 1,
    title: "Comece pelos números",
    durationMinutes: 12,
    objective: "Construir uma visão confiável do negócio separando caixa pessoal, caixa da empresa e resultado da operação.",
    sections: [
      {
        title: "Cada movimento responde a uma pergunta",
        body: "Venda responde quanto entrou ou será recebido. Custo responde quanto foi pago para obter o produto. Despesa responde quanto foi gasto para operar, como combustível, telefone ou manutenção. Retirada é dinheiro levado para uso pessoal; capital é dinheiro colocado no negócio; reserva é dinheiro separado para uma finalidade futura. Classificar corretamente evita tomar uma retirada como lucro ou confundir uma compra de estoque com despesa comum.",
      },
      {
        title: "Exemplo de um dia real",
        body: "Imagine R$ 600,00 em vendas, R$ 180,00 pagos ao fornecedor, R$ 70,00 de combustível e R$ 100,00 retirados pelo proprietário. O caixa aumentou R$ 250,00 no dia, mas o resultado operacional antes da retirada foi R$ 350,00. A diferença importa: retirar dinheiro reduz o caixa disponível, mas não transforma a operação em prejuízo.",
      },
      {
        title: "Rotina mínima de controle",
        body: "Registre o movimento no mesmo dia, escreva uma descrição que outra pessoa consiga entender e confira o saldo físico ou bancário ao final da semana. Se faltar R$ 40,00, não ajuste o número sem investigar: procure troco, taxa, fiado recebido ou uma saída que ficou sem registro.",
      },
    ],
    practice: "Separe os últimos cinco movimentos da distribuidora em venda, custo, despesa, retirada, capital ou reserva. Em qual classificação você teve mais dúvida e por quê?",
    action: "Abra Finanças e registre hoje todo movimento ainda pendente, usando uma descrição objetiva e o valor efetivamente realizado.",
  },
  {
    id: "price-margin",
    imageUrl: "/manus-storage/trilha-preco_3d0b5164.png",
    order: 2,
    title: "Preço, custo e margem",
    durationMinutes: 18,
    objective: "Definir preços que cubram o custo, contribuam para as despesas e deixem margem suficiente para o negócio evoluir.",
    sections: [
      {
        title: "Preço não é lucro",
        body: "Se um galão custa R$ 8,00 e é vendido por R$ 12,00, a margem bruta em reais é R$ 4,00. A margem sobre o preço é 33,3% (R$ 4,00 dividido por R$ 12,00), enquanto o acréscimo sobre o custo é 50% (R$ 4,00 dividido por R$ 8,00). São leituras diferentes; use sempre a mesma para comparar modalidades.",
      },
      {
        title: "Inclua o custo de atender",
        body: "Uma entrega vendida por R$ 12,00 pode gerar menos contribuição que uma retirada no balcão pelo mesmo preço. Se combustível e taxa média consomem R$ 1,50 por unidade, a contribuição da entrega passa a ser R$ 2,50, não R$ 4,00. O preço precisa considerar distância, tempo, perdas e descontos praticados.",
      },
      {
        title: "Preço com método",
        body: "Comece pelo custo unitário, acrescente a contribuição necessária e compare com os preços que os clientes aceitam. Exemplo: custo de R$ 8,00, custo médio de atendimento de R$ 1,00 e contribuição desejada de R$ 3,00 indicam preço de referência de R$ 12,00. Se o mercado não aceitar, investigue rota, volume, fornecedor ou modalidade antes de simplesmente reduzir a margem.",
      },
    ],
    practice: "Escolha duas modalidades de saída e calcule: preço, custo do produto, custo estimado de atendimento e contribuição por unidade. Qual vende mais e qual deixa mais contribuição?",
    action: "Revise no cadastro de produtos o preço padrão e o custo unitário de uma modalidade que venda com frequência.",
  },
  {
    id: "cash-working-capital",
    imageUrl: "/manus-storage/trilha-caixa_fbb6c453.png",
    order: 3,
    title: "Caixa e capital de giro",
    durationMinutes: 22,
    objective: "Proteger o dinheiro necessário para comprar, entregar, pagar compromissos e atravessar semanas de menor movimento.",
    sections: [
      {
        title: "Faturamento não paga conta sozinho",
        body: "Faturamento é o total vendido; caixa é o dinheiro disponível; resultado é o que sobra depois dos custos e despesas. Uma venda fiada de R$ 300,00 pode aumentar o faturamento, mas não paga o fornecedor hoje. Por isso, acompanhe separadamente o que foi vendido, recebido e ainda está a receber.",
      },
      {
        title: "Quanto manter protegido",
        body: "Liste os compromissos essenciais de uma semana: reposição, combustível, telefone e parcelas. Se totalizam R$ 900,00, esse valor é uma referência de caixa operacional mínimo. A meta não é deixar dinheiro parado sem propósito; é evitar que uma compra urgente ou queda temporária nas vendas obrigue você a usar crédito caro.",
      },
      {
        title: "Regra para o fiado",
        body: "Fiado só é saudável quando existe limite, data combinada e registro. Um cliente que compra R$ 80,00 por semana e paga em 30 dias pode acumular aproximadamente R$ 320,00 antes do primeiro recebimento. Defina limite por cliente, confirme vencimentos e não trate promessa de pagamento como dinheiro disponível.",
      },
    ],
    practice: "Some as despesas e compras essenciais dos próximos sete dias. Compare o total com o caixa atual e escreva uma decisão: comprar, negociar prazo, reduzir rota ou adiar uma retirada.",
    action: "Defina uma regra de caixa mínimo e registre uma reserva para reposição sem misturar esse valor com dinheiro pessoal.",
  },
  {
    id: "inventory-turnover",
    imageUrl: "/manus-storage/trilha-estoque_386bac9e.png",
    order: 4,
    title: "Estoque que trabalha",
    durationMinutes: 25,
    objective: "Equilibrar disponibilidade e capital imobilizado usando vendas, estoque mínimo e velocidade de reposição.",
    sections: [
      {
        title: "O estoque é dinheiro parado até vender",
        body: "Dez unidades compradas a R$ 8,00 representam R$ 80,00 aplicados. Enquanto estão paradas, esse dinheiro não paga combustível nem fornecedor. Estoque insuficiente causa perda de venda; estoque excessivo aumenta risco de avaria, ocupa espaço e reduz o caixa disponível.",
      },
      {
        title: "Estoque mínimo com conta simples",
        body: "Se você vende em média 6 unidades por dia, o fornecedor leva 3 dias para entregar e você deseja uma margem de segurança de 4 unidades, o estoque mínimo de referência é 22 unidades (6 × 3 + 4). Ajuste esse número para sazonalidade, dias de funcionamento e confiabilidade do fornecedor.",
      },
      {
        title: "Giro e ação",
        body: "Giro mostra a velocidade com que o estoque se transforma em venda. Um produto que vende 120 unidades no mês e mantém média de 30 unidades em estoque tem giro aproximado de 4 vezes no mês. Produtos com giro baixo pedem investigação de preço, localização, divulgação ou compra excessiva; produtos que zeram pedem reposição e revisão do mínimo.",
      },
    ],
    practice: "Escolha um produto, anote vendas médias por dia, prazo de reposição e margem de segurança. O estoque mínimo cadastrado protege a operação ou precisa ser ajustado?",
    action: "Atualize o estoque mínimo e faça uma reposição baseada no produto que está mais perto do limite, não apenas na sensação do momento.",
  },
  {
    id: "reports-decisions",
    imageUrl: "/manus-storage/trilha-relatorios_00a904cd.png",
    order: 5,
    title: "Relatórios para decidir",
    durationMinutes: 28,
    objective: "Transformar registros em decisões semanais e mensais, evitando olhar apenas para o total de vendas.",
    sections: [
      {
        title: "Leia quatro números juntos",
        body: "Observe faturamento, resultado líquido, unidades vendidas e ticket médio. Faturamento pode subir enquanto a margem cai; unidades podem subir enquanto o caixa piora por causa de vendas fiadas; ticket médio pode crescer porque poucos clientes compraram volumes maiores. A interpretação nasce do conjunto, não de um número isolado.",
      },
      {
        title: "Exemplo de diagnóstico",
        body: "No mês passado foram 200 vendas de R$ 10,00, totalizando R$ 2.000,00. Neste mês foram 150 vendas de R$ 15,00, totalizando R$ 2.250,00. O faturamento subiu, mas a queda de volume pode indicar perda de frequência, concentração em poucos clientes ou aumento de preço que precisa ser acompanhado.",
      },
      {
        title: "Decisão com prazo e indicador",
        body: "Uma boa decisão tem ação, responsável e prazo. Em vez de ‘vender mais’, escreva ‘oferecer entrega programada aos dez clientes recorrentes até sexta-feira e comparar o número de pedidos’. Na semana seguinte, verifique se a hipótese funcionou e mantenha, ajuste ou abandone a ação.",
      },
    ],
    practice: "Abra o relatório mensal e escolha uma variação importante. Escreva três hipóteses que expliquem a mudança e qual dado você consultaria para confirmar cada uma.",
    action: "Escolha uma decisão para os próximos sete dias, registre o prazo e defina qual indicador mostrará se ela funcionou.",
  },
  {
    id: "sales-market",
    imageUrl: "/manus-storage/trilha-mercado_24ebddeb.png",
    order: 6,
    title: "Vendas e mercado",
    durationMinutes: 30,
    objective: "Entender quem compra, por qual motivo, em qual frequência e com qual modalidade para vender com mais previsibilidade.",
    sections: [
      {
        title: "Segmentos têm necessidades diferentes",
        body: "Famílias valorizam conveniência e regularidade; comércios valorizam prazo, volume e disponibilidade; eventos valorizam planejamento e quantidade. A mesma tabela de preço e a mesma abordagem podem não servir para todos. Observe perfil, frequência, volume, horário e custo de atendimento antes de criar uma oferta.",
      },
      {
        title: "Venda recorrente é previsibilidade",
        body: "Se 20 clientes compram uma unidade por semana, a base potencial é 80 unidades por mês. Se cinco deixam de comprar, a queda pode ser de 20 unidades, mesmo que novos clientes apareçam. Registre clientes recorrentes, lembretes e motivos de perda para proteger a base antes de investir apenas em aquisição.",
      },
      {
        title: "Desconto precisa comprar algo",
        body: "Um desconto de R$ 1,00 em uma venda de R$ 12,00 reduz a margem em 25% quando o custo é R$ 8,00: a contribuição cai de R$ 4,00 para R$ 3,00. O desconto deve ter contrapartida, como volume maior, rota mais eficiente, pagamento imediato ou fidelidade. Caso contrário, ele só reduz o resultado.",
      },
    ],
    practice: "Descreva seu cliente mais frequente, seu melhor cliente em contribuição e um cliente que deixou de comprar. Quais necessidades e custos diferenciam esses três perfis?",
    action: "Escolha uma modalidade ou público para observar por sete dias e registre preço, volume, frequência e esforço de atendimento.",
  },
  {
    id: "growth-reserve",
    imageUrl: "/manus-storage/trilha-crescimento_6c3978b2.png",
    order: 7,
    title: "Gestão para crescer",
    durationMinutes: 35,
    objective: "Crescer com segurança, formando reserva e escolhendo melhorias que aumentem resultado sem comprometer o caixa.",
    sections: [
      {
        title: "Reserva é uma decisão antes da emergência",
        body: "Manutenção, baixa demanda, atraso de recebimento e oportunidade de compra acontecem em momentos imprevisíveis. Se a meta é formar R$ 1.200,00 em seis meses, separar R$ 200,00 por mês torna a meta mensurável. Se o mês for fraco, ajuste o valor conscientemente; não abandone a reserva sem entender o impacto.",
      },
      {
        title: "Crescimento tem capacidade e custo",
        body: "Vender 30% a mais pode exigir mais estoque, combustível, tempo de entrega e capital de giro. Antes de comprar um veículo ou ampliar a rota, estime: quantas unidades adicionais serão vendidas, qual contribuição por unidade, quanto custa a melhoria e em quantos meses ela se paga. Crescimento que consome todo o caixa pode aumentar o risco em vez de aumentar a saúde do negócio.",
      },
      {
        title: "Plano de melhoria de 30 dias",
        body: "Escolha uma restrição principal: falta de estoque, baixa conversão, rotas caras, atraso de recebimento ou desorganização financeira. Defina uma ação pequena, uma métrica e uma data de revisão. Exemplo: reorganizar a rota de terça-feira, reduzir 10 km por dia e comparar combustível e entregas durante quatro semanas.",
      },
    ],
    practice: "Escolha o maior risco atual da distribuidora e estime o valor necessário para atravessá-lo. Depois, escreva uma melhoria que possa ser testada sem comprometer o caixa mínimo.",
    action: "Registre uma meta de reserva, uma melhoria de 30 dias e o indicador que será revisado no próximo mês.",
  },
];

export function getNextTrack(completedKeys: string[]) {
  return learningTracks.find((track) => !completedKeys.includes(track.id)) ?? learningTracks[learningTracks.length - 1];
}

export function getLearningProgress(completedKeys: string[]) {
  return Math.round((completedKeys.filter((key) => learningTracks.some((track) => track.id === key)).length / learningTracks.length) * 100);
}
