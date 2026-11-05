# =============================================================================
# Encerramento do PGD Portal — pgdgovbr/pgd-libre#13
# =============================================================================
# Os recursos do portal foram tirados da configuração e o apply os destrói:
# Cloud Run `pgd-portal`, Artifact Registry `pgd-portal` e SA runtime.
#
# Os blocos `removed` abaixo só tiram os recursos do state, sem destruir:
#
# - APIs: são compartilhadas com o Destaques Gov.BR no mesmo projeto.
# - Bucket de state: o backend ainda usa; apagado à mão no fechamento.
# - SA de deploy, papéis e vínculo WIF: é a identidade que roda este apply.
#   Destruí-la no meio do run quebraria as remoções seguintes e a escrita
#   do state. Removidos à mão no fechamento (Fase 4 da issue).
# - Bindings que somem junto com o recurso dono (Cloud Run e SA runtime).
#   A SA de deploy só tem roles/editor, que não inclui setIamPolicy, então
#   destruí-los um a um daria 403.
# =============================================================================

removed {
  from = google_project_service.required
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_storage_bucket.terraform_state
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_service_account.deploy
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_project_iam_member.deploy_editor
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_project_iam_member.deploy_secret_accessor
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_service_account_iam_member.deploy_workload_identity
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_service_account_iam_member.deploy_actas_runtime
  lifecycle {
    destroy = false
  }
}

removed {
  from = google_cloud_run_v2_service_iam_member.public_invoker
  lifecycle {
    destroy = false
  }
}
