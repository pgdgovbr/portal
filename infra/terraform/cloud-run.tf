# =============================================================================
# Cloud Run — pgd-portal
# =============================================================================
# A imagem inicial é um placeholder. O workflow `build.yml` atualiza a imagem
# em cada push para main. Env vars vivem aqui (Terraform); o workflow NÃO usa
# --set-env-vars.
# =============================================================================

resource "google_cloud_run_v2_service" "pgd_portal" {
  name     = local.prefix
  location = var.region

  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.runtime.email

    scaling {
      min_instance_count = 0
      max_instance_count = 4
    }

    containers {
      image = var.cloud_run_image

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name  = "PUBLIC_GRAPHQL_URL"
        value = "${var.backend_url}/graphql"
      }

      env {
        name  = "PUBLIC_BACKEND_URL"
        value = var.backend_url
      }
    }
  }

  labels = local.common_labels

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      client,
      client_version,
    ]
  }

  depends_on = [google_project_service.required]
}

# Acesso público — auth é responsabilidade da app (cookie JWT + redirect OAuth)
resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  project  = google_cloud_run_v2_service.pgd_portal.project
  location = google_cloud_run_v2_service.pgd_portal.location
  name     = google_cloud_run_v2_service.pgd_portal.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "cloud_run_url" {
  description = "URL pública do portal"
  value       = google_cloud_run_v2_service.pgd_portal.uri
}
