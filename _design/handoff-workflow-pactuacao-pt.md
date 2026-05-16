# Handoff de Design — Workflow de Pactuação Bilateral do Plano de Trabalho

> **Para o Claude Design.** Este documento é o briefing da próxima evolução de UX do PGD Libre. Você já conhece o sistema atual (foi você quem desenhou as telas existentes). Aqui descrevo **o que muda, por quê e quais decisões precisam do seu olhar**. Considere ler primeiro os arquivos referenciados na seção "Referências" antes de propor mockups.

---

## 1. Contexto: por que esse trabalho

### Mudança de paradigma

Hoje no PGD Libre, o **Plano de Trabalho (PT) é uma tela só da chefia**: ela usa um wizard de 5 passos em `/equipe/planos-trabalho/novo`, o plano nasce em `APROVADO`, vira `EM_EXECUCAO` quando a chefia clica, e o servidor só vê pronto em `/meu-plano`.

Isso está fora da legislação e da prática real.

### Base legal

- **Decreto 11.072/2022, Art. 11:** _"Para aderir ao PGD, o agente público e a sua chefia imediata **firmarão plano de trabalho**…"_ (firma bilateral)
- **IN Conjunta SEGES-SGPRT/MGI nº 24/2023, Art. 19:** _"O plano de trabalho […] **será pactuado** entre o participante e a sua chefia da unidade de execução…"_ (pactuação explícita)

Arquivos completos:
- `/Users/nitai/dev/destaquesgovbr/pgdgovbr/pgd-libre/_legislacao/decreto-11072-2022.md`
- `/Users/nitai/dev/destaquesgovbr/pgdgovbr/pgd-libre/_legislacao/in-conjunta-seges-sgprt-mgi-24-2023.md`

### Decisão de produto

1. **Servidor é o criador padrão do PT.** A chefia também pode criar, mas é exceção (servidor recém-chegado, indisponibilidade, etc.)
2. **PT existe como rascunho** com edição livre antes da pactuação
3. **Pactuação = dupla assinatura** (espelha o padrão do TCR que já existe)
4. **"Passa a bola"**: a cada momento o PT pertence a um lado só. Quem está com a bola pode editar **ou** assinar; o outro só visualiza
5. **Edição derruba assinaturas**: se alguém edita após o outro já ter assinado, a assinatura do outro cai e ele precisa reassinar
6. **Histórico de edições visível** desde a criação até a pactuação — para o outro lado entender "o que mudou desde minha última leitura"
7. **Clonar PT antigo** — atalho para reaproveitar contribuições/critérios de um plano anterior só mudando as datas

---

## 2. Personas e mudança de fluxo

### Antes (atual)

| Quem | O que faz |
|---|---|
| Chefia (`chefe_imediato`) | Acessa `/equipe/planos-trabalho/novo`, percorre wizard de 5 passos, cria PT. PT vai direto para `EM_EXECUCAO`. |
| Servidor (`servidor`) | Acessa `/meu-plano`, vê PT readonly, registra execução mensal. **Não tem voz na criação.** |

### Depois (proposto)

| Quem | O que faz |
|---|---|
| **Servidor** (caso padrão) | Em `/meu-plano`, clica em "Criar plano de trabalho" → preenche → assina → envia para chefia. Pode também "Clonar plano anterior" para acelerar. |
| **Chefia** (caso padrão) | Recebe notificação "Plano aguardando sua assinatura". Revisa. Se discorda, **ajusta** (assinatura do servidor cai) e devolve. Se concorda, **assina** → PT vira `EM_EXECUCAO`. |
| **Chefia** (caso exceção) | Pode também criar PT para um servidor que ainda não conseguiu. Mesma jornada, com papéis invertidos: cria → assina → envia para servidor. |

---

## 3. Modelo de estados (passa a bola)

