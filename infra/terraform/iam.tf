# SA usada pelo GitHub Actions (CI) para build de imagem e deploy ao Cloud Run
resource "google_service_account" "deploy" {
  account_id   = "${local.prefix}-deploy"
  display_name = "PGD Portal — CI/CD"
  description  = "Usada pelo GitHub Actions para build (Artifact Registry) e deploy (Cloud Run)"

  depends_on = [google_project_service.required]
}

# SA do runtime do Cloud Run
resource "google_service_account" "runtime" {
  account_id   = "${local.prefix}-runtime"
  display_name = "PGD Portal — Cloud Run runtime"
  description  = "Identidade do Cloud Run service do portal"

  depends_on = [google_project_service.required]
}

# Editor no projeto: cobre terraform apply em CI (mesmo padrão do pgd-libre-deploy)
resource "google_project_iam_member" "deploy_editor" {
  project = var.project_id
  role    = "roles/editor"
  member  = "serviceAccount:${google_service_account.deploy.email}"
}

# Acesso a secrets (caso CI precise ler secrets para builds futuros)
resource "google_project_iam_member" "deploy_secret_accessor" {
  project = var.project_id
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.deploy.email}"
}

# Deploy SA pode atuar como runtime SA (necessário para gcloud run deploy)
resource "google_service_account_iam_member" "deploy_actas_runtime" {
  service_account_id = google_service_account.runtime.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.deploy.email}"
}

output "deploy_sa_email" {
  description = "Email da SA de deploy para o GitHub Actions"
  value       = google_service_account.deploy.email
}

output "runtime_sa_email" {
  description = "Email da SA de runtime do Cloud Run"
  value       = google_service_account.runtime.email
}
