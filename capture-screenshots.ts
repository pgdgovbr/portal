/**
 * Captura screenshots das telas principais do PGD Libre para uso na documentação.
 * Requer: backend em localhost:8000 e frontend em localhost:5173 (com seed_demo.py rodado).
 *
 * Execução: npx tsx capture-screenshots.ts
 * Output:   ../docs/docs/assets/screenshots/{role}/{tela}.png
 */
import { chromium, type Page, type BrowserContext } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BACKEND = 'http://localhost:8000';
const FRONTEND = 'http://localhost:5173';
const OUT = path.resolve(__dirname, '../docs/docs/assets/screenshots');
const MOBILE_VIEWPORT = { width: 390, height: 844 } as const;

// Seed personas (CLAUDE.md)
const PERSONAS = {
  servidor1:  { email: 'servidor1@pgd-demo.gov.br', name: 'Ana Silva',       role: 'servidor' },
  servidor2:  { email: 'servidor2@pgd-demo.gov.br', name: 'João Santos',     role: 'servidor' },
  servidor3:  { email: 'servidor3@pgd-demo.gov.br', name: 'Carla Mendes',    role: 'servidor' },
  servidor4:  { email: 'servidor4@pgd-demo.gov.br', name: 'Lucas Ramos',     role: 'servidor' },
  servidor5:  { email: 'servidor5@pgd-demo.gov.br', name: 'Pedro Alves',     role: 'servidor' },
  servidor6:  { email: 'servidor6@pgd-demo.gov.br', name: 'Felipe Costa',    role: 'servidor' },
  servidor7:  { email: 'servidor7@pgd-demo.gov.br', name: 'Marta Silva',     role: 'servidor' },
  chefe1:     { email: 'chefe1@pgd-demo.gov.br',    name: 'Carlos Souza',    role: 'chefe_imediato' },
  chefe2:     { email: 'chefe2@pgd-demo.gov.br',    name: 'Beatriz Lima',    role: 'chefe_imediato' },
  gestor:     { email: 'gestor@pgd-demo.gov.br',    name: 'Maria Fernanda',  role: 'gestor_unidade' },
  admin:      { email: 'admin@pgd-demo.gov.br',     name: 'Roberto Admin',   role: 'admin' },
};

async function login(ctx: BrowserContext, persona: typeof PERSONAS[keyof typeof PERSONAS]) {
  const req = await ctx.request.post(`${BACKEND}/auth/dev-login`, {
    params: { email: persona.email, name: persona.name, role: persona.role },
  });
  if (!req.ok()) throw new Error(`dev-login falhou: ${req.status()} ${persona.email}`);
}

async function go(page: Page, path: string, waitFor = 'networkidle' as const) {
  await page.goto(`${FRONTEND}${path}`);
  await page.waitForLoadState(waitFor);
  await page.waitForTimeout(400); // aguarda animações finais
}

async function shot(page: Page, rel: string) {
  const full = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  await page.screenshot({ path: full, fullPage: false });
  console.log(`  ✓ ${rel}`);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

async function clickFirst(page: Page, selector: string) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 6000 });
  await el.click();
}

// ─── capturas por seção ───────────────────────────────────────────────────────

