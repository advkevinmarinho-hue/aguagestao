# Fontes consultadas para as trilhas

A estrutura das lições foi inspirada em materiais institucionais do Sebrae sobre fluxo de caixa, capital de giro e gestão de estoque. O material do Sebrae SC define capital de giro como o recurso financeiro necessário para cobrir despesas operacionais de curto prazo e relaciona o conceito ao controle de entradas, saídas, contas a pagar, contas a receber e estoque. Também destaca que estoque equilibrado evita imobilizar capital e que a reposição deve considerar a demanda.

Fonte principal: [Sebrae SC — O que é capital de giro?](https://www.sebrae-sc.com.br/blog/o-que-e-capital-de-giro)

Uma página da loja do Sebrae sobre fluxo de caixa e capital de giro foi consultada, mas retornou erro 404 no momento da consulta e não foi usada como fonte de conteúdo.

Fonte consultada com retorno 404: [Sebrae — Faça seu fluxo de caixa e controle seu capital de giro](https://go.loja.sebrae.com.br/faca-seu-fluxo-de-caixa-e-controle-seu-capital-de-giro-ev-787092)

## Expo/EAS Build — consulta em 28/08/2026

A página oficial de preços informa que o plano Free inclui até 15 builds Android e 15 builds iOS por mês, em fila de baixa prioridade. O plano Starter custa US$ 19/mês e inclui US$ 45 em créditos de build, com builds prioritários; o plano Production custa US$ 199/mês e inclui US$ 225 em créditos. No plano Free, a cota mensal é limitada e não há cobrança de excedente. As cotas são renovadas mensalmente.

Para gerar um APK instalável diretamente no Android, a documentação recomenda configurar um perfil EAS com `android.buildType: "apk"` e executar `eas build -p android --profile preview`. A documentação também informa que o limite de builds pendentes é 50 por plataforma por conta.

Fontes oficiais:

- [Expo Application Services pricing](https://expo.dev/pricing)
- [Expo — Subscriptions, plans, and add-ons](https://docs.expo.dev/billing/plans/)
- [Expo — Build APKs for Android Emulators and devices](https://docs.expo.dev/build-reference/apk/)
- [Expo — EAS Build limitations](https://docs.expo.dev/build-reference/limitations/)
