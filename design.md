# Plano de Interface — SK Água Gestão

## Direção de produto

O **SK Água Gestão** será um aplicativo Android em orientação retrato, concebido para o uso diário de vendedores de água. A experiência prioriza ações rápidas com uma mão, especialmente registrar uma venda, e apresenta a gestão financeira em linguagem simples. A interface começa sem números ilustrativos: antes de o usuário cadastrar produtos ou registrar vendas, todos os painéis apresentam estados vazios explicativos e orientados à ação.

## Direção visual

A referência visual fornecida combina uma marca em **azul-marinho**, uma gota azul e arcos/ondas que representam distribuição de água. A aplicação traduz esses elementos em superfícies claras, cartões arredondados e detalhes de ondas discretos, evitando reproduzir o cartaz como fundo. O resultado mantém o reconhecimento da marca em uma interface contemporânea, legível e apropriada para operação financeira.

| Elemento | Decisão de design |
| --- | --- |
| Navegação | Barra inferior com cinco abas: Início, Vender, Produtos, Finanças e Aprender. |
| Hierarquia | Cabeçalhos curtos, informações financeiras em cartões de alto contraste e uma ação primária por tela. |
| Toque | Áreas interativas de, no mínimo, 44 px, campos amplos e botões principais fixados quando necessário. |
| Feedback | Estados de carregamento, vazio, erro compreensível e confirmação visual após salvar. |
| Estilo | Superfícies brancas sobre fundo gelo, bordas suaves, sombras discretas e ilustrações abstratas de ondas. |

## Cores

| Uso | Claro | Escuro | Justificativa |
| --- | --- | --- | --- |
| Azul primário | `#168CCF` | `#7BC5F4` | Derivado da gota e dos arcos da marca. |
| Azul-marinho | `#080D2B` | `#F6FAFF` | Cor de alto contraste para títulos, valores e marca. |
| Fundo | `#F3F6F7` | `#080D2B` | Mantém a tela leve e remete à água limpa. |
| Superfície | `#FFFFFF` | `#121938` | Cartões, formulários e barra inferior. |
| Sucesso | `#148A63` | `#57D6A8` | Vendas concluídas e indicadores saudáveis. |
| Atenção | `#B7791F` | `#F6C766` | Estoque baixo e pendências. |
| Erro | `#C2414C` | `#FF8A96` | Erros de validação e ações críticas. |

## Telas e conteúdo

| Tela | Conteúdo principal | Ações principais |
| --- | --- | --- |
| Acesso | Marca SK, mensagem “Seus dados em todo lugar” e explicação sobre sincronização. | Entrar com e-mail. |
| Configuração inicial | Nome do negócio, meta mensal e meta de reserva. | Salvar e começar. |
| Início | Saudação, faturamento do dia, caixa, meta, margem, reserva, alertas e próxima lição. | Vender, lançar gasto, cadastrar estoque, abrir indicadores. |
| Vender | Produtos ativos com estoque disponível e modalidades de saída. | Ajustar quantidades, revisar carrinho, escolher pagamento e confirmar venda. |
| Produtos | Lista eficiente de produtos, saldo, mínimo, custo, preço e status. | Criar, editar, repor, ativar/desativar ou apagar produto. |
| Produto | Formulário de estoque único e modalidades vinculadas. | Salvar produto, adicionar modalidade e apagar com confirmação. |
| Finanças | Caixa, faturamento, capital de giro e feed de movimentações. | Criar custo, despesa, retirada, capital ou reserva; abrir relatório. |
| Novo lançamento | Tipo, valor positivo, descrição e data. | Salvar lançamento. |
| Indicadores | Métricas explicadas com alerta e ação recomendada baseada nos dados reais. | Consultar relatório ou registrar a ação sugerida. |
| Relatório mensal | Seletor de período, resumo, gráficos, ranking, produtos críticos e leitura do gestor. | Exportar, compartilhar ou imprimir no Android. |
| Aprender | Sete trilhas progressivas e o progresso individual. | Abrir trilha e continuar lição. |
| Trilha e lição | Objetivo, explicações, exemplo de distribuidora, prática e conclusão. | Marcar lição como concluída. |
| Perfil do negócio | Nome, metas e informações da conta. | Editar negócio e sair. |

## Fluxos prioritários

**Venda rápida:** o usuário abre a aba Vender, seleciona uma modalidade do produto disponível, ajusta a quantidade dentro do limite do estoque compartilhado, revisa os itens, escolhe dinheiro, Pix, cartão ou fiado e confirma. A operação registra o histórico, reduz o saldo do estoque e atualiza indicadores.

**Cadastro de estoque:** o usuário abre Produtos, toca em “Cadastrar estoque”, informa dados básicos do galão e salva. Caso não crie modalidades, o aplicativo gera uma “Venda padrão” de um galão. Produtos existentes permitem incluir modalidades, repor o saldo e ajustar o mínimo.

**Lançamento financeiro:** na aba Finanças, o usuário escolhe “Novo lançamento”, seleciona a categoria, informa valor, descrição e data. O app atualiza caixa, resultado e indicadores sem classificar retiradas como despesa operacional.

**Aprendizado aplicado:** em Aprender, o usuário abre a próxima trilha sugerida, percorre conteúdos curtos sobre gestão de distribuidora, realiza a prática e conclui a lição. O progresso fica vinculado à conta e aparece na tela Início.

## Modelos de domínio

O vocabulário do aplicativo será consistente entre interface e regras de negócio. Um **Negócio** possui um proprietário, metas, produtos, vendas, lançamentos e progresso de lições. Cada **Produto** contém um único saldo de galões e uma ou mais **Modalidades de saída**, que consomem unidades desse mesmo saldo. Uma **Venda** preserva preço, custo e nome histórico de cada item. Um **Lançamento financeiro** registra custo, despesa, retirada, capital ou reserva.

## Acessibilidade e responsividade

Todos os valores monetários serão exibidos em reais brasileiros, com texto e fundo em contraste adequado. O layout será otimizado para telas estreitas em retrato, com rolagem apenas onde necessária, campos que respeitam teclado e textos sem truncamento. Ícones complementam rótulos e nunca substituem ações essenciais.
