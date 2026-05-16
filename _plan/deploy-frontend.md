# Plano — Deploy do Portal Frontend no Cloud Run (Opção C)

## Contexto

O backend (`pgd-libre`) já está no Cloud Run com Terraform em `pgd-libre/infra/terraform/`. O portal SvelteKit (`portal/`) não tem Dockerfile, não tem CI/CD e não tem infra. O objetivo é criar tudo isso espelhando exatamente o padrão do backend: cada repo é autônomo (código + infra juntos), recursos compartilhados referenciados via `data` sources.

---

## Arquitetura resultante

```
pgdgovbr/pgd-libre/           pgdgovbr/portal/
  infra/terraform/              infra/terraform/
    cloud-run.tf (backend)        cloud-run.tf (portal)
    iam.tf                        iam.tf
    workload-identity.tf          workload-identity.tf  ← reusa pool + provider existentes
    artifact-registry.tf          artifact-registry.tf
    ...                           ...
  .github/workflows/            .github/workflows/
    build.yml (já existe)         build.yml  ← criar
    terraform-apply.yml           terraform-apply.yml  ← criar
    terraform-plan.yml            terraform-plan.yml   ← criar
    ci.yml                        ci.yml               ← criar
```

Recursos compartilhados:
- WIF pool `github-pool`: criado pelo `destaquesgovbr/infra` → referenciado como `data`
- WIF provider `github-provider-pgdgovbr`: criado pelo `pgd-libre/infra` → referenciado como `data`
- Cloud SQL: no `pgd-libre` (o portal não acessa DB diretamente)

---

## Arquivos a criar

### 1. `portal/Dockerfile`
Multi-stage: builder (npm ci + npm run build) → runner (Node alpine sem node_modules).
SvelteKit `adapter-node` bunda tudo — runtime não precisa de `node_modules`.
Porta: 3000.

### 2. `portal/.dockerignore`
Excluir: `node_modules/`, `build/`, `.svelte-kit/`, `.git/`, `.env`, `e2e/auth/`, `playwright-report/`, `_plan/`.

### 3. `portal/infra/terraform/main.tf`
Backend GCS: bucket `pgd-portal-terraform-state`, prefix `terraform/state`.

### 4. `portal/infra/terraform/variables.tf`
Variáveis: `project_id` (default: `inspire-7-finep`), `region`, `zone`, `project_prefix` (default: `pgd-portal`), `github_organization` (default: `pgdgovbr`), `github_repo` (default: `portal`), `cloud_run_image` (default: placeholder), `backend_url` (default: URL atual do Cloud Run do backend).

### 5. `portal/infra/terraform/locals.tf`
`prefix = var.project_prefix`, `common_labels`.

### 6. `portal/infra/terraform/apis.tf`
Enable: `run.googleapis.com`, `artifactregistry.googleapis.com`, `iam.googleapis.com`, `iamcredentials.googleapis.com`, `sts.googleapis.com`.

### 7. `portal/infra/terraform/artifact-registry.tf`
Repo Docker `pgd-portal` em `southamerica-east1`.
Imagem ficará em: `southamerica-east1-docker.pkg.dev/inspire-7-finep/pgd-portal/app:{sha}`

### 8. `portal/infra/terraform/iam.tf`
Dois SAs — mesmo padrão confirmado no `pgd-libre-deploy`:
- `pgd-portal-deploy` — `roles/editor` (projeto, para Terraform apply em CI), `roles/run.developer`, `roles/secretmanager.secretAccessor`, `roles/iam.serviceAccountUser` (na runtime SA)
- `pgd-portal-runtime` — sem permissões extras (portal não acessa Cloud SQL nem secrets)

> `roles/editor` é o que permite ao CI rodar `terraform apply` — confirmado como padrão em uso no `pgd-libre-deploy`.

Outputs: `deploy_sa_email`, `runtime_sa_email`.

### 9. `portal/infra/terraform/workload-identity.tf`
```hcl
# data sources — reusa o que já existe
data "google_iam_workload_identity_pool" "github" { ... }          # "github-pool"
data "google_iam_workload_identity_pool_provider" "github_pgdgovbr" { ... }  # "github-provider-pgdgovbr"

# novo binding: SA pgd-portal-deploy ↔ repo pgdgovbr/portal
resource "google_service_account_iam_member" "deploy_workload_identity" {
  member = "principalSet://.../attribute.repository/pgdgovbr/portal"
}

# outputs para setar nos GitHub Secrets
output "github_workload_identity_provider" { ... }
output "github_deploy_service_account" { ... }
```

### 10. `portal/infra/terraform/cloud-run.tf`
- Serviço: `pgd-portal`, região `southamerica-east1`, porta 3000
- `min_instance_count = 0`, `max_instance_count = 4`
- `lifecycle.ignore_changes = [image]`
- Env vars (plain text, não secrets):
  - `PUBLIC_GRAPHQL_URL = "${var.backend_url}/graphql"`
  - `PUBLIC_BACKEND_URL = var.backend_url`
- IAM: `allUsers → roles/run.invoker` (público — auth é responsabilidade da app)
- Output: `cloud_run_url`

### 11. `portal/infra/terraform/state-bucket.tf`
Recurso do bucket (`prevent_destroy = true`, versioning). Criado fora do Terraform no bootstrap, importado depois.

### 12. `portal/.github/workflows/ci.yml`
Trigger: push main + PRs (ignora `infra/`, `_plan/`, `**.md`).
Jobs: `npm ci && npm run check && npm test`.
Node: 22.