async function captureServidor(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  console.log('\n[SERVIDOR — Ana Silva]');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctx, PERSONAS.servidor1);
  const page = await ctx.newPage();

  await go(page, '/');
  await shot(page, 'servidor/dashboard.png');

  await go(page, '/meu-plano');
  await shot(page, 'servidor/meu-plano.png');

  await go(page, '/meu-plano/registrar');
  await shot(page, 'servidor/registrar-execucao.png');

  // Avaliação detalhe — ir direto ao ARE com nota 4 e recurso ABERTO (mais ilustrativo)
  const areResp = await ctx.request.post(`${BACKEND}/graphql`, {
    data: {
      query: '{ meusPlanosTrabalho { avaliacoes { id avaliacaoRegistrosExecucao statusRecurso } } }',
    },
  });
  const areJson = await areResp.json();
  const allAvals = (areJson?.data?.meusPlanosTrabalho ?? []).flatMap((p: any) => p.avaliacoes ?? []);
  const avalComRecurso = allAvals.find((a: any) => a.statusRecurso === 'ABERTO');
  const avalAvaliada = allAvals.find((a: any) => a.avaliacaoRegistrosExecucao);
  const targetAval = avalComRecurso ?? avalAvaliada;
  if (targetAval) {
    await go(page, `/meu-plano/avaliacao/${targetAval.id}`);
    await page.waitForTimeout(400);
    await shot(page, 'servidor/avaliacao-detalhe.png');
  } else {
    console.log('  ! nenhuma avaliação completa encontrada para Ana Silva');
  }

  // Notificações
  await go(page, '/notificacoes');
  await shot(page, 'servidor/notificacoes.png');

  await ctx.close();

  // Contestar avaliação — usar Carla Mendes (nota 2)
  console.log('\n[SERVIDOR — Carla Mendes — contestar]');
  const ctx3 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctx3, PERSONAS.servidor3);
  const page3 = await ctx3.newPage();

  await go(page3, '/meu-plano');
  await page3.waitForTimeout(800);
  const linkAval3 = page3.locator('a[href*="/meu-plano/avaliacao/"]').first();
  const hasAval3 = await linkAval3.count().then(c => c > 0).catch(() => false);
  if (hasAval3) {
    await linkAval3.click();
    await page3.waitForLoadState('networkidle');
    await page3.waitForTimeout(400);
    await shot(page3, 'servidor/contestar-avaliacao.png');

    // Tentar abrir página de recurso (botão "Contestar avaliação")
    const btnRecurso = page3.getByRole('link', { name: /contestar/i }).first();
    const hasBtnRec = await btnRecurso.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasBtnRec) {
      await btnRecurso.click();
      await page3.waitForLoadState('networkidle');
      await page3.waitForTimeout(400);
      await shot(page3, 'servidor/recurso-formulario.png');
    }
  } else {
    console.log('  ! avaliação não disponível — pulando contestação');
  }
  await ctx3.close();
}

async function captureChefe(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  console.log('\n[CHEFIA — Carlos Souza]');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctx, PERSONAS.chefe1);
  const page = await ctx.newPage();

  await go(page, '/');
  await shot(page, 'chefia/dashboard.png');

  await go(page, '/equipe');
  await shot(page, 'chefia/minha-equipe.png');

  // Avaliar registro: navegar para o plano de João Santos (tem ARE aguardando avaliação)
  // Plans are queried from the equipe page — click the first "Ver plano" link
  await go(page, '/equipe');
  await page.waitForTimeout(600);
  // Skip the /novo link, get the first real plan link
  const planLinks = await page.locator('a[href*="/equipe/planos-trabalho/"]')
    .filter({ hasNot: page.locator('[href*="/novo"]') })
    .all();
  if (planLinks.length > 0) {
    await planLinks[0].click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(600);

    // Screenshot da página do plano (critérios, contribuições, registros)
    await shot(page, 'chefia/avaliar-registros.png');

    // Tentar abrir modal de avaliação se houver registros
    const btnAvaliar = page.getByRole('button', { name: /avaliar este registro/i }).first();
    const hasBtn = await btnAvaliar.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasBtn) {
      await btnAvaliar.click();
      await page.waitForTimeout(500);
      await shot(page, 'chefia/avaliar-modal.png');
      await page.keyboard.press('Escape');
    }
  }

  // Perfil de um participante (Ana Silva — primeiro link da equipe)
  await go(page, '/equipe');
  await page.waitForTimeout(400);
  const partLink = page.locator('a[href*="/equipe/participantes/"]').first();
  const hasPartLink = await partLink.count().then(c => c > 0).catch(() => false);
  if (hasPartLink) {
    await partLink.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);
    await shot(page, 'chefia/participante-detalhe.png');
  }

  // Wizard: Criar Plano de Trabalho
  await captureWizard(page);

  await ctx.close();
}