```
                         ┌─────────────────────────────┐
                         │  Sem PT (servidor sem plano) │
                         └──────────────┬──────────────┘
                                        │
                  servidor cria          │           chefia cria (exceção)
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                                ▼                                ▼
┌──────────────────┐               ┌─────────────────┐
│   RASCUNHO       │               │   RASCUNHO      │
│   PARTICIPANTE   │               │   CHEFIA        │
│   (bola: serv.)  │               │   (bola: chefia)│
└────────┬─────────┘               └────────┬────────┘
         │                                  │
   servidor assina                    chefia assina
   e envia                            e envia
         │                                  │
         ▼                                  ▼
┌────────────────────────┐         ┌─────────────────────────┐
│  AGUARDANDO_ASSINATURA │         │  AGUARDANDO_ASSINATURA  │
│  DA CHEFIA             │         │  DO PARTICIPANTE        │
│  (bola: chefia)        │         │  (bola: servidor)       │
└────────┬───────────────┘         └────────┬────────────────┘
         │                                  │
         │ chefia ajusta                    │ servidor ajusta
         │ (zera assinaturas)               │ (zera assinaturas)
         │ ↪ vira RASCUNHO_CHEFIA           │ ↪ vira RASCUNHO_PARTICIPANTE
         │                                  │
         │ chefia assina                    │ servidor assina
         ▼                                  ▼
                  ┌──────────────────┐
                  │   EM_EXECUCAO    │
                  │ (ambos assinaram │
                  │  a mesma versão) │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │    CONCLUIDO     │
                  └──────────────────┘
```

**Estados também terminais:**
- `CANCELADO` (dono pode cancelar em qualquer rascunho/aguardando; só chefia cancela em `EM_EXECUCAO`)

### Quem pode o quê em cada estado

| Estado | Servidor pode | Chefia pode |
|---|---|---|
| `RASCUNHO_PARTICIPANTE` | editar, assinar+enviar, cancelar | visualizar (readonly) |
| `AGUARDANDO_ASSINATURA_CHEFIA` | visualizar (readonly) | assinar, ajustar (→ rascunho chefia), cancelar |
| `RASCUNHO_CHEFIA` | visualizar (readonly) | editar, assinar+enviar, cancelar |
| `AGUARDANDO_ASSINATURA_PARTICIPANTE` | assinar, ajustar (→ rascunho participante), cancelar | visualizar (readonly) |
| `EM_EXECUCAO` | registrar execução, ver avaliações | avaliar, cancelar |
| `CONCLUIDO` | visualizar (readonly) | visualizar (readonly) |

### Regra de ouro

> **Quem está com a bola sabe que está com a bola.** A UI precisa deixar isso óbvio em qualquer tela do PT, com banner persistente.

---

## 4. Inventário de telas

### Telas existentes (com mudanças)

| Rota atual | Screenshot | O que muda |
|---|---|---|
| `/meu-plano` | `docs/docs/assets/screenshots/servidor/meu-plano.png` | Quando servidor não tem PT ativo, mostrar CTA primário **"Criar plano de trabalho"** + (se houver histórico) opção **"Clonar plano anterior"**. Quando tem PT em rascunho/aguardando, mostrar status com banner "Passa a bola". |
| `/equipe/planos-trabalho/novo` | `chefia/criar-plano-passo1.png`, `criar-plano-contribuicoes.png`, `criar-plano-confirmacao.png` | **Re-enfatizar como exceção.** Adicionar tela introdutória explicando que o padrão é o servidor criar. O wizard em si pode continuar como está. |
| `/equipe/planos-trabalho/[id]` | _não temos screenshot_ | Adicionar painel persistente "Aguardando minha assinatura" quando status = `AGUARDANDO_ASSINATURA_CHEFIA`. Mostrar histórico de edições. |
| `/equipe` | `chefia/minha-equipe.png` | Servidores com PT aguardando assinatura da chefia precisam de badge destacado (similar ao "Recurso aberto" atual). |

### Telas novas

