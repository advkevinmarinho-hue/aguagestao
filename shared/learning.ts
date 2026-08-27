export type LearningTrack = {
  id: string;
  order: number;
  title: string;
  durationMinutes: number;
  objective: string;
  sections: { title: string; body: string }[];
  practice: string;
  action: string;
};

export const learningTracks: LearningTrack[] = [
  {
    id: "numbers",
    order: 1,
    title: "Comece pelos números",
    durationMinutes: 5,
    objective: "Separar o dinheiro do negócio e registrar cada movimento com clareza.",
    sections: [
      { title: "O que registrar", body: "Anote toda venda, custo, despesa, retirada, entrada de capital e valor separado para reserva." },
      { title: "Dinheiro do negócio", body: "O caixa da distribuidora precisa ficar separado do dinheiro pessoal. Assim você sabe se a operação realmente se sustenta." },
    ],
    practice: "Pense na última saída de dinheiro da distribuidora. Ela foi custo, despesa ou retirada?",
    action: "Registre um lançamento que ainda esteja faltando.",
  },
  {
    id: "price-margin",
    order: 2,
    title: "Preço, custo e margem",
    durationMinutes: 10,
    objective: "Entender quanto sobra em cada galão vendido.",
    sections: [
      { title: "Preço não é lucro", body: "O preço da venda precisa cobrir o custo do galão e ajudar a pagar as despesas da operação." },
      { title: "Modalidades de saída", body: "Troca, entrega e venda para comércio podem ter preços diferentes, mas consomem o mesmo estoque compartilhado." },
    ],
    practice: "Compare o preço e o custo de uma modalidade. O valor restante ajuda a pagar quais despesas?",
    action: "Revise o preço de uma modalidade de saída.",
  },
  {
    id: "cash-working-capital",
    order: 3,
    title: "Caixa e capital de giro",
    durationMinutes: 15,
    objective: "Proteger o dinheiro necessário para manter compras, entregas e compromissos.",
    sections: [
      { title: "Caixa", body: "Caixa é o dinheiro disponível depois das entradas e saídas registradas, não o faturamento bruto." },
      { title: "Capital de giro", body: "É o recurso que mantém o negócio funcionando enquanto você compra, armazena, entrega e espera recebimentos." },
    ],
    practice: "Se uma venda fiada demora para entrar, quais contas da distribuidora continuam vencendo?",
    action: "Defina uma regra para não usar o dinheiro da reposição.",
  },
  {
    id: "inventory-turnover",
    order: 4,
    title: "Estoque que trabalha",
    durationMinutes: 20,
    objective: "Usar o estoque como recurso de venda, evitando excesso e falta de galões.",
    sections: [
      { title: "Estoque é dinheiro aplicado", body: "Cada galão parado representa dinheiro que ainda não voltou para o caixa. Excesso imobiliza recursos; falta causa perda de venda." },
      { title: "Reposição", body: "Observe as vendas e o estoque mínimo para decidir quando repor, em vez de comprar apenas por sensação." },
    ],
    practice: "Qual produto está próximo do estoque mínimo? Qual está parado há mais tempo?",
    action: "Cadastre ou atualize o estoque mínimo de um produto.",
  },
  {
    id: "reports-decisions",
    order: 5,
    title: "Relatórios para decidir",
    durationMinutes: 25,
    objective: "Transformar os registros em decisões simples para o próximo mês.",
    sections: [
      { title: "Leia tendências", body: "Compare vendas, estoque, ticket médio e resultado. Um número isolado raramente conta toda a história." },
      { title: "Produtos que pedem decisão", body: "Estoque baixo pede reposição; item sem venda pede investigação; produto parado pode pedir uma nova estratégia." },
    ],
    practice: "Escolha um produto do relatório e escreva uma decisão para os próximos sete dias.",
    action: "Abra o relatório mensal e escolha uma ação baseada nos dados.",
  },
  {
    id: "sales-market",
    order: 6,
    title: "Vendas e mercado",
    durationMinutes: 30,
    objective: "Observar clientes, modalidades e regiões para vender com mais intenção.",
    sections: [
      { title: "Conheça a demanda", body: "Famílias, comércios e eventos podem comprar formatos e quantidades diferentes. Registre o que realmente sai." },
      { title: "Venda saudável", body: "Vender mais é importante, mas preço, custo, recebimento e capacidade de entrega também precisam fazer sentido." },
    ],
    practice: "Qual modalidade vende mais? Ela também contribui para uma margem saudável?",
    action: "Escolha uma modalidade para observar com atenção nesta semana.",
  },
  {
    id: "growth-reserve",
    order: 7,
    title: "Gestão para crescer",
    durationMinutes: 35,
    objective: "Criar reserva, planejar melhorias e crescer sem confundir movimento com resultado.",
    sections: [
      { title: "Reserva financeira", body: "Separar valores regularmente ajuda a enfrentar manutenção, baixa demanda e oportunidades de compra." },
      { title: "Melhoria contínua", body: "Use os registros para escolher uma melhoria por vez: rota, atendimento, preço, reposição ou controle do caixa." },
    ],
    practice: "Qual risco financeiro mais preocupa seu negócio hoje e qual valor poderia proteger você?",
    action: "Registre uma meta de reserva e uma melhoria para o próximo mês.",
  },
];

export function getNextTrack(completedKeys: string[]) {
  return learningTracks.find((track) => !completedKeys.includes(track.id)) ?? learningTracks[learningTracks.length - 1];
}

export function getLearningProgress(completedKeys: string[]) {
  return Math.round((completedKeys.filter((key) => learningTracks.some((track) => track.id === key)).length / learningTracks.length) * 100);
}