### 13. `portal/.github/workflows/build.yml`
Trigger: push main (ignora `infra/`, `_plan/`, `**.md`).
Permissões: `id-token: write`.
Steps:
1. auth (WIF via `GCP_WORKLOAD_IDENTITY_PROVIDER` + `GCP_SERVICE_ACCOUNT`)
2. setup-gcloud
3. configure-docker `southamerica-east1-docker.pkg.dev`
4. `docker build -t IMAGE .` + `docker push IMAGE`
   - `IMAGE = southamerica-east1-docker.pkg.dev/inspire-7-finep/pgd-portal/app:${{ github.sha }}`
5. `gcloud run services update pgd-portal --image=$IMAGE --region=southamerica-east1 --project=inspire-7-finep`

### 14. `portal/.github/workflows/terraform-plan.yml`
Trigger: PR com mudanças em `infra/terraform/**`.
Permissões: `id-token: write`, `pull-requests: write`.
`working-directory: infra/terraform`.
Steps: fmt -check, init, validate, plan, post comment no PR.

### 15. `portal/.github/workflows/terraform-apply.yml`
Trigger: push main com mudanças em `infra/terraform/**` + `workflow_dispatch`.
Steps: init, validate, apply -auto-approve.

### 16. Atualização em `pgd-libre/infra/terraform/cloud-run.tf`
Após portal deployado: trocar `FRONTEND_URL` de `/docs` para a URL do portal:
```hcl
env {
  name  = "FRONTEND_URL"
  value = "https://pgd-portal-XXXXX.a.run.app"  # usar o cloud_run_url do output
}
```

---

## Sequência de execução (bootstrap + deploy)

### Passo 1 — Criar todos os arquivos (itens 1-15 acima)

### Passo 2 — Bootstrap do state bucket (uma vez, local)
```bash
gsutil mb -p inspire-7-finep -c standard -l southamerica-east1 -b on gs://pgd-portal-terraform-state
gsutil versioning set on gs://pgd-portal-terraform-state
```

### Passo 3 — Primeiro `terraform apply` local (bootstrap único)
```bash
cd portal/infra/terraform
terraform init
terraform apply     # autentica com gcloud ADC do usuário
```
Este apply cria: Artifact Registry, Cloud Run service, deploy SA, runtime SA, WIF binding.
Anotar outputs: `github_workload_identity_provider` e `github_deploy_service_account`.

### Passo 4 — Importar state bucket ao Terraform
```bash
terraform import google_storage_bucket.terraform_state pgd-portal-terraform-state
```

### Passo 5 — Permissão para o deploy SA rodar Terraform em CI
O deploy SA precisa de permissão para ler/escrever o state bucket e para que o `terraform apply` futuro funcione:
```bash
gsutil iam ch serviceAccount:pgd-portal-deploy@inspire-7-finep.iam.gserviceaccount.com:roles/storage.objectAdmin gs://pgd-portal-terraform-state
```
O deploy SA já tem `run.developer` e `artifactregistry.writer`. Para o Terraform apply em CI re-aplicar mudanças incrementais (ex: mudar env var), ele precisa também de permissão para ler/atualizar o Cloud Run service que ele mesmo criou — isso já é coberto pelo `run.developer`.

> **Nota:** O primeiro apply usa ADC do usuário (owner do projeto). Os applies seguintes em CI usam o deploy SA — que já tem todas as permissões necessárias via `run.developer` + `artifactregistry.writer`.

### Passo 6 — Setar GitHub Secrets no repo `pgdgovbr/portal`
Usando os outputs do Passo 3:
```bash
# Via gh CLI:
gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER --body "<output do terraform>" --repo pgdgovbr/portal
gh secret set GCP_SERVICE_ACCOUNT --body "pgd-portal-deploy@inspire-7-finep.iam.gserviceaccount.com" --repo pgdgovbr/portal
```

### Passo 7 — Push do código → deploy automático
```bash
git add .
git commit -m "ci: add Dockerfile, Terraform infra, and GitHub Actions workflows"
git push
```
Isso dispara:
- `ci.yml` → lint + tests
- `build.yml` → docker build → push → cloud run deploy
- O portal estará acessível na URL gerada pelo Cloud Run

### Passo 8 — Atualizar FRONTEND_URL no backend
Após portal estar no ar, atualizar `pgd-libre/infra/terraform/cloud-run.tf` com a URL real do portal → PR → merge → terraform-apply do backend atualiza a env var.

---

## Verificação

1. `docker build -t pgd-portal-test . && docker run -p 3000:3000 -e PUBLIC_GRAPHQL_URL=http://localhost:8000/graphql -e PUBLIC_BACKEND_URL=http://localhost:8000 pgd-portal-test` → abre `http://localhost:3000`, verifica login
2. Após push: Actions tab no GitHub → `build.yml` passa e Cloud Run recebe nova imagem
3. `curl https://pgd-portal-XXXXX.a.run.app/` → resposta 302 para `/auth/login/google` (auth redirect)
4. Login real via OAuth → app funciona igual ao local

---

## Notas importantes

- `PUBLIC_*` são lidos via `$env/dynamic/public` em runtime — não precisam ser repassados no `docker build`. Basta setar como env vars no Cloud Run.
- O WIF provider `github-provider-pgdgovbr` já existe (criado pelo pgd-libre Terraform). O portal apenas cria um **novo binding** para o repo `pgdgovbr/portal` — nenhum conflito.
- O Artifact Registry `pgd-portal` é um repo SEPARADO do `pgd-libre`. Cada app tem o seu.
- Sem secrets no portal por enquanto — as duas env vars são URLs públicas.