async function captureAdmin(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  console.log('\n[ADMIN — Roberto Admin]');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctx, PERSONAS.admin);
  const page = await ctx.newPage();

  await go(page, '/admin/participantes');
  await shot(page, 'admin/participantes.png');

  await go(page, '/admin/institucional');
  await shot(page, 'admin/institucional.png');

  await ctx.close();
}

async function captureWizard(page: Page) {
  console.log('  [wizard criar plano]');
  await go(page, '/equipe/planos-trabalho/novo');

  // Step de exceção (pactuação bilateral): chefia precisa confirmar antes de seguir.
  // Captura desse step PRIMEIRO — vira `novo-pt-excecao.png`.
  await shot(page, 'chefia/novo-pt-excecao.png');

  // Confirmar exceção para liberar o wizard real
  const btnExcecao = page.getByTestId('btn-confirmar-excecao');
  const hasExcecao = await btnExcecao.isVisible({ timeout: 4000 }).catch(() => false);
  if (hasExcecao) {
    await btnExcecao.click();
    await page.waitForTimeout(300);
  }

  // Screenshot passo 1 (estado inicial — antes de preencher)
  await shot(page, 'chefia/criar-plano-passo1.png');

  // Preencher passo 0: selecionar primeiro servidor disponível
  const select = page.locator('select#serv-sel');
  const hasSelect = await select.isVisible({ timeout: 4000 }).catch(() => false);
  if (!hasSelect) {
    console.log('  ! select de servidor não encontrado, pulando wizard');
    return;
  }

  // Pegar primeira opção real (não o placeholder)
  const options = await select.locator('option').all();
  let servId = '';
  for (const opt of options) {
    const val = await opt.getAttribute('value');
    if (val && val !== '') { servId = val; break; }
  }
  if (!servId) {
    console.log('  ! nenhum servidor disponível para criar plano');
    return;
  }
  await select.selectOption(servId);
  await page.waitForTimeout(200);

  // Datas: início hoje, fim em 6 meses
  const hoje = new Date();
  const fim = new Date(hoje);
  fim.setMonth(fim.getMonth() + 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  await page.locator('input[type="date"]').first().fill(fmt(hoje));
  await page.locator('input[type="date"]').nth(1).fill(fmt(fim));
  await page.waitForTimeout(200);

  // Screenshot passo 1 com dados preenchidos
  await shot(page, 'chefia/criar-plano-passo1.png');

  // Avançar para passo 2 (carga horária - já tem 40h por padrão)
  await page.getByRole('button', { name: /próximo/i }).click();
  await page.waitForTimeout(300);

  // Avançar para passo 3 (critérios - já tem template padrão)
  await page.getByRole('button', { name: /próximo/i }).click();
  await page.waitForTimeout(300);

  // Avançar para passo 4 (contribuições)
  await page.getByRole('button', { name: /próximo/i }).click();
  await page.waitForTimeout(400);

  // Adicionar 2 contribuições: 70% + 30%
  async function addContrib(desc: string, pct: number) {
    await page.locator('#contrib-desc').fill(desc);
    await page.locator('#contrib-pct').fill(String(pct));
    await page.getByRole('button', { name: /adicionar contribuição/i }).click();
    await page.waitForTimeout(300);
  }

  await addContrib('Gestão de processos e documentação institucional', 70);
  await addContrib('Suporte técnico e atendimento interno', 30);

  await shot(page, 'chefia/criar-plano-contribuicoes.png');

  // Avançar para passo 5 (revisão e envio)
  const btnProx = page.getByRole('button', { name: /próximo/i });
  const hasProx = await btnProx.isVisible({ timeout: 2000 }).catch(() => false);
  if (hasProx) {
    await btnProx.click();
    await page.waitForTimeout(400);
    await shot(page, 'chefia/criar-plano-confirmacao.png');
  }
}

async function captureGestor(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  console.log('\n[GESTOR — Maria Fernanda]');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctx, PERSONAS.gestor);
  const page = await ctx.newPage();

  await go(page, '/');
  await shot(page, 'gestor/dashboard.png');

  // PE com status 2 (Aguardando aprovação) — descobrir id via API (muda a cada reseed)
  const peResp = await ctx.request.post(`${BACKEND}/graphql`, {
    data: { query: '{ listarPlanosEntregas { id status } }' },
  });
  const peJson = await peResp.json();
  const pendingPe = (peJson?.data?.listarPlanosEntregas ?? []).find((p: any) => p.status === 2);
  if (!pendingPe) {
    console.log('  ! nenhum PE com status=2 encontrado');
    await ctx.close();
    return;
  }
  await go(page, `/equipe/planos-entregas/${pendingPe.id}`);
  await page.waitForTimeout(600);
  const peTitle = await page.locator('.pg-title, h1').first().textContent().catch(() => '');
  if (peTitle && !peTitle.includes('500') && !peTitle.includes('404')) {
    await shot(page, 'gestor/aprovar-planos-detalhe.png');
  } else {
    console.log('  ! página de PE retornou erro:', peTitle);
  }

  await go(page, '/conformidade');
  await shot(page, 'gestor/conformidade.png');

  await go(page, '/relatorios');
  await shot(page, 'gestor/relatorios.png');

  await ctx.close();
}

