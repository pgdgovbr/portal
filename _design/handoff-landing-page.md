# Handoff de Design — Landing Page do produto + Tela de Login

> **Para o Claude Design.** Você já desenhou todo o sistema PGD Libre comigo: as telas de servidor/chefia/gestor/admin, a pactuação bilateral, mobile, etc. Agora damos um passo atrás: o **portal vai virar duas coisas em uma**: (1) uma **landing page do produto** (PGD Libre como software livre, instalável por qualquer órgão) e (2) o **web app em si** (instância demo do MGI). Esse handoff briefa o trabalho.

---

## 1. Contexto: por que esse trabalho

### Estado atual

Hoje, abrir `https://pgd-portal-klvx64dufq-rj.a.run.app/` redireciona direto para `/auth/login/google` (OAuth do MGI). Não há:
- Página pública contando o que é o PGD Libre
- Tela de login com identidade visual (só o OAuth do Google)
- Forma de explorar a demo sem ter conta gov.br

Detalhe técnico atual (`portal/src/routes/+layout.server.ts`): qualquer rota sem cookie `access_token` válido redireciona para o OAuth backend → callback → dashboard. Não há `/` público.

### Visão do produto

O PGD Libre é um **software livre** que qualquer órgão público brasileiro pode instalar para gerenciar seu Programa de Gestão e Desempenho. Hoje só existe a instância demo, mas o roadmap é que o projeto vire um produto adotado por dezenas de órgãos.

Precisamos comunicar isso publicamente. A **home (`/`)** deixa de ser uma rota interna de aplicação e passa a ser a **landing page institucional do produto**.

### Mudança de paradigma de IA

Antes:
- `/` = dashboard autenticado (servidor ou chefia conforme role)
- Sem auth → redirect Google

Depois:
- `/` = **landing page pública** (sem auth)
- `/login` = tela de login (Google OAuth + escolher persona demo)
- `/app` ou `/dashboard` (a definir) = home autenticada (o que hoje é `/`)
- Toda rota interna (`/meu-plano`, `/equipe`, etc.) continua exigindo auth

---

## 2. As 3 telas a desenhar

### 2.1 `/` — Landing Page do produto (NOVA, pública)

**Persona:** servidor público técnico/decisor (TI, RH, gestão) de outro órgão pesquisando soluções para implementar PGD; jornalista; cidadão curioso. **Pública, indexável.**

**Estrutura sugerida (validar com você):**

- **Hero**: nome do produto + tagline curta + 2 CTAs ("Ver demo" → `/login?demo=true` | "GitHub" → repo público)
- **Por que existe**: 1 parágrafo conectando ao Decreto 11.072/2022 e à IN 24/2023
- **Benefícios principais** (~4 cards):
  - Pactuação bilateral entre servidor e chefia (alinhado à lei)
  - Auditoria automática de todas as ações
  - Integração com a API PGD Central (MGI) — interoperabilidade fora da caixa
  - Conformidade automatizada com normativos
- **Como funciona** (~3-4 passos visuais): servidor cria → chefia revisa/assina → execução → avaliação
- **Para quem é** (~3 personas): gestores de PGD em órgãos, áreas de TI implantando, servidores e chefias
- **Stack técnica** (badge row): SvelteKit / FastAPI / PostgreSQL / GraphQL / Open Source / Software Livre / etc.
- **Footer institucional**: link para docs (`https://pgdgovbr.github.io/docs/`), GitHub (`https://github.com/pgdgovbr`), licença, ato de autorização MGI

**Tom**: institucional sóbrio mas não burocrático. Pode ter pitadas de "Brasil tech público" sem ser cringe. Referência visual: gov.br Design System, mas adaptado — não precisa ser igual.

**Decisão a tomar com você**: usar identidade visual gov.br (azul/amarelo institucional) ou criar paleta própria do PGD Libre que dialogue mas se diferencie? **Sugestão:** paleta própria (já temos azul `#0F3D8C` como `--c-primary` no portal) — torna o produto reconhecível mesmo em demos não-MGI.

### 2.2 `/login` — Tela de login com 3 caminhos (NOVA, pública)

Substituir o redirect direto para `/auth/login/google` por uma tela com identidade visual do PGD Libre.

**3 caminhos visíveis:**

