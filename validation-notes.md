
## Verificação visual — 2026-09-02

A rota /financas, quando aberta sem sessão autenticada no pré-visualizador mobile, redireciona para a tela de login SK Água Gestão. Isso é comportamento esperado do AppGate e não representa erro da área financeira. A exclusão de movimentações será validada no fluxo autenticado por testes de mutação e recálculo.

## Build Android com botão de cancelamento visível

A execução pública do GitHub Actions #12 (run 33779553877, commit 1531ebe) terminou com status Success. As etapas de TypeScript, testes unitários, geração do projeto Android, build do APK e upload do artefato foram concluídas. O artefato `sk-agua-gestao-apk` aparece com 36,1 MB e digest SHA-256 iniciado por `5b264093...`. A página pública confirma que o repositório `advkevinmarinho-hue/aguagestao` está acessível sem login.

## Artefato público do build #12

A página pública da execução `https://github.com/advkevinmarinho-hue/aguagestao/actions/runs/33779553877` confirma status Success e o artefato `sk-agua-gestao-apk` com 36,1 MB e digest `sha256:5b264093...`. A inspeção DOM sem login encontrou apenas os links da execução e não expôs um link HTML direto para o download do artefato; o download exige a sessão do GitHub ou a cópia local do artefato.