async function captureDemo(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  console.log('\n[DEMO — dashboards por papel]');

  // Servidor com convocação pendente (João Santos)
  const ctxS = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxS, PERSONAS.servidor2);
  const pageS = await ctxS.newPage();
  await go(pageS, '/');
  await shot(pageS, 'demo/dashboard-servidor.png');
  await ctxS.close();

  // Chefia (Carlos Souza)
  const ctxC = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxC, PERSONAS.chefe1);
  const pageC = await ctxC.newPage();
  await go(pageC, '/');
  await shot(pageC, 'demo/dashboard-chefia.png');
  await ctxC.close();

  // Gestor (Maria Fernanda)
  const ctxG = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxG, PERSONAS.gestor);
  const pageG = await ctxG.newPage();
  await go(pageG, '/');
  await shot(pageG, 'demo/dashboard-gestor.png');
  await ctxG.close();
}

// ─── Pactuação bilateral (Fase 12) ────────────────────────────────────────────

async function fillWizardStep0(page: Page) {
  // Datas: início hoje, fim em 6 meses
  const hoje = new Date();
  const fim = new Date(hoje);
  fim.setMonth(fim.getMonth() + 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  await page.locator('input[type="date"]').first().fill(fmt(hoje));
  await page.locator('input[type="date"]').nth(1).fill(fmt(fim));
  await page.waitForTimeout(200);
}

async function addContribServidor(page: Page, desc: string, pct: number) {
  await page.locator('#contrib-desc').fill(desc);
  // O campo de % é controlado por bind:value — limpar antes para evitar concat
  const pctInput = page.locator('#contrib-pct');
  await pctInput.fill(String(pct));
  await page.getByRole('button', { name: /adicionar contribuição/i }).click();
  await page.waitForTimeout(300);
}

async function capturePactuacao(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  console.log('\n[PACTUAÇÃO BILATERAL — Marta / Felipe / Lucas / Ana / Beatriz]');

  // ── 1. Marta — estado vazio em /meu-plano ─────────────────────────────────
  console.log('  [Marta — estado vazio + wizard de criação]');
  const ctxM = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxM, PERSONAS.servidor7);
  const pageM = await ctxM.newPage();

  await go(pageM, '/meu-plano');
  await shot(pageM, 'servidor/meu-plano-vazio.png');

  // ── 2-4. Marta — wizard /meu-plano/criar (passos 1, 4, 5) ────────────────
  await go(pageM, '/meu-plano/criar');
  await pageM.waitForTimeout(400);
  await fillWizardStep0(pageM);
  await shot(pageM, 'servidor/criar-plano-passo1.png');

  // Avançar até step 3 (contribuições)
  await pageM.getByRole('button', { name: /próximo/i }).click(); // step 1
  await pageM.waitForTimeout(250);
  await pageM.getByRole('button', { name: /próximo/i }).click(); // step 2
  await pageM.waitForTimeout(250);
  await pageM.getByRole('button', { name: /próximo/i }).click(); // step 3 (contribuições)
  await pageM.waitForTimeout(400);

  await addContribServidor(pageM, 'Apoio em projetos transversais da CGPGD', 60);
  await addContribServidor(pageM, 'Documentação e reuniões de equipe', 40);
  await shot(pageM, 'servidor/criar-plano-contribuicoes.png');

  // Avançar para step 4 (revisão)
  await pageM.getByRole('button', { name: /próximo/i }).click();
  await pageM.waitForTimeout(400);
  await shot(pageM, 'servidor/criar-plano-revisao.png');

  await ctxM.close();

  // ── 5. Ana — CloneDialog aberto ───────────────────────────────────────────
  console.log('  [Ana — modal de clonar plano anterior]');
  const ctxA = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxA, PERSONAS.servidor1);
  const pageA = await ctxA.newPage();
  await go(pageA, '/meu-plano');
  await pageA.waitForTimeout(400);
  // Ana tem PT em execução → o botão "Clonar" aparece no aside "Planos anteriores"
  // como ícone (title="Clonar"). Tentamos primeiro a CTA grande "Clonar plano anterior",
  // depois caímos no botão do aside.
  const btnCtaClone = pageA.getByRole('button', { name: /clonar plano anterior/i });
  const hasCta = await btnCtaClone.isVisible({ timeout: 2000 }).catch(() => false);
  if (hasCta) {
    await btnCtaClone.click();
  } else {
    const btnAsideClone = pageA.locator('button[title="Clonar"]').first();
    const hasAside = await btnAsideClone.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasAside) {
      await btnAsideClone.click();
    } else {
      console.log('  ! botão Clonar não encontrado para Ana');
    }
  }
  await pageA.waitForTimeout(400);
  // Aguarda o título do modal aparecer
  const tituloModal = pageA.getByText(/Clonar plano de trabalho/i).first();
  const hasModal = await tituloModal.isVisible({ timeout: 2000 }).catch(() => false);
  if (hasModal) {
    await shot(pageA, 'servidor/clonar-modal.png');
    await pageA.keyboard.press('Escape');
    await pageA.waitForTimeout(200);
  } else {
    console.log('  ! modal de clone não abriu');
  }
  await ctxA.close();

  // ── 6. Lucas — editar rascunho (status 5 RASCUNHO_PARTICIPANTE) ──────────
  console.log('  [Lucas — editar rascunho]');
  const ctxL = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxL, PERSONAS.servidor4);
  const pageL = await ctxL.newPage();

  const lucasResp = await ctxL.request.post(`${BACKEND}/graphql`, {
    data: { query: '{ meusPlanosTrabalho { id status } }' },
  });
  const lucasPts = (await lucasResp.json())?.data?.meusPlanosTrabalho ?? [];
  // status 5 = RASCUNHO_PARTICIPANTE
  const lucasPt = lucasPts.find((p: any) => p.status === 5) ?? lucasPts[0];
  if (lucasPt?.id) {
    await go(pageL, `/meu-plano/${lucasPt.id}/editar`);
    await shot(pageL, 'servidor/editar-rascunho.png');
  } else {
    console.log('  ! Lucas sem PT rascunho — pulando editar-rascunho.png');
  }
  await ctxL.close();

  // ── 7-8. Felipe — dashboard com card "aguardando" + revisar ajuste ──────
  console.log('  [Felipe — dashboard + revisar ajuste da chefia]');
  const ctxF = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxF, PERSONAS.servidor6);
  const pageF = await ctxF.newPage();

  await go(pageF, '/');
  await shot(pageF, 'servidor/dashboard-aguardando.png');

  const felipeResp = await ctxF.request.post(`${BACKEND}/graphql`, {
    data: { query: '{ meusPlanosTrabalho { id status } }' },
  });
  const felipePts = (await felipeResp.json())?.data?.meusPlanosTrabalho ?? [];
  // status 7 = AGUARDANDO_ASSINATURA_PARTICIPANTE
  const felipePt = felipePts.find((p: any) => p.status === 7) ?? felipePts[0];
  if (felipePt?.id) {
    await go(pageF, `/meu-plano/${felipePt.id}/revisar`);
    await shot(pageF, 'servidor/revisar-ajuste.png');
  } else {
    console.log('  ! Felipe sem PT em aguardando — pulando revisar-ajuste.png');
  }
  await ctxF.close();

  // ── 9. Beatriz — dashboard com pendências ────────────────────────────────
  console.log('  [Beatriz — dashboard + equipe + revisar + assinatura]');
  const ctxB = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxB, PERSONAS.chefe2);
  const pageB = await ctxB.newPage();

  await go(pageB, '/');
  await shot(pageB, 'chefia/dashboard-aguardando.png');

  // ── 10. Beatriz — /equipe com banner pendentes ────────────────────────────
  await go(pageB, '/equipe');
  await shot(pageB, 'chefia/equipe-banner-pendentes.png');

  // ── 11. Beatriz — revisar PT do Pedro (status 2 AGUARDANDO_ASSINATURA_CHEFIA)
  const ptsResp = await ctxB.request.post(`${BACKEND}/graphql`, {
    data: { query: '{ listarPlanosTrabalho { id status } }' },
  });
  const allPts = (await ptsResp.json())?.data?.listarPlanosTrabalho ?? [];
  const pedroPt = allPts.find((p: any) => p.status === 2);
  if (pedroPt?.id) {
    await go(pageB, `/equipe/planos-trabalho/${pedroPt.id}/revisar`);
    await shot(pageB, 'chefia/revisar-pt.png');

    // ── 12. AssinaturaCard com 3 checks marcados ────────────────────────────
    // Procura os 3 checkboxes do card de assinatura. O componente usa `checked`
    // controlado via onchange — clicamos no <label> que envelopa cada input
    // (mais robusto que .check() porque o input é controlado).
    const labels = pageB.locator('label.assinatura-check');
    const labelCount = await labels.count();
    if (labelCount >= 3) {
      // Scroll até o card para garantir que aparece no viewport
      await labels.first().scrollIntoViewIfNeeded();
      await pageB.waitForTimeout(200);
      for (let i = 0; i < 3; i++) {
        await labels.nth(i).click();
        await pageB.waitForTimeout(100);
      }
      await pageB.waitForTimeout(200);
      await shot(pageB, 'chefia/assinatura-card.png');
    } else {
      console.log(`  ! AssinaturaCard com checks não encontrado (labels=${labelCount})`);
    }
  } else {
    console.log('  ! nenhum PT com status=2 encontrado para Beatriz revisar');
  }
  await ctxB.close();
}