1. **Entrar com Gov.br** (botão primário, oficial)
2. **Entrar com Google** (botão secundário — disponível mas menos destacado)
3. **Explorar como demo** (caminho separado, claramente "isso é demo"):
   - Card destacado abaixo dos botões oficiais
   - Lista de **personas do seed** (Marta, Lucas, Felipe, Ana, Carlos, Beatriz, Maria Fernanda, Roberto) com:
     - Avatar + nome + role
     - 1 linha de contexto ("Servidora sem plano — pode criar do zero")
     - Botão "Entrar como [Nome]"
   - Banner amarelo: _"Você está entrando em uma instância de demonstração. Dados podem ser resetados a qualquer momento."_

**Tecnicamente** isso aciona o endpoint `POST /auth/dev-login?email=...&name=...&role=...` que já existe no backend.

**Detalhe importante**: o **acesso via demo só está disponível em instâncias de demonstração** (controlado por env var `PUBLIC_DEMO_MODE=true` ou similar). Numa instância de produção de um órgão real, esse card de demo não aparece.

Quando vier de `/?demo=true` (botão "Ver demo" da landing), pular as opções oficiais e ir direto à grade de personas.

### 2.3 `/app` (ou nome a definir) — Dashboard autenticado

Não há trabalho novo de design aqui — é o **dashboard atual que vive em `/`**. Apenas precisa **mover** para uma nova rota.

Decisão de URL:
- **Opção A**: `/app` (claro que é a app)
- **Opção B**: `/dashboard` (descritivo)
- **Opção C**: `/painel` (PT-BR)

**Sugestão**: `/app` (curto, técnico, claro). Decida com você.

---

## 3. Comportamento da navegação

| Estado | Acessa `/` | Acessa `/login` | Acessa `/app` |
|---|---|---|---|
| Não autenticado | Landing pública | Tela de login | Redirect para `/login?next=/app` |
| Autenticado | Landing pública (mas TopNav mostra "Entrar no app") | Redirect para `/app` | Dashboard normal |

A landing **não força redirect** se você estiver autenticado — é pública sempre. Mas mostra um CTA "Entrar no app" no header se já tem sessão.

---

## 4. Componentes existentes a reutilizar

- `TopNav.svelte` — adaptar para 2 modos: "público" (landing) e "autenticado" (app)
- Tokens CSS (`portal/src/app.css`) — paleta já tem `--c-primary`, `--c-success`, etc.
- `Icon.svelte` — biblioteca de ícones disponível
- Tipografia: Public Sans (display) + Manrope (body) já configuradas

---

## 5. Componentes novos prováveis

- `HeroBanner.svelte` — bloco principal da landing
- `BenefitCard.svelte` — cards de benefícios
- `ProcessSteps.svelte` — diagrama de passos do fluxo
- `LoginCard.svelte` — agrupa os 3 caminhos de entrada
- `PersonaSelector.svelte` — grade de personas demo
- `FooterInstitucional.svelte` — footer com links

---

## 6. Personas do seed (para a tela de demo)

| Email dev-login | Nome | Role | Contexto |
|---|---|---|---|
| `servidor7@pgd-demo.gov.br` | Marta Silva | servidor | Sem plano — pode criar do zero |
| `servidor4@pgd-demo.gov.br` | Lucas Ramos | servidor | Plano em rascunho (editando) |
| `servidor6@pgd-demo.gov.br` | Felipe Costa | servidor | Chefia ajustou — aguarda assinatura dele |
| `servidor1@pgd-demo.gov.br` | Ana Silva | servidor | Plano em execução; tem plano anterior para clonar |
| `servidor2@pgd-demo.gov.br` | João Santos | servidor | Avaliação aguardando + convocação pendente |
| `servidor3@pgd-demo.gov.br` | Carla Mendes | servidor | Avaliação nota 2; afastamento encerrado |
| `chefe1@pgd-demo.gov.br` | Carlos Souza | chefe_imediato | Tem recurso pendente para responder |
| `chefe2@pgd-demo.gov.br` | Beatriz Lima | chefe_imediato | Plano do Pedro aguardando assinatura dela |
| `gestor@pgd-demo.gov.br` | Maria Fernanda | gestor_unidade | Pode aprovar Plano de Entregas da CGTI |
| `admin@pgd-demo.gov.br` | Roberto Admin | admin | Vê todos os erros de sync com API Central |

**Sugestão de UX** na grade de personas: agrupar por role (Servidores / Chefias / Gestor / Admin) ou destacar 2-3 "começar por aqui" (Marta = começa do zero, Carlos = vê fluxo de chefia, Maria Fernanda = vê gestor).

---

## 7. Decisões de UX a validar com você