| Rota nova | Para quem | Propósito |
|---|---|---|
| `/meu-plano/criar` | servidor | Wizard/form para criar PT pela primeira vez |
| `/meu-plano/[id]/editar` | servidor | Edição do PT em rascunho ou pós-ajuste (estados `RASCUNHO_PARTICIPANTE`) |
| `/meu-plano/[id]/revisar` | servidor | Visualização + decisão (assinar ou ajustar) quando bola está com servidor (`AGUARDANDO_ASSINATURA_PARTICIPANTE`) |
| `/meu-plano/[id]/clonar` | servidor | Clonar PT concluído com novas datas (pode ser modal sobre `/meu-plano`) |
| `/equipe/planos-trabalho/[id]/editar` | chefia | Mesmo que `/meu-plano/[id]/editar`, do lado da chefia, para PT em `RASCUNHO_CHEFIA` |
| `/equipe/planos-trabalho/[id]/revisar` | chefia | Mesmo que `/meu-plano/[id]/revisar`, do lado da chefia, para PT em `AGUARDANDO_ASSINATURA_CHEFIA` |

---

## 5. Componentes — reutilizar e criar

### Reutilizar (já existem em `portal/src/lib/components/`)

| Componente | Onde usar |
|---|---|
| `Stepper.svelte` | Wizard de criação (servidor e chefia) |
| `StatusBadge.svelte` | **Precisa expandir** com 3 novos status: `RASCUNHO_*`, `AGUARDANDO_ASSINATURA_*` |
| `StatusTimeline.svelte` | Histórico de edições (eventos audit) — encaixe perfeito |
| `UrgencyPill.svelte` | "Aguardando há X dias" no banner de ownership |
| `Icon.svelte` | Ícones em geral |
| `TopNav.svelte` | Sem mudanças |
| `ModalidadeBadge.svelte`, `NotaBadge.svelte`, `NotaSelector.svelte` | Sem mudanças |

### Novos a desenhar

#### 5.1 `OwnershipBanner.svelte`

Barra persistente no topo da tela de detalhe/edição/revisão do PT. Comunica em quem está a bola.

**Estados a desenhar:**

```
┌─────────────────────────────────────────────────────────────┐
│  📝  Este plano está com você para ajustes                  │  ← bola comigo (editor)
│      Você pode editar livremente. Quando terminar,           │
│      assine e envie para [chefia/servidor].                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ⏳  Aguardando sua assinatura                              │  ← bola comigo (revisor)
│      [Outro lado] enviou este plano há 2 dias.               │
│      [ Ver o que mudou ] [ Assinar ] [ Ajustar ]            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📤  Plano enviado para [chefia/servidor]                   │  ← bola com outro lado
│      Aguardando assinatura há 1 dia.                         │
│      Você pode acompanhar mas não editar até receber de      │
│      volta.                                                  │
└─────────────────────────────────────────────────────────────┘
```

Variações por estado:
| Status | Mensagem |
|---|---|
| `RASCUNHO_PARTICIPANTE` (servidor vê) | "Este plano está com você para ajustes" |
| `RASCUNHO_PARTICIPANTE` (chefia vê) | "[Servidor] está elaborando este plano" (readonly) |
| `RASCUNHO_CHEFIA` (chefia vê) | "Este plano está com você para ajustes" |
| `RASCUNHO_CHEFIA` (servidor vê) | "[Chefia] está preparando seu plano" (readonly) |
| `AGUARDANDO_ASSINATURA_CHEFIA` (chefia vê) | "Aguardando sua assinatura" |
| `AGUARDANDO_ASSINATURA_CHEFIA` (servidor vê) | "Plano enviado para a chefia" |
| `AGUARDANDO_ASSINATURA_PARTICIPANTE` (servidor vê) | "Aguardando sua assinatura" |
| `AGUARDANDO_ASSINATURA_PARTICIPANTE` (chefia vê) | "Plano enviado para o servidor" |

#### 5.2 `EdicoesTimeline.svelte`

Histórico de edições desde a criação até a pactuação. Cada item: timestamp, autor (nome + role), ação ("Criou plano", "Editou contribuição X", "Assinou", "Devolveu para ajustes"). Quando a entrada é uma edição com diff, item expansível mostra os campos antes/depois.

