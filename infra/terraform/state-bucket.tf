resource "google_storage_bucket" "terraform_state" {
  name     = "${local.prefix}-terraform-state"
  location = var.region
  project  = var.project_id

  versioning {
    enabled = true
  }

  uniform_bucket_level_access = true
  public_access_prevention    = "enforced"

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      num_newer_versions = 30
    }
  }

  lifecycle {
    prevent_destroy = true
  }

  labels = local.common_labels
}