1. **Identidade visual**: paleta gov.br oficial ou própria do PGD Libre? (recomendo: própria, derivada do `--c-primary`)
2. **URL da app autenticada**: `/app`, `/dashboard`, `/painel`?
3. **Hero da landing**: estática, animada, vídeo curto, mockup do produto?
4. **Mostrar screenshots reais na landing?** Já temos vários em `pgdgovbr/docs/docs/assets/screenshots/` — desktop e mobile.
5. **Grade de personas**: cards visuais com avatares, ou tabela mais densa?
6. **OAuth Google**: manter como opção visível ou só Gov.br como oficial?
7. **Banner "instância demo"**: persistente em todas as rotas internas, ou só no login?

---

## 8. Referências cruzadas no projeto

### Repos (você terá acesso ao monorepo completo `pgdgovbr/`)

- `portal/` — frontend SvelteKit (foco do trabalho)
- `portal/_design/from-claude-design/` — bundle do design anterior (pactuação bilateral). Reutilize `tokens.css`, `ui.jsx`, padrões.
- `portal/_design/handoff-workflow-pactuacao-pt.md` — handoff anterior (referência de formato)
- `portal/src/app.css` — tokens em produção; usar como source-of-truth de paleta
- `pgd-libre/` — backend FastAPI. Endpoint `POST /auth/dev-login` é a base do "Explorar como demo"
- `pgd-libre/_legislacao/` — decretos e INs (úteis para o discurso da landing)
- `pgd-libre/_projeto/` — specs e requisitos funcionais (úteis para entender o produto)
- `docs/` — documentação de usuário publicada em https://pgdgovbr.github.io/docs/ (linkar no footer)
- `docs/docs/assets/screenshots/` — ~35 capturas do produto, desktop e mobile, prontas para usar em hero/galeria
- `docs/product-brief.md` — descrição alta do produto (caso ajude no copy)

### URLs em produção

- Portal (app): https://pgd-portal-klvx64dufq-rj.a.run.app
- Backend: https://pgd-libre-klvx64dufq-rj.a.run.app
- Docs: https://pgdgovbr.github.io/docs/
- GitHub org: https://github.com/pgdgovbr

### Conteúdo institucional para a landing

- Decreto 11.072/2022 (institui o PGD): `pgd-libre/_legislacao/decreto-11072-2022.md`
- IN 24/2023 (operacional): `pgd-libre/_legislacao/in-conjunta-seges-sgprt-mgi-24-2023.md`
- IN 52/2023 (gestão de pessoas): `pgd-libre/_legislacao/in-conjunta-sgp-srt-seges-mgi-52-2023.md`

---

## 9. Fora do escopo

- Backend novo: o `dev-login` já existe, não precisa criar mutation/endpoint nada
- TopNav autenticado: já existe e funciona, só pode receber pequenos ajustes
- Conteúdo das páginas internas do app: não muda nada
- i18n: por enquanto só PT-BR

---

## 10. Restrições técnicas

- **SvelteKit 2 + Svelte 5 runes** (`$state`, `$derived`, `$props()`)
- **adapter-node** — sem dependência de serverless
- **WCAG AA** — landing precisa ser indexável e acessível (incluindo SSR para SEO)
- **Performance**: landing precisa carregar < 2s LCP. Imagens otimizadas, sem JS pesado no fold inicial.
- **Sem libs novas pesadas** — usar o que já está no projeto
- **Tipografia e paleta**: usar as variáveis já em `portal/src/app.css` — não introduzir fontes novas sem justificar
- **`PUBLIC_DEMO_MODE`**: nova env var para esconder o card de personas em produção real (default `true` para instância demo)

---

## 11. O que entregar

1. **Mockups** das 3 telas (`/`, `/login`, alterações em `TopNav`) — desktop primeiro, mobile como segundo passo
2. **Componentes novos** (lista da §5) com mockup de cada
3. **Recomendações sobre as 7 decisões de UX** (§7)
4. **Copy completo da landing** (ou esqueleto) — pode pedir ajuste depois, mas precisa ter um draft
5. **Tokens CSS adicionais** se precisar (ex: cores para badges de roles na grade de personas)
6. **Especificação de SEO** (meta tags, OpenGraph, structured data)

Formato: HTML estático (como você costuma fazer) ou Figma — escolha o que for mais ágil.

---

## 12. Prioridade

Esta é a próxima evolução grande do portal depois do workflow de pactuação bilateral (já em produção). É a primeira coisa que qualquer pessoa nova vai ver — então tem peso de "primeira impressão do produto".

Pode levar o tempo que precisar para fazer bem. Sem deadline rígido — qualidade > velocidade.