Pode reaproveitar visual de `StatusTimeline.svelte` que já existe.

**Decisão de UX a validar:** mostrar diff inline (campo por campo) ou só "X campos alterados" com link "ver detalhes"?

#### 5.3 `AssinaturaCard.svelte`

Card destacado na tela de revisão (`/meu-plano/[id]/revisar` ou equivalente da chefia). Conteúdo:

```
┌─────────────────────────────────────────────────────────────┐
│  ✓  Antes de assinar, confirme:                             │
│                                                              │
│  • Li o plano completo (período, contribuições, critérios)  │
│  • Concordo com as atividades e percentuais propostos       │
│  • Estou ciente das declarações de ausência de prejuízo     │
│                                                              │
│  [ 🖊️  Assinar e ativar plano ]                             │
│                                                              │
│  Não concordo? [ Devolver para ajustes ]                    │
└─────────────────────────────────────────────────────────────┘
```

Após click em "Assinar": confirmação inline (ou modal) com nome + data. Após click em "Devolver para ajustes": abre tela de edição com banner explicando que assinaturas serão zeradas.

#### 5.4 `CloneDialog.svelte`

Modal simples acionado por "Clonar plano anterior" em `/meu-plano`.

```
┌─────────────────────────────────────────────────────────────┐
│  Clonar plano "PT-2025-08-001"                              │
│                                                              │
│  Vamos criar um novo plano copiando:                         │
│    • Modalidade de execução                                  │
│    • Critérios de avaliação                                  │
│    • Contribuições e percentuais                             │
│                                                              │
│  Você poderá ajustar antes de enviar para a chefia.          │
│                                                              │
│  📅 Data de início    [_____________]                        │
│  📅 Data de término   [_____________]                        │
│                                                              │
│  [ Cancelar ]                       [ Clonar e editar ]      │
└─────────────────────────────────────────────────────────────┘
```

Após confirmar: cria PT em `RASCUNHO_PARTICIPANTE` e redireciona para `/meu-plano/[novo_id]/editar`.

---

## 6. Decisões de UX a validar

Pontos onde queremos seu input antes de implementar:

1. **Edição: wizard ou form único?**
   - Hoje a chefia usa wizard de 5 passos. Pós-criação, faz mais sentido uma tela única com todas as seções editáveis inline (save automático debounced).
   - **Sugestão:** wizard só na **primeira criação** (servidor não conhece o sistema); pós-criação, tela única.
   - Pergunta: vale ter o wizard reabrindo a cada "Ajustar"? Ou só a tela única?

2. **Como sinalizar o diff entre versões?**
   - Inline (cada campo destaca "antes / agora") × timeline com entradas expansíveis × side-by-side
   - O que combina mais com o resto do sistema?

3. **"Cancelar plano" em rascunho** — destaque ou menu de overflow?
   - É destrutivo mas reversível (servidor pode criar de novo). Sugestão: menu overflow para evitar cliques acidentais.

4. **Metáfora visual de "passa a bola"**
   - Ícones (📝 → 📤 → ⏳ → ✓)? Cores de fundo do banner por estado? Mascote?
   - O design atual tem identidade sóbria/governamental — buscar metáfora que respeite o tom.

5. **Wizard de criação pelo servidor**
   - Reaproveitar os 5 passos da chefia ou simplificar?
   - Servidor pode não conhecer "modalidade", "carga horária disponível" — precisamos de tooltips/ajuda contextual?

6. **Estado vazio de `/meu-plano` para servidor novo**
   - Hoje mostra "Solicite à sua chefia". Agora vira "Crie seu plano" + "Clonar plano anterior" (se houver).
   - Como destacar a primeira vez? Onboarding inline?

7. **Notificação de "plano recebido"**
   - Banner no dashboard? Toast? Sino com badge?
   - Sugestão: combinar — sino com badge (já existe) + card destacado no dashboard.

---

## 7. Referências de código e mockups atuais

### Código atual (frontend)

