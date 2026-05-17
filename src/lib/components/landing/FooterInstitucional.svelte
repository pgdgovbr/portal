<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<footer class="lp-section dark lp-footer" aria-label="Rodapé">
	<div class="lp-wrap">
		<div class="lp-footer-grid">
			<div>
				<Logo size="md" onDark />
				<p class="lp-footer-tagline">
					Software Livre aderente à norma do Programa de Gestão e Desempenho.
				</p>
				<div class="lp-footer-licenses">
					<span class="lp-chip legal">AGPL-3.0 · código</span>
					<span class="lp-chip legal">CC-BY-4.0 · conteúdo</span>
				</div>
			</div>

			<div>
				<h3>Plataforma</h3>
				<ul>
					<li><a href="https://pgdgovbr.github.io/docs/sobre/pgd-libre/">O que é o PGD Livre</a></li>
					<li><a href="https://github.com/pgdgovbr">Repositório</a></li>
					<li><a href="https://pgdgovbr.github.io/docs/">Documentação</a></li>
				</ul>
			</div>

			<div>
				<h3>Conceitos do PGD</h3>
				<ul>
					<li><a href="https://pgdgovbr.github.io/docs/conceitos/programa/">O Programa de Gestão</a></li>
					<li><a href="https://pgdgovbr.github.io/docs/conceitos/pactuacao-bilateral/">Pactuação bilateral</a></li>
					<li><a href="https://pgdgovbr.github.io/docs/conceitos/papeis/">Papéis e responsabilidades</a></li>
					<li><a href="https://pgdgovbr.github.io/docs/conceitos/glossario/">Glossário</a></li>
				</ul>
			</div>

			<div>
				<h3>Jornadas da demonstração</h3>
				<ul>
					<li><a href="https://pgdgovbr.github.io/docs/demo/acesso/">Como acessar a demo</a></li>
					<li><a href="https://pgdgovbr.github.io/docs/demo/jornada-servidor/">Servidor</a></li>
					<li><a href="https://pgdgovbr.github.io/docs/demo/jornada-chefia/">Chefia</a></li>
					<li><a href="https://pgdgovbr.github.io/docs/demo/jornada-gestor/">Gestor</a></li>
				</ul>
			</div>
		</div>

		<hr class="lp-footer-rule" />

		<p class="lp-footer-credits">
			Construído pela Secretaria de Governo Digital (SGD) — SEGES — Ministério da Gestão e da Inovação.
		</p>
	</div>
</footer>

<style>
	.lp-footer {
		margin-top: 0;
	}
	.lp-footer-grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 1fr;
		gap: 56px;
	}
	.lp-footer-tagline {
		max-width: 360px;
		margin: 16px 0 18px;
		color: rgba(255, 255, 255, 0.7);
		font-size: 14.5px;
		line-height: 1.55;
	}
	.lp-footer-licenses {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.lp-footer h3 {
		font-size: 13px;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: rgba(255, 255, 255, 0.55);
		font-weight: 700;
		margin: 0 0 16px;
	}
	.lp-footer ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.lp-footer a {
		color: rgba(255, 255, 255, 0.85);
		text-decoration: none;
		font-size: 14.5px;
		transition: color 0.15s ease;
	}
	.lp-footer a:hover {
		color: white;
		text-decoration: underline;
	}
	.lp-footer-rule {
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
		border: 0;
		margin: 56px 0 24px;
	}
	.lp-footer-credits {
		color: rgba(255, 255, 255, 0.55);
		font-size: 13px;
	}
	@media (max-width: 900px) {
		.lp-footer-grid {
			grid-template-columns: 1fr 1fr;
			gap: 40px;
		}
	}
	@media (max-width: 560px) {
		.lp-footer-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
