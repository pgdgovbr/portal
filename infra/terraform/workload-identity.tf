# =============================================================================
# Workload Identity Federation — pgdgovbr/portal
# =============================================================================
# Reaproveitamos o pool `github-pool` e o provider `github-provider-pgdgovbr`,
# ambos criados pelo repo pgd-libre/infra/terraform. Aqui apenas criamos o
# binding que autoriza a SA pgd-portal-deploy a ser impersonada pelo repo
# pgdgovbr/portal no GitHub Actions.
# =============================================================================

data "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github-pool"
}

data "google_iam_workload_identity_pool_provider" "github_pgdgovbr" {
  workload_identity_pool_id          = data.google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-provider-pgdgovbr"
}

resource "google_service_account_iam_member" "deploy_workload_identity" {
  service_account_id = google_service_account.deploy.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${data.google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_organization}/${var.github_repo}"
}

output "github_workload_identity_provider" {
  description = "Full path do WIF Provider para GCP_WORKLOAD_IDENTITY_PROVIDER no GitHub"
  value       = data.google_iam_workload_identity_pool_provider.github_pgdgovbr.name
}

output "github_deploy_service_account" {
  description = "Email da SA de deploy para GCP_SERVICE_ACCOUNT no GitHub"
  value       = google_service_account.deploy.email
}
