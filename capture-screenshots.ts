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

// Seed personas (CLAUDE.md)
const PERSONAS = {
  servidor1:  { email: 'servidor1@pgd-demo.gov.br', name: 'Ana Silva',       role: 'servidor' },
  servidor2:  { email: 'servidor2@pgd-demo.gov.br', name: 'João Santos',     role: 'servidor' },
  servidor3:  { email: 'servidor3@pgd-demo.gov.br', name: 'Carla Mendes',    role: 'servidor' },
  chefe1:     { email: 'chefe1@pgd-demo.gov.br',    name: 'Carlos Souza',    role: 'chefe_imediato' },
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

  // Avaliação: navegar via botão "Ver avaliação"
  await go(page, '/meu-plano');
  await page.waitForTimeout(800);
  const linkAval = page.locator('a[href*="/meu-plano/avaliacao/"]').first();
  const hasAval = await linkAval.count().then(c => c > 0).catch(() => false);
  if (hasAval) {
    await linkAval.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);
    await shot(page, 'servidor/avaliacao-detalhe.png');
  } else {
    console.log('  ! avaliação não encontrada para Ana Silva (dados não expostos pelo schema atual)');
  }

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
  } else {
    console.log('  ! avaliação não disponível via schema atual — pulando contestação');
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

  // Wizard: Criar Plano de Trabalho
  await captureWizard(page);

  await ctx.close();
}

async function captureWizard(page: Page) {
  console.log('  [wizard criar plano]');
  await go(page, '/equipe/planos-trabalho/novo');

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

  // PE com status 2 (Aguardando aprovação) — id descoberto via API
  // seed_demo.py cria 2 PEs; o de status=2 é o da CGTI aguardando aprovação do gestor
  await go(page, '/equipe/planos-entregas/2bc92240-c391-4710-a39a-113b067a0cb4');
  await page.waitForTimeout(600);
  const peTitle = await page.locator('.pg-title, h1').first().textContent().catch(() => '');
  if (peTitle && !peTitle.includes('500') && !peTitle.includes('404')) {
    await shot(page, 'gestor/aprovar-planos-detalhe.png');
  } else {
    console.log('  ! página de PE retornou erro:', peTitle);
  }

  await go(page, '/conformidade');
  await shot(page, 'gestor/conformidade.png');

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

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Iniciando captura de screenshots...');
  console.log(`Output: ${OUT}\n`);

  const browser = await chromium.launch({ headless: true });

  try {
    await captureServidor(browser);
    await captureChefe(browser);
    await captureGestor(browser);
    await captureDemo(browser);
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
