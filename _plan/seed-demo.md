# Plano — Seed de Dados para Demo do PGD Libre

## Contexto

O frontend e backend estão implementados e funcionando. Para disponibilizar uma instância de demonstração pública, precisamos de dados realistas que cubram todos os módulos e que permitam executar as principais jornadas de cada papel de usuário. A instância fará reset automático toda madrugada.

---

## 1. Estrutura Organizacional

Uma única hierarquia fictícia, inspirada em ministérios reais:

```
UnidadeAutorizadora: MGI (Ministério da Gestão e da Inovação)
  └── UnidadeInstituidora: SEGES (Secretaria de Gestão e Inovação)
        ├── UnidadeExecucao A: CGPGD (Coord-Geral de PGD)    ← Team principal
        └── UnidadeExecucao B: CGTI  (Coord-Geral de TI)     ← Team secundário
```

Dois teams permitem demonstrar contribuições tipo 3 (cross-unit) nos PlanoTrabalho.

---

## 2. Personas (Usuários)

| Email (dev-login) | Nome | Papel | Team |
|---|---|---|---|
| servidor1@pgd-demo.gov.br | Ana Silva | servidor | CGPGD |
| servidor2@pgd-demo.gov.br | João Santos | servidor | CGPGD |
| servidor3@pgd-demo.gov.br | Carla Mendes | servidor | CGPGD |
| servidor4@pgd-demo.gov.br | Lucas Ramos | servidor | CGPGD (sem PT) |
| servidor5@pgd-demo.gov.br | Pedro Alves | servidor | CGTI |
| chefe1@pgd-demo.gov.br | Carlos Souza | chefe_imediato | CGPGD |
| chefe2@pgd-demo.gov.br | Beatriz Lima | chefe_imediato | CGTI |
| gestor@pgd-demo.gov.br | Maria Fernanda | gestor_unidade | SEGES |
| admin@pgd-demo.gov.br | Roberto Admin | admin | — |

---

## 3. Matriz de Jornadas × Estados

### 3.1 Jornadas do Servidor

| Jornada | Estado dos dados necessário |
|---|---|
| Ver dashboard com plano ativo | PlanoTrabalho status=3 (em execução) |
| Registrar execução do mês atual | AvaliacaoRegistrosExecucao sem data_registro_participante |
| Ver avaliação recebida (nota 3 - adequado) | ARE avaliada, encerrada |
| Contestar avaliação (nota 4) | ARE avaliada nota 4, dentro da janela de 10 dias |
| Ver histórico de períodos anteriores | 2 AREs encerradas de períodos passados |

### 3.2 Jornadas do Chefe Imediato

| Jornada | Estado dos dados necessário |
|---|---|
| Ver lista da equipe | 3 participantes ativos em CGPGD |
| Avaliar registro pendente | ARE registrada pelo servidor sem avaliação do chefe |
| Responder recurso | ARE com recurso_texto preenchido, aguardando decisão |
| Ver PlanoEntregas da equipe | PlanoEntregas status=3 (em execução) |
| Ver detalhe de um PlanoTrabalho | PlanoTrabalho status=3 com contribuições |
| Criar novo PlanoTrabalho | Participante ativo sem PlanoTrabalho vigente (Lucas) |
| Emitir convocação | Participante TT integral (João) sem convocação recente |

### 3.3 Jornadas do Gestor

| Jornada | Estado dos dados necessário |
|---|---|
| Ver dashboard com KPIs consolidados | Múltiplos planos e participantes |
| Aprovar PlanoEntregas pendente | PlanoEntregas status=2 (aguardando nivel_superior) |
| Ver painel de conformidade | RegistroEnvioAPI com status misto (ok + erro) |
| Ver relatório "Sem plano de trabalho" | Participante ativo sem PlanoTrabalho (Lucas) |
| Ver afastamentos da equipe | Afastamentos registrados (Carla) |

### 3.4 Jornadas do Admin

| Jornada | Estado dos dados necessário |
|---|---|
| Ver lista de participantes | Todos os participantes |
| Ver log de sincronização API | RegistroEnvioAPI com histórico |
| Ver configuração institucional | UnidadeInstituidora com todos os campos |
| Ver notificações do sistema | Notificacoes geradas pelos eventos acima |

---

## 4. Mapa de Estados por Entidade

```
PlanoEntregas (CGPGD):  status=3  ← em execução, aprovado por gestor
PlanoEntregas (CGTI):   status=2  ← aguardando aprovação do gestor  ← jornada do gestor

PlanoTrabalho (Ana):    status=3  ← em execução
  ARE período -2:       encerrada, nota=3 (adequado)
  ARE período -1:       nota=4 (inadequado), recurso aberto  ← contestação + chefe responde
  ARE período atual:    sem registro  ← Ana pode registrar agora

PlanoTrabalho (João):   status=3  ← em execução
  ARE período -1:       registrado pelo servidor, sem avaliação do chefe  ← chefe avalia
  ARE período atual:    sem registro
  TCR:                  ativo, modalidade TT integral
  Convocacao:           1 pendente  ← chefe emitiu, João ainda não atendeu

PlanoTrabalho (Carla):  status=3  ← em execução
  Afastamento:          ferias (período passado), encerrado
  ARE período -1:       encerrada, nota=2 (alto desempenho)

PlanoTrabalho (Pedro):  status=2  ← aprovado, não iniciado  ← novo para CGTI

Lucas:                  participante sem PlanoTrabalho  ← chefe pode criar

RegistroEnvioAPI:       5 ok (Ana, João, Carla, PE_CGPGD) + 3 erros (Pedro)
Notificacoes:           avaliacao_realizada (Ana), recurso_aberto (Carlos),
                        prazo_registro_iminente (João), convocacao_emitida (João),
                        plano_aprovado (Carla)
```

---

## 5. Script de Seed

**Localização:** `pgd-libre/pgd-libre/scripts/seed_demo.py`

**Execução:**
```bash
# Local (com venv)
cd pgd-libre/pgd-libre && source .venv/bin/activate && python scripts/seed_demo.py

# Via Docker
docker exec pgd-libre-app-1 python scripts/seed_demo.py
```

---

## 6. Reset Diário

**Dev local (crontab):**
```cron
0 3 * * * docker exec pgd-libre-app-1 python scripts/seed_demo.py >> /tmp/pgd-seed.log 2>&1
```

**Produção:** Cloud Scheduler → endpoint `/admin/reset-demo` (a implementar no deploy).

---

## 7. Documentação gerada

| Arquivo | Propósito |
|---|---|
| `docs/jornadas-demo.md` | Roteiro clique a clique por papel — base para tutoriais e guias |
| `docs/product-brief.md` | Briefing para slides, landing page e vídeo demo |