| Arquivo | O que tem |
|---|---|
| `portal/src/lib/types.ts` | Enums atuais (`StatusPlano` precisa ser expandido) |
| `portal/src/lib/components/` | Componentes reutilizáveis (Stepper, StatusBadge, StatusTimeline, etc.) |
| `portal/src/routes/equipe/planos-trabalho/novo/+page.svelte` | Wizard de 5 passos da chefia (671 linhas — referência para o novo wizard do servidor) |
| `portal/src/routes/meu-plano/+page.svelte` | Tela atual do servidor (255 linhas) |
| `portal/src/routes/equipe/planos-trabalho/[id]/+page.svelte` | Detalhe do PT na chefia |

### Screenshots (renderização atual)

- `docs/docs/assets/screenshots/servidor/meu-plano.png` — tela do servidor hoje
- `docs/docs/assets/screenshots/chefia/criar-plano-passo1.png` — wizard atual, passo 1
- `docs/docs/assets/screenshots/chefia/criar-plano-contribuicoes.png` — wizard atual, contribuições
- `docs/docs/assets/screenshots/chefia/criar-plano-confirmacao.png` — wizard atual, confirmação
- `docs/docs/assets/screenshots/servidor/avaliacao-detalhe.png` — referência de estilo de "card grande + detalhes em colunas"
- `docs/docs/assets/screenshots/servidor/notificacoes.png` — estilo das notificações

### Padrão visual de assinatura — TCR (referência)

O TCR já tem padrão de dupla assinatura no backend, mas **não tem tela dedicada**. Estamos criando o padrão visual aqui. Você pode aproveitar para sugerir que o TCR no futuro use o mesmo design system.

### Plano técnico completo

`/Users/nitai/dev/destaquesgovbr/pgdgovbr/_plan/workflow-pactuacao-pt.md` — descreve a parte backend (modelo, services, mutations) e como o frontend integra. Útil para entender quais mutations GraphQL estarão disponíveis.

---

## 8. Fora do escopo deste handoff

Não mexer (ou mexer só se for trivial):

- Telas de **avaliação e recurso** — recém-implementadas, sem mudanças
- Telas de **conformidade** (`/conformidade`) — sem mudanças
- Telas de **relatórios** (`/relatorios`) — sem mudanças
- Telas de **admin** (`/admin/*`) — sem mudanças
- TopNav, layout geral, identidade visual — manter

---

## 9. O que entregar

Para podermos seguir com a implementação no frontend (Fase B do plano):

1. **Mockups das telas novas** (`/meu-plano/criar`, `/meu-plano/[id]/editar`, `/meu-plano/[id]/revisar`) — desktop primeiro, mobile como segundo passo
2. **Mockups dos componentes novos** (`OwnershipBanner` em todos os estados, `EdicoesTimeline`, `AssinaturaCard`, `CloneDialog`)
3. **Wireframe da mudança em `/meu-plano`** (CTA "Criar plano" no estado vazio + "Clonar" no histórico)
4. **Wireframe das pequenas mudanças em `/equipe/planos-trabalho/[id]` e `/equipe`** (badges + banner)
5. **Recomendações sobre as 7 decisões de UX** (seção 6)
6. **Especificação do StatusBadge expandido** — cores, ícones, ordem visual dos 3 novos estados

Formato: pode ser HTML estático (como você costuma fazer), Figma link, ou markdown + descrições. O que for mais ágil para você.

---

## 10. Restrições técnicas

- **SvelteKit 2 + Svelte 5 (runes obrigatório).** Nada de `export let`, sempre `$state`/`$derived`/`$props()`.
- **adapter-node** — sem dependência de plataformas serverless.
- **A11y é requisito do governo** — manter contraste WCAG AA, navegação por teclado, labels em todos os controles.
- **Sem libs novas pesadas** — usar o que já está no projeto (Motion, Lucide via Icon component, CSS variables existentes em `src/app.css`).
- **Tipografia e cores atuais devem ser preservadas** (são parte da identidade gov.br adaptada).
