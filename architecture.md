# Arquitetura Funcional — SK Água Gestão

## Princípios

O aplicativo utiliza o projeto mobile Expo já criado, com um backend protegido para autenticação e sincronização dos dados entre aparelhos. Nenhum dado operacional será criado automaticamente: uma conta nova começa sem produtos, sem vendas, sem estoque e sem lançamentos. Consultas e mutações identificam o usuário autenticado e o respectivo negócio antes de acessar qualquer dado.

## Entidades e relações

| Entidade | Finalidade | Relações e regras essenciais |
| --- | --- | --- |
| `businesses` | Representa a distribuidora gerenciada pela conta. | Tem proprietário, nome, meta mensal e meta de reserva; é a fronteira dos dados operacionais. |
| `products` | Representa o estoque único de um tipo de galão. | Pertence a um negócio e tem saldo, mínimo, custo, preço padrão e status ativo. |
| `product_exit_modes` | Define cada forma de saída do mesmo produto. | Pertence ao produto; tem preço, consumo de galões e status. Não cria estoque separado. |
| `sales` | Registra uma venda concluída. | Pertence ao negócio e ao usuário; armazena total, pagamento, observação e data. |
| `sale_items` | Preserva os detalhes históricos de cada item vendido. | Retém nome, preço, custo, modalidade e consumo praticados na data da venda. |
| `financial_entries` | Registra movimentações não oriundas de vendas. | Classifica custo, despesa, retirada, capital ou reserva, com valor em centavos e data. |
| `lesson_progress` | Controla conclusão de lições por conta. | Garante uma conclusão por negócio, usuário e chave de lição. |

## Convenções de cálculo

Todos os valores monetários são armazenados em **centavos inteiros** no servidor e formatados em reais apenas na interface. Isso evita perdas de precisão. O estoque é sempre um inteiro não negativo.

| Regra | Fórmula ou comportamento |
| --- | --- |
| Limite de uma modalidade | `piso(estoque disponível / galões consumidos)` para a modalidade. |
| Consumo total de venda | Soma de `quantidade × galões consumidos` de todos os itens do carrinho por produto. |
| Faturamento | Soma dos totais das vendas no período. |
| Resultado líquido | Receita menos custos e despesas operacionais do período. |
| Margem líquida | Resultado líquido ÷ faturamento; quando faturamento é zero, retorna estado não calculável. |
| Caixa | Entradas de vendas e capital menos custos, despesas, retiradas e valores destinados à reserva. |
| Reserva | Total acumulado de lançamentos de reserva. |
| Valor em estoque | Estoque atual × custo unitário. |
| Ticket médio | Faturamento ÷ número de vendas; quando não há vendas, retorna estado não calculável. |

## Contratos de operação

| Operação | Validação no servidor | Efeito concluído |
| --- | --- | --- |
| Criar/editar produto | Nome com 2 a 100 caracteres, preço positivo, custo não negativo, estoque inteiro, modalidades com consumo entre 1 e 100. | Persiste produto e modalidades; cria “Venda padrão” se nenhuma modalidade for enviada. |
| Repor estoque | Quantidade inteira positiva e produto pertencente ao negócio. | Aumenta o saldo único do produto. |
| Criar venda | Produto e modalidade pertencem ao negócio, estão ativos, têm saldo suficiente e preço vigente. | Salva venda e histórico; reduz estoque compartilhado sem saldo negativo. |
| Excluir produto | Verifica vendas históricas do produto. | Remove fisicamente se não há venda; caso contrário, desativa e preserva o histórico. |
| Criar lançamento | Tipo válido, valor positivo, descrição dentro do limite e data válida. | Persiste movimentação e atualiza os cálculos derivados. |
| Concluir lição | Usuário e negócio autenticados, chave de lição válida. | Registra o progresso de forma idempotente. |

## Navegação

As cinco abas inferiores serão implementadas com Expo Router. Rotas de formulário, detalhe e confirmação serão abertas acima das abas para manter foco e permitir retorno previsível.

| Grupo | Rotas previstas |
| --- | --- |
| Acesso | `/login`, `/oauth/callback`, `/onboarding` |
| Abas | `/(tabs)/index`, `/(tabs)/vender`, `/(tabs)/produtos`, `/(tabs)/financas`, `/(tabs)/aprender` |
| Operação | `/produto/novo`, `/produto/[id]`, `/venda/revisao`, `/lancamento/novo` |
| Análise | `/indicadores`, `/relatorio` |
| Aprendizagem | `/trilha/[id]`, `/licao/[id]` |
| Conta | `/perfil` |

## Estratégia de estados

Cada consulta deve renderizar carregamento, vazio, erro ou conteúdo. Estados vazios explicam a consequência da ausência de dados e oferecem uma única ação de próximo passo. Mutações apresentam bloqueio temporário do botão, mensagem de erro quando aplicável e confirmação clara quando concluídas.
