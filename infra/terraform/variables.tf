variable "project_id" {
  description = "GCP project ID"
  type        = string
  default     = "inspire-7-finep"
}

variable "region" {
  description = "Região padrão"
  type        = string
  default     = "southamerica-east1"
}

variable "zone" {
  description = "Zona padrão"
  type        = string
  default     = "southamerica-east1-a"
}

variable "project_prefix" {
  description = "Prefixo para todos os recursos do portal"
  type        = string
  default     = "pgd-portal"
}

variable "github_organization" {
  description = "Organização GitHub do portal"
  type        = string
  default     = "pgdgovbr"
}

variable "github_repo" {
  description = "Nome do repositório GitHub do portal (sem owner)"
  type        = string
  default     = "portal"
}

variable "cloud_run_image" {
  description = "Imagem inicial do Cloud Run (placeholder até o primeiro build via GitHub Actions)"
  type        = string
  default     = "us-docker.pkg.dev/cloudrun/container/hello"
}

variable "backend_url" {
  description = "URL base do backend PGD Libre"
  type        = string
  default     = "https://pgd-libre-klvx64dufq-rj.a.run.app"
}
