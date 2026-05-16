locals {
  prefix = var.project_prefix

  common_labels = {
    project    = "pgd-portal"
    managed_by = "terraform"
  }
}