async function captureExtra(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  // ── Notificações — Ana Silva ──────────────────────────────────────────────
  console.log('\n[NOTIFICAÇÕES — Ana Silva]');
  const ctxN = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxN, PERSONAS.servidor1);
  const pageN = await ctxN.newPage();
  await go(pageN, '/notificacoes');
  await shot(pageN, 'servidor/notificacoes.png');
  await ctxN.close();

  // ── Relatórios — Maria Fernanda ───────────────────────────────────────────
  console.log('\n[RELATÓRIOS — Maria Fernanda]');
  const ctxR = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxR, PERSONAS.gestor);
  const pageR = await ctxR.newPage();
  await go(pageR, '/relatorios');
  await shot(pageR, 'gestor/relatorios.png');
  await ctxR.close();

  // ── Admin — Roberto Admin ─────────────────────────────────────────────────
  console.log('\n[ADMIN — Roberto Admin]');
  const ctxA = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxA, PERSONAS.admin);
  const pageA = await ctxA.newPage();

  await go(pageA, '/admin/participantes');
  await shot(pageA, 'admin/participantes.png');

  await go(pageA, '/admin/institucional');
  await shot(pageA, 'admin/institucional.png');

  await ctxA.close();

  // ── Detalhe de participante — Carlos Souza ────────────────────────────────
  console.log('\n[PARTICIPANTE DETALHE — Carlos Souza]');
  const ctxP = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  await login(ctxP, PERSONAS.chefe1);
  const pageP = await ctxP.newPage();

  await go(pageP, '/equipe');
  await pageP.waitForTimeout(600);
  // Clicar no primeiro link de participante (não o de "novo plano")
  const partLinks = await pageP.locator('a[href*="/equipe/participantes/"]').all();
  if (partLinks.length > 0) {
    await partLinks[0].click();
    await pageP.waitForLoadState('networkidle');
    await pageP.waitForTimeout(500);
    await shot(pageP, 'chefia/participante-detalhe.png');
  } else {
    console.log('  ! nenhum link de participante encontrado');
  }

  await ctxP.close();
}

