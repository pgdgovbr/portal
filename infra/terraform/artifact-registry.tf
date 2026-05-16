resource "google_artifact_registry_repository" "pgd_portal" {
  location      = var.region
  repository_id = local.prefix
  description   = "Imagens Docker do Portal PGD"
  format        = "DOCKER"

  labels = local.common_labels

  depends_on = [google_project_service.required]
}

output "artifact_registry_url" {
  description = "URL base do repositório no Artifact Registry"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.pgd_portal.repository_id}"
}
