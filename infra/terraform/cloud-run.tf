# =============================================================================
# Encerramento do PGD Portal — pgdgovbr/pgd-libre#13
# =============================================================================
# Temporário. O apply do #25 falhou ao destruir o Cloud Run, porque o
# provider google 6.x liga deletion_protection por padrão neste recurso.
# Este arquivo devolve o serviço (e a SA runtime, que ele referencia) à
# configuração só para gravar deletion_protection = false no state. O PR
# seguinte apaga este arquivo e o destroy conclui.
# =============================================================================

resource "google_cloud_run_v2_service" "pgd_portal" {
  name     = local.prefix
  location = var.region

  # Encerramento (pgd-libre#13): o provider 6.x protege o Cloud Run por padrão.
  deletion_protection = false

  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.runtime.email

    scaling {
      min_instance_count = 1
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

}

resource "google_service_account" "runtime" {
  account_id   = "${local.prefix}-runtime"
  display_name = "PGD Portal — Cloud Run runtime"
  description  = "Identidade do Cloud Run service do portal"
}