// ─── Mobile (Fase 14) ─────────────────────────────────────────────────────────

async function captureMobile(browser: ReturnType<typeof chromium.launch> extends Promise<infer B> ? B : never) {
  console.log('\n[MOBILE — iPhone 14 (390×844)]');

  // ── 1. Marta — /meu-plano vazio ─────────────────────────────────────────
  console.log('  [Marta — mobile vazio + wizard]');
  const ctxM = await browser.newContext({ viewport: MOBILE_VIEWPORT });
  await login(ctxM, PERSONAS.servidor7);
  const pageM = await ctxM.newPage();

  await go(pageM, '/meu-plano');
  await shot(pageM, 'mobile/servidor/meu-plano-vazio.png');

  // ── 2-3. Marta — wizard step 1 + step 4 (contribuições) ─────────────────
  await go(pageM, '/meu-plano/criar');
  await pageM.waitForTimeout(400);
  await fillWizardStep0(pageM);  // helper existente — preenche datas
  await shot(pageM, 'mobile/servidor/criar-passo1.png');

  // Avançar 3 vezes até step 4 (contribuições)
  for (let i = 0; i < 3; i++) {
    await pageM.getByRole('button', { name: /próximo/i }).click();
    await pageM.waitForTimeout(250);
  }
  await addContribServidor(pageM, 'Apoio em projetos transversais da CGPGD', 60);
  await addContribServidor(pageM, 'Documentação e reuniões de equipe', 40);
  await shot(pageM, 'mobile/servidor/criar-contribuicoes.png');

  await ctxM.close();

  // ── 4. Lucas — editar rascunho (sticky CTA no rodapé) ────────────────────
  console.log('  [Lucas — mobile editar]');
  const ctxL = await browser.newContext({ viewport: MOBILE_VIEWPORT });
  await login(ctxL, PERSONAS.servidor4);
  const pageL = await ctxL.newPage();

  const lucasResp = await ctxL.request.post(`${BACKEND}/graphql`, {
    data: { query: '{ meusPlanosTrabalho { id status } }' },
  });
  const lucasPts = (await lucasResp.json())?.data?.meusPlanosTrabalho ?? [];
  const lucasPt = lucasPts.find((p: any) => p.status === 5) ?? lucasPts[0];
  if (lucasPt?.id) {
    await go(pageL, `/meu-plano/${lucasPt.id}/editar`);
    // Scroll até o final para garantir que CTA sticky aparece no viewport
    await pageL.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pageL.waitForTimeout(300);
    await shot(pageL, 'mobile/servidor/editar.png');
  } else {
    console.log('  ! Lucas sem PT rascunho — pulando mobile/servidor/editar.png');
  }
  await ctxL.close();

  // ── 5-6. Felipe — dashboard + revisar (sticky AssinaturaCard) ────────────
  console.log('  [Felipe — mobile dashboard + revisar]');
  const ctxF = await browser.newContext({ viewport: MOBILE_VIEWPORT });
  await login(ctxF, PERSONAS.servidor6);
  const pageF = await ctxF.newPage();

  await go(pageF, '/');
  await shot(pageF, 'mobile/servidor/dashboard-aguardando.png');

  const felipeResp = await ctxF.request.post(`${BACKEND}/graphql`, {
    data: { query: '{ meusPlanosTrabalho { id status } }' },
  });
  const felipePts = (await felipeResp.json())?.data?.meusPlanosTrabalho ?? [];
  const felipePt = felipePts.find((p: any) => p.status === 7) ?? felipePts[0];
  if (felipePt?.id) {
    await go(pageF, `/meu-plano/${felipePt.id}/revisar`);
    await pageF.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pageF.waitForTimeout(300);
    await shot(pageF, 'mobile/servidor/revisar.png');
  } else {
    console.log('  ! Felipe sem PT em aguardando — pulando mobile/servidor/revisar.png');
  }
  await ctxF.close();

  // ── 7-9. Beatriz — dashboard + equipe + revisar PT do Pedro ─────────────
  console.log('  [Beatriz — mobile dashboard + equipe + revisar]');
  const ctxB = await browser.newContext({ viewport: MOBILE_VIEWPORT });
  await login(ctxB, PERSONAS.chefe2);
  const pageB = await ctxB.newPage();

  await go(pageB, '/');
  await shot(pageB, 'mobile/chefia/dashboard-aguardando.png');

  await go(pageB, '/equipe');
  await shot(pageB, 'mobile/chefia/equipe.png');

  const ptsResp = await ctxB.request.post(`${BACKEND}/graphql`, {
    data: { query: '{ listarPlanosTrabalho { id status } }' },
  });
  const allPts = (await ptsResp.json())?.data?.listarPlanosTrabalho ?? [];
  const pedroPt = allPts.find((p: any) => p.status === 2);
  if (pedroPt?.id) {
    await go(pageB, `/equipe/planos-trabalho/${pedroPt.id}/revisar`);
    await pageB.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await pageB.waitForTimeout(300);
    await shot(pageB, 'mobile/chefia/revisar.png');
  } else {
    console.log('  ! nenhum PT com status=2 — pulando mobile/chefia/revisar.png');
  }
  await ctxB.close();

  // ── 10. Ana — CloneDialog em mobile ─────────────────────────────────────
  console.log('  [Ana — mobile clonar modal]');
  const ctxA = await browser.newContext({ viewport: MOBILE_VIEWPORT });
  await login(ctxA, PERSONAS.servidor1);
  const pageA = await ctxA.newPage();
  await go(pageA, '/meu-plano');
  await pageA.waitForTimeout(400);
  const btnCtaClone = pageA.getByRole('button', { name: /clonar plano anterior/i });
  const hasCta = await btnCtaClone.isVisible({ timeout: 2000 }).catch(() => false);
  if (hasCta) {
    await btnCtaClone.click();
  } else {
    const btnAsideClone = pageA.locator('button[title="Clonar"]').first();
    const hasAside = await btnAsideClone.isVisible({ timeout: 2000 }).catch(() => false);
    if (hasAside) await btnAsideClone.click();
  }
  await pageA.waitForTimeout(400);
  const tituloModal = pageA.getByText(/Clonar plano de trabalho/i).first();
  if (await tituloModal.isVisible({ timeout: 2000 }).catch(() => false)) {
    await shot(pageA, 'mobile/servidor/clonar-modal.png');
  } else {
    console.log('  ! modal de clone não abriu em mobile');
  }
  await ctxA.close();
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Iniciando captura de screenshots...');
  console.log(`Output: ${OUT}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    await captureServidor(browser);
    await captureChefe(browser);
    await captureGestor(browser);
    await captureAdmin(browser);
    await captureDemo(browser);
    await capturePactuacao(browser);
    await captureMobile(browser);
    await captureExtra(browser);
  } catch (err) {
    console.error('\nErro durante captura:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }

  console.log('\n✅ Screenshots concluídos.');
}

main();
