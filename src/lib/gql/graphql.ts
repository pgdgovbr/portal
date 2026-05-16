export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date (isoformat) */
  Date: { input: string; output: string; }
  /** Date with time (isoformat) */
  DateTime: { input: string; output: string; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](https://ecma-international.org/wp-content/uploads/ECMA-404_2nd_edition_december_2017.pdf). */
  JSON: { input: unknown; output: unknown; }
  /** Time (isoformat) */
  Time: { input: unknown; output: unknown; }
};

export type AdicionarContribuicaoInput = {
  descricao: Scalars['String']['input'];
  idContribuicao: Scalars['String']['input'];
  idEntrega?: InputMaybe<Scalars['String']['input']>;
  idPlanoEntregas?: InputMaybe<Scalars['String']['input']>;
  percentualContribuicao: Scalars['Int']['input'];
  rotulo?: InputMaybe<Scalars['String']['input']>;
  tipoContribuicao: Scalars['Int']['input'];
};

export type AfastamentoType = {
  __typename?: 'AfastamentoType';
  createdAt: Scalars['DateTime']['output'];
  dataFim?: Maybe<Scalars['Date']['output']>;
  dataInicio: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  observacao?: Maybe<Scalars['String']['output']>;
  participanteId: Scalars['ID']['output'];
  tipoAfastamento: TipoAfastamentoGql;
};

export type AprovarPlanoEntregasInput = {
  aprovadorUserId: Scalars['Int']['input'];
  planoId: Scalars['ID']['input'];
};

export type AtoAutorizacaoType = {
  __typename?: 'AtoAutorizacaoType';
  autoridade: Scalars['String']['output'];
  dataPublicacao: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  referencia: Scalars['String']['output'];
  status: StatusAtoGql;
  unidadeAutorizadoraId: Scalars['ID']['output'];
};

export type AutorizacaoAdicionalNoturnoType = {
  __typename?: 'AutorizacaoAdicionalNoturnoType';
  autorizadoPorUserId?: Maybe<Scalars['Int']['output']>;
  createdAt: Scalars['DateTime']['output'];
  dataFimAutorizacao?: Maybe<Scalars['Date']['output']>;
  dataInicioAutorizacao: Scalars['Date']['output'];
  horarioFimNoturno: Scalars['Time']['output'];
  horarioInicioNoturno: Scalars['Time']['output'];
  id: Scalars['ID']['output'];
  justificativa?: Maybe<Scalars['String']['output']>;
  participanteId: Scalars['ID']['output'];
};

export type AutorizarAdicionalNoturnoInput = {
  dataFimAutorizacao?: InputMaybe<Scalars['Date']['input']>;
  dataInicioAutorizacao: Scalars['Date']['input'];
  horarioFimNoturno?: Scalars['Time']['input'];
  horarioInicioNoturno?: Scalars['Time']['input'];
  justificativa?: InputMaybe<Scalars['String']['input']>;
  participanteId: Scalars['ID']['input'];
};

export type AvaliacaoType = {
  __typename?: 'AvaliacaoType';
  avaliacaoJustificativa?: Maybe<Scalars['String']['output']>;
  avaliacaoRegistrosExecucao?: Maybe<Scalars['Int']['output']>;
  dataAvaliacaoRegistrosExecucao?: Maybe<Scalars['Date']['output']>;
  dataFimPeriodoAvaliativo: Scalars['Date']['output'];
  dataInicioPeriodoAvaliativo: Scalars['Date']['output'];
  descricaoExecucao?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  idPeriodoAvaliativo: Scalars['String']['output'];
  planoTrabalhoId: Scalars['ID']['output'];
  recursoDecisao?: Maybe<DecisaoRecursoGql>;
  recursoDecisaoJustificativa?: Maybe<Scalars['String']['output']>;
  recursoTexto?: Maybe<Scalars['String']['output']>;
  statusRecurso?: Maybe<StatusRecursoGql>;
};

export type CadastrarParticipanteInput = {
  codUnidadeAutorizadora: Scalars['Int']['input'];
  codUnidadeInstituidora: Scalars['Int']['input'];
  codUnidadeLotacao: Scalars['Int']['input'];
  cpf: Scalars['String']['input'];
  cumpriuEstagioProbatorio?: InputMaybe<Scalars['Boolean']['input']>;
  dataAssinaturaTcr: Scalars['Date']['input'];
  dataFimEstagioProbatorio?: InputMaybe<Scalars['Date']['input']>;
  dataIngressoPgd?: InputMaybe<Scalars['Date']['input']>;
  email: Scalars['String']['input'];
  matriculaSiape: Scalars['String']['input'];
  modalidadeExecucao: Scalars['Int']['input'];
  nome: Scalars['String']['input'];
  origemUnidade: OrigemUnidadeGql;
  tipoVinculo: TipoVinculoGql;
  unidadeExecucaoId: Scalars['ID']['input'];
};

export type CandidatoSelecaoInput = {
  criterio: CriteriosPrioridadeGql;
  id: Scalars['String']['input'];
  nome: Scalars['String']['input'];
};

export enum CompetenciaGql {
  AprovarPlanoEntregas = 'APROVAR_PLANO_ENTREGAS',
  AvaliarRegistros = 'AVALIAR_REGISTROS',
  RealizarSelecao = 'REALIZAR_SELECAO'
}

export type ConfirmarSelecaoInput = {
  candidatos: Array<CandidatoSelecaoInput>;
  criteriosTecnicos: Scalars['String']['input'];
  nVagas: Scalars['Int']['input'];
  unidadeExecucaoId: Scalars['ID']['input'];
};

export type ConformidadeEntidadeType = {
  __typename?: 'ConformidadeEntidadeType';
  comErro: Scalars['Int']['output'];
  enviados: Scalars['Int']['output'];
  pendentes: Scalars['Int']['output'];
  tipo: Scalars['String']['output'];
  total: Scalars['Int']['output'];
};

export type ContribuicaoType = {
  __typename?: 'ContribuicaoType';
  descricao: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  idContribuicao: Scalars['String']['output'];
  idEntrega?: Maybe<Scalars['String']['output']>;
  idPlanoEntregas?: Maybe<Scalars['String']['output']>;
  percentualContribuicao: Scalars['Int']['output'];
  planoTrabalhoId: Scalars['ID']['output'];
  rotulo?: Maybe<Scalars['String']['output']>;
  tipoContribuicao: Scalars['Int']['output'];
};

export type ConvocacaoType = {
  __typename?: 'ConvocacaoType';
  canalComunicacao: Scalars['String']['output'];
  dataComparecimentoPrevista: Scalars['Date']['output'];
  dataConvocacao: Scalars['Date']['output'];
  horarioComparecimento: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  localComparecimento: Scalars['String']['output'];
  motivo: Scalars['String']['output'];
  participanteId: Scalars['ID']['output'];
  periodoPresencialFim: Scalars['Date']['output'];
  periodoPresencialInicio: Scalars['Date']['output'];
  status: StatusConvocacaoGql;
  unidadeExecucaoId: Scalars['ID']['output'];
};

export type CriarAtoAutorizacaoInput = {
  autoridade: Scalars['String']['input'];
  dataPublicacao: Scalars['Date']['input'];
  referencia: Scalars['String']['input'];
};

export type CriarConvocacaoInput = {
  canalComunicacao: Scalars['String']['input'];
  chefiaUserId?: InputMaybe<Scalars['Int']['input']>;
  dataComparecimentoPrevista: Scalars['Date']['input'];
  dataConvocacao: Scalars['Date']['input'];
  horarioComparecimento: Scalars['String']['input'];
  localComparecimento: Scalars['String']['input'];
  motivo: Scalars['String']['input'];
  periodoPresencialFim: Scalars['Date']['input'];
  periodoPresencialInicio: Scalars['Date']['input'];
};

export type CriarEntregaInput = {
  dataEntrega: Scalars['Date']['input'];
  idEntrega: Scalars['String']['input'];
  metaEntrega: Scalars['Int']['input'];
  nomeEntrega: Scalars['String']['input'];
  nomeUnidadeDemandante: Scalars['String']['input'];
  nomeUnidadeDestinataria: Scalars['String']['input'];
  tipoMeta: TipoMetaGql;
};

export type CriarPlanoEntregasInput = {
  codUnidadeAutorizadora: Scalars['Int']['input'];
  codUnidadeExecutora: Scalars['Int']['input'];
  codUnidadeInstituidora: Scalars['Int']['input'];
  dataInicio: Scalars['Date']['input'];
  dataTermino: Scalars['Date']['input'];
  idPlanoEntregas: Scalars['String']['input'];
  origemUnidade: OrigemUnidadeGql;
  unidadeExecucaoId: Scalars['ID']['input'];
};

export type CriarPlanoTrabalhoInput = {
  cargaHorariaDisponivel: Scalars['Int']['input'];
  codUnidadeAutorizadora: Scalars['Int']['input'];
  codUnidadeExecutora: Scalars['Int']['input'];
  codUnidadeLotacaoParticipante: Scalars['Int']['input'];
  cpfParticipante: Scalars['String']['input'];
  criteriosAvaliacao: Scalars['String']['input'];
  dataInicio: Scalars['Date']['input'];
  dataTermino: Scalars['Date']['input'];
  idPlanoTrabalho: Scalars['String']['input'];
  matriculaSiape: Scalars['String']['input'];
  origemUnidade: OrigemUnidadeGql;
  planoEntregasId?: InputMaybe<Scalars['ID']['input']>;
};

export type CriarUnidadeAutorizadoraInput = {
  codUnidadeAutorizadora: Scalars['Int']['input'];
  nome: Scalars['String']['input'];
  origemUnidade: OrigemUnidadeGql;
  sigla: Scalars['String']['input'];
};

export type CriarUnidadeInstituidoraInput = {
  atoInstituicaoRef: Scalars['String']['input'];
  codUnidadeInstituidora: Scalars['Int']['input'];
  conteudoMinimoTcr: Scalars['String']['input'];
  criteriosSelecaoAdicionais?: InputMaybe<Scalars['String']['input']>;
  dataInstituicao: Scalars['Date']['input'];
  modalidadesAutorizadas: Array<Scalars['Int']['input']>;
  nivelProdutividadeAdicionalTt?: InputMaybe<Scalars['String']['input']>;
  nome: Scalars['String']['input'];
  prazoAntecedenciaConvocacaoDias: Scalars['Int']['input'];
  procedimentoRegistroComparecimento?: InputMaybe<Scalars['String']['input']>;
  sigla: Scalars['String']['input'];
  tiposAtividades: Scalars['String']['input'];
  vagasPercentualPresencial?: InputMaybe<Scalars['Int']['input']>;
  vagasPercentualTtExterior?: InputMaybe<Scalars['Int']['input']>;
  vagasPercentualTtIntegral?: InputMaybe<Scalars['Int']['input']>;
  vagasPercentualTtParcial?: InputMaybe<Scalars['Int']['input']>;
  vedacoesParticipacao?: InputMaybe<Scalars['String']['input']>;
};

export enum CriteriosPrioridadeGql {
  HorarioEspecial = 'HORARIO_ESPECIAL',
  MobilidadeReduzida = 'MOBILIDADE_REDUZIDA',
  Pcd = 'PCD',
  RespPcd = 'RESP_PCD',
  SemPrioridade = 'SEM_PRIORIDADE'
}

export enum DecisaoRecursoGql {
  Acatado = 'ACATADO',
  NaoAcatado = 'NAO_ACATADO'
}

export type DelegacaoCompetenciaType = {
  __typename?: 'DelegacaoCompetenciaType';
  ativo: Scalars['Boolean']['output'];
  competencia: CompetenciaGql;
  createdAt: Scalars['DateTime']['output'];
  dataFim?: Maybe<Scalars['Date']['output']>;
  dataInicio: Scalars['Date']['output'];
  deleganteUserId: Scalars['Int']['output'];
  delegatarioUserId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  motivo?: Maybe<Scalars['String']['output']>;
  unidadeExecucaoId?: Maybe<Scalars['ID']['output']>;
};

export type DelegarCompetenciaInput = {
  competencia: CompetenciaGql;
  dataFim?: InputMaybe<Scalars['Date']['input']>;
  dataInicio: Scalars['Date']['input'];
  delegatarioUserId: Scalars['Int']['input'];
  motivo?: InputMaybe<Scalars['String']['input']>;
  unidadeExecucaoId?: InputMaybe<Scalars['ID']['input']>;
};

export type EntregaType = {
  __typename?: 'EntregaType';
  dataEntrega: Scalars['Date']['output'];
  entregaCancelada: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  idEntrega: Scalars['String']['output'];
  metaEntrega: Scalars['Int']['output'];
  nomeEntrega: Scalars['String']['output'];
  nomeUnidadeDemandante: Scalars['String']['output'];
  nomeUnidadeDestinataria: Scalars['String']['output'];
  planoEntregasId: Scalars['ID']['output'];
  tipoMeta: TipoMetaGql;
};

export enum MotivoDesligamentoGql {
  APedido = 'A_PEDIDO',
  InteresseAdministracao = 'INTERESSE_ADMINISTRACAO',
  MudancaUnidade = 'MUDANCA_UNIDADE',
  PgdRevogado = 'PGD_REVOGADO'
}

export type Mutation = {
  __typename?: 'Mutation';
  abrirRecurso: AvaliacaoType;
  adicionarContribuicao: ContribuicaoType;
  aprovarPlanoEntregas: PlanoEntregasType;
  assinarTcrChefia: TcrType;
  atualizarStatusAto: AtoAutorizacaoType;
  autorizarAdicionalNoturno: AutorizacaoAdicionalNoturnoType;
  avaliarPlanoEntregas: PlanoEntregasType;
  avaliarRegistrosExecucao: AvaliacaoType;
  cadastrarParticipante: ParticipanteType;
  cancelarPlanoEntregas: PlanoEntregasType;
  cancelarPlanoTrabalho: PlanoTrabalhoType;
  concluirPlanoEntregas: PlanoEntregasType;
  confirmarSelecao: ProcessoSelecaoType;
  criarAtoAutorizacao: AtoAutorizacaoType;
  criarConvocacao: ConvocacaoType;
  criarEntrega: EntregaType;
  criarPlanoEntregas: PlanoEntregasType;
  criarPlanoTrabalho: PlanoTrabalhoType;
  criarUnidadeAutorizadora: UnidadeAutorizadoraType;
  criarUnidadeInstituidora: UnidadeInstituidoraType;
  decidirRecurso: AvaliacaoType;
  delegarCompetencia: DelegacaoCompetenciaType;
  desligarParticipante: ParticipanteType;
  iniciarExecucaoPlanoEntregas: PlanoEntregasType;
  iniciarExecucaoPlanoTrabalho: PlanoTrabalhoType;
  pactuarTcr: TcrType;
  registrarAfastamento: AfastamentoType;
  registrarAutorizacaoEquipamentos: TermoGuardaEquipamentoType;
  registrarExecucao: AvaliacaoType;
  reprocessarEnvio: Scalars['Boolean']['output'];
  revogarDelegacao: DelegacaoCompetenciaType;
  suspenderPgd: UnidadeInstituidoraType;
};


export type MutationAbrirRecursoArgs = {
  avaliacaoId: Scalars['ID']['input'];
  texto: Scalars['String']['input'];
};


export type MutationAdicionarContribuicaoArgs = {
  input: AdicionarContribuicaoInput;
  planoTrabalhoId: Scalars['ID']['input'];
};


export type MutationAprovarPlanoEntregasArgs = {
  input: AprovarPlanoEntregasInput;
};


export type MutationAssinarTcrChefiaArgs = {
  tcrId: Scalars['ID']['input'];
};


export type MutationAtualizarStatusAtoArgs = {
  atoId: Scalars['ID']['input'];
  status: StatusAtoGql;
};


export type MutationAutorizarAdicionalNoturnoArgs = {
  input: AutorizarAdicionalNoturnoInput;
};


export type MutationAvaliarPlanoEntregasArgs = {
  avaliacao: Scalars['Int']['input'];
  dataAvaliacao: Scalars['Date']['input'];
  planoId: Scalars['ID']['input'];
};


export type MutationAvaliarRegistrosExecucaoArgs = {
  avaliacaoId: Scalars['ID']['input'];
  dataAvaliacao: Scalars['Date']['input'];
  justificativa?: InputMaybe<Scalars['String']['input']>;
  nota: Scalars['Int']['input'];
};


export type MutationCadastrarParticipanteArgs = {
  input: CadastrarParticipanteInput;
};


export type MutationCancelarPlanoEntregasArgs = {
  planoId: Scalars['ID']['input'];
};


export type MutationCancelarPlanoTrabalhoArgs = {
  planoId: Scalars['ID']['input'];
};


export type MutationConcluirPlanoEntregasArgs = {
  planoId: Scalars['ID']['input'];
};


export type MutationConfirmarSelecaoArgs = {
  input: ConfirmarSelecaoInput;
};


export type MutationCriarAtoAutorizacaoArgs = {
  input: CriarAtoAutorizacaoInput;
  unidadeAutorizadoraId: Scalars['ID']['input'];
};


export type MutationCriarConvocacaoArgs = {
  input: CriarConvocacaoInput;
  participanteId: Scalars['ID']['input'];
  unidadeExecucaoId: Scalars['ID']['input'];
};


export type MutationCriarEntregaArgs = {
  input: CriarEntregaInput;
  planoEntregasId: Scalars['ID']['input'];
};


export type MutationCriarPlanoEntregasArgs = {
  input: CriarPlanoEntregasInput;
};


export type MutationCriarPlanoTrabalhoArgs = {
  input: CriarPlanoTrabalhoInput;
  participanteId: Scalars['ID']['input'];
};


export type MutationCriarUnidadeAutorizadoraArgs = {
  input: CriarUnidadeAutorizadoraInput;
};


export type MutationCriarUnidadeInstituidoraArgs = {
  input: CriarUnidadeInstituidoraInput;
  unidadeAutorizadoraId: Scalars['ID']['input'];
};


export type MutationDecidirRecursoArgs = {
  avaliacaoId: Scalars['ID']['input'];
  decisao: DecisaoRecursoGql;
  justificativa?: InputMaybe<Scalars['String']['input']>;
  novaNota?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationDelegarCompetenciaArgs = {
  input: DelegarCompetenciaInput;
};


export type MutationDesligarParticipanteArgs = {
  motivo: MotivoDesligamentoGql;
  participanteId: Scalars['ID']['input'];
};


export type MutationIniciarExecucaoPlanoEntregasArgs = {
  planoId: Scalars['ID']['input'];
};


export type MutationIniciarExecucaoPlanoTrabalhoArgs = {
  planoId: Scalars['ID']['input'];
};


export type MutationPactuarTcrArgs = {
  input: PactuarTcrInput;
  participanteId: Scalars['ID']['input'];
};


export type MutationRegistrarAfastamentoArgs = {
  input: RegistrarAfastamentoInput;
};


export type MutationRegistrarAutorizacaoEquipamentosArgs = {
  input: RegistrarAutorizacaoEquipamentosInput;
};


export type MutationRegistrarExecucaoArgs = {
  input: RegistrarExecucaoInput;
  planoTrabalhoId: Scalars['ID']['input'];
};


export type MutationReprocessarEnvioArgs = {
  entidadeId: Scalars['ID']['input'];
  tipoEntidade: Scalars['String']['input'];
};


export type MutationRevogarDelegacaoArgs = {
  delegacaoId: Scalars['ID']['input'];
};


export type MutationSuspenderPgdArgs = {
  motivo: Scalars['String']['input'];
  unidadeInstituidoraId: Scalars['ID']['input'];
};

export type NotificacaoType = {
  __typename?: 'NotificacaoType';
  conteudo: Scalars['String']['output'];
  contexto?: Maybe<Scalars['JSON']['output']>;
  createdAt: Scalars['DateTime']['output'];
  enviada: Scalars['Boolean']['output'];
  enviadaEm?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  tipoEvento: TipoEventoGql;
};

export enum OrigemUnidadeGql {
  Siape = 'SIAPE',
  Siorg = 'SIORG'
}

export type PactuarTcrInput = {
  acoesMelhoria?: InputMaybe<Scalars['String']['input']>;
  canaisComunicacao: Array<Scalars['String']['input']>;
  chefiaUserId?: InputMaybe<Scalars['Int']['input']>;
  cienciaCusteioEstrutura: Scalars['Boolean']['input'];
  cienciaInstalacoesErgonomia: Scalars['Boolean']['input'];
  cienciaNaoDireitoAdquirido: Scalars['Boolean']['input'];
  modalidadeExecucao: Scalars['Int']['input'];
  prazoAntecedenciaConvocacaoDias: Scalars['Int']['input'];
  regimeExecucao: RegimeExecucaoGql;
  responsabilidades: Scalars['String']['input'];
  saldoBancoHoras?: InputMaybe<Scalars['Int']['input']>;
  tcrAnteriorId?: InputMaybe<Scalars['ID']['input']>;
};

export type PainelConformidadeType = {
  __typename?: 'PainelConformidadeType';
  participantes: ConformidadeEntidadeType;
  planosEntregas: ConformidadeEntidadeType;
  planosTrabalho: ConformidadeEntidadeType;
};

export type ParticipanteType = {
  __typename?: 'ParticipanteType';
  codUnidadeAutorizadora: Scalars['Int']['output'];
  codUnidadeInstituidora: Scalars['Int']['output'];
  codUnidadeLotacao: Scalars['Int']['output'];
  cumpriuEstagioProbatorio?: Maybe<Scalars['Boolean']['output']>;
  dataAssinaturaTcr: Scalars['Date']['output'];
  dataDesligamento?: Maybe<Scalars['Date']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  matriculaSiape: Scalars['String']['output'];
  modalidadeExecucao: Scalars['Int']['output'];
  motivoDesligamento?: Maybe<MotivoDesligamentoGql>;
  nome: Scalars['String']['output'];
  origemUnidade: OrigemUnidadeGql;
  situacao: Scalars['Int']['output'];
  tipoVinculo: TipoVinculoGql;
  unidadeExecucaoId: Scalars['ID']['output'];
};

export type PlanoEntregasType = {
  __typename?: 'PlanoEntregasType';
  aprovadoPorUserId?: Maybe<Scalars['Int']['output']>;
  avaliacao?: Maybe<Scalars['Int']['output']>;
  codUnidadeAutorizadora: Scalars['Int']['output'];
  codUnidadeExecutora: Scalars['Int']['output'];
  codUnidadeInstituidora: Scalars['Int']['output'];
  dataAprovacao?: Maybe<Scalars['Date']['output']>;
  dataAvaliacao?: Maybe<Scalars['Date']['output']>;
  dataInicio: Scalars['Date']['output'];
  dataTermino: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  idPlanoEntregas: Scalars['String']['output'];
  origemUnidade: OrigemUnidadeGql;
  status: Scalars['Int']['output'];
  unidadeExecucaoId: Scalars['ID']['output'];
};

export type PlanoTrabalhoType = {
  __typename?: 'PlanoTrabalhoType';
  cargaHorariaDisponivel: Scalars['Int']['output'];
  codUnidadeAutorizadora: Scalars['Int']['output'];
  codUnidadeExecutora: Scalars['Int']['output'];
  codUnidadeLotacaoParticipante: Scalars['Int']['output'];
  contribuicoes: Array<ContribuicaoType>;
  criteriosAvaliacao: Scalars['String']['output'];
  dataInicio: Scalars['Date']['output'];
  dataTermino: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  idPlanoTrabalho: Scalars['String']['output'];
  origemUnidade: OrigemUnidadeGql;
  participanteId: Scalars['ID']['output'];
  planoEntregasId?: Maybe<Scalars['ID']['output']>;
  status: Scalars['Int']['output'];
  tcrId: Scalars['ID']['output'];
};

export type ProcessoSelecaoType = {
  __typename?: 'ProcessoSelecaoType';
  createdAt: Scalars['DateTime']['output'];
  criteriosTecnicos: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nVagas: Scalars['Int']['output'];
  resultado: Scalars['JSON']['output'];
  unidadeExecucaoId: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  health: Scalars['String']['output'];
  listarParticipantes: Array<ParticipanteType>;
  listarPlanosEntregas: Array<PlanoEntregasType>;
  listarPlanosTrabalho: Array<PlanoTrabalhoType>;
  me?: Maybe<UserType>;
  minhasNotificacoes: Array<NotificacaoType>;
  painelConformidade: PainelConformidadeType;
  participante?: Maybe<ParticipanteType>;
  planoEntregas?: Maybe<PlanoEntregasType>;
  planoTrabalho?: Maybe<PlanoTrabalhoType>;
  relatorioAfastamentos: Array<AfastamentoType>;
  relatorioAvaliacoesPendentes: Array<AvaliacaoType>;
  relatorioPeAvaliacaoPendente: Array<PlanoEntregasType>;
  relatorioRegistrosAtraso: Array<AvaliacaoType>;
  relatorioSemPlanoTrabalho: Array<ParticipanteType>;
  resultadosPublicos: Array<ResultadoPublicoType>;
  unidadeAutorizadora?: Maybe<UnidadeAutorizadoraType>;
  unidadeInstituidora?: Maybe<UnidadeInstituidoraType>;
};


export type QueryParticipanteArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlanoEntregasArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlanoTrabalhoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRelatorioAfastamentosArgs = {
  ano: Scalars['Int']['input'];
  codUnidadeAutorizadora: Scalars['Int']['input'];
  mes: Scalars['Int']['input'];
};


export type QueryRelatorioAvaliacoesPendentesArgs = {
  codUnidadeAutorizadora?: InputMaybe<Scalars['Int']['input']>;
  referencia: Scalars['Date']['input'];
};


export type QueryRelatorioPeAvaliacaoPendenteArgs = {
  codUnidadeAutorizadora?: InputMaybe<Scalars['Int']['input']>;
  referencia: Scalars['Date']['input'];
};


export type QueryRelatorioRegistrosAtrasoArgs = {
  codUnidadeAutorizadora?: InputMaybe<Scalars['Int']['input']>;
  referencia: Scalars['Date']['input'];
};


export type QueryRelatorioSemPlanoTrabalhoArgs = {
  codUnidadeAutorizadora?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUnidadeAutorizadoraArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUnidadeInstituidoraArgs = {
  id: Scalars['ID']['input'];
};

export enum RegimeExecucaoGql {
  Integral = 'INTEGRAL',
  Parcial = 'PARCIAL'
}

export type RegistrarAfastamentoInput = {
  dataFim?: InputMaybe<Scalars['Date']['input']>;
  dataInicio: Scalars['Date']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
  participanteId: Scalars['ID']['input'];
  tipoAfastamento: TipoAfastamentoGql;
};

export type RegistrarAutorizacaoEquipamentosInput = {
  dataAutorizacao: Scalars['Date']['input'];
  descricaoEquipamentos: Scalars['String']['input'];
  modalidadeExecucao: Scalars['Int']['input'];
  participanteId: Scalars['ID']['input'];
  tcrId: Scalars['ID']['input'];
};

export type RegistrarExecucaoInput = {
  dataFimPeriodoAvaliativo: Scalars['Date']['input'];
  dataInicioPeriodoAvaliativo: Scalars['Date']['input'];
  descricaoExecucao?: InputMaybe<Scalars['String']['input']>;
  idPeriodoAvaliativo: Scalars['String']['input'];
  ocorrencias?: InputMaybe<Scalars['String']['input']>;
};

export type ResultadoPublicoType = {
  __typename?: 'ResultadoPublicoType';
  codUnidadeExecutora: Scalars['Int']['output'];
  mediaAvaliacao?: Maybe<Scalars['Float']['output']>;
  nome: Scalars['String']['output'];
  totalPlanosAvaliados: Scalars['Int']['output'];
};

export enum StatusAtoGql {
  Ativo = 'ATIVO',
  Revogado = 'REVOGADO',
  Suspenso = 'SUSPENSO'
}

export enum StatusConvocacaoGql {
  Atendida = 'ATENDIDA',
  Cancelada = 'CANCELADA',
  NaoAtendida = 'NAO_ATENDIDA',
  Pendente = 'PENDENTE'
}

export enum StatusPgdGql {
  EmVigor = 'EM_VIGOR',
  Revogado = 'REVOGADO',
  Suspenso = 'SUSPENSO'
}

export enum StatusRecursoGql {
  Aberto = 'ABERTO',
  Encerrado = 'ENCERRADO'
}

export enum StatusTcrGql {
  Ativo = 'ATIVO',
  Cancelado = 'CANCELADO',
  Pendente = 'PENDENTE',
  Substituido = 'SUBSTITUIDO'
}

export type TcrType = {
  __typename?: 'TCRType';
  canaisComunicacao: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  modalidadeExecucao: Scalars['Int']['output'];
  participanteId: Scalars['ID']['output'];
  prazoAntecedenciaConvocacaoDias: Scalars['Int']['output'];
  prazoCompensacaoBancoHoras?: Maybe<Scalars['Date']['output']>;
  regimeExecucao: RegimeExecucaoGql;
  responsabilidades: Scalars['String']['output'];
  saldoBancoHoras?: Maybe<Scalars['Int']['output']>;
  status: StatusTcrGql;
};

export type TermoGuardaEquipamentoType = {
  __typename?: 'TermoGuardaEquipamentoType';
  dataAutorizacao: Scalars['Date']['output'];
  descricaoEquipamentos: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  participanteId: Scalars['ID']['output'];
  tcrId: Scalars['ID']['output'];
};

export enum TipoAfastamentoGql {
  Ferias = 'FERIAS',
  LicencaCapacitacao = 'LICENCA_CAPACITACAO',
  LicencaMaternidade = 'LICENCA_MATERNIDADE',
  LicencaMedica = 'LICENCA_MEDICA',
  Outros = 'OUTROS'
}

export enum TipoEventoGql {
  AvaliacaoRealizada = 'AVALIACAO_REALIZADA',
  ConvocacaoEmitida = 'CONVOCACAO_EMITIDA',
  DesligamentoRegistrado = 'DESLIGAMENTO_REGISTRADO',
  PgdSuspensoRevogado = 'PGD_SUSPENSO_REVOGADO',
  PlanoAprovado = 'PLANO_APROVADO',
  PrazoRegistroIminente = 'PRAZO_REGISTRO_IMINENTE',
  RecursoAberto = 'RECURSO_ABERTO',
  RecursoDecidido = 'RECURSO_DECIDIDO'
}

export enum TipoMetaGql {
  Percentual = 'PERCENTUAL',
  Unidade = 'UNIDADE'
}

export enum TipoVinculoGql {
  Comissionado = 'COMISSIONADO',
  ContratoDeterminado = 'CONTRATO_DETERMINADO',
  Efetivo = 'EFETIVO',
  EmpregadoPublico = 'EMPREGADO_PUBLICO',
  Estagiario = 'ESTAGIARIO'
}

export type UnidadeAutorizadoraType = {
  __typename?: 'UnidadeAutorizadoraType';
  codUnidadeAutorizadora: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  nome: Scalars['String']['output'];
  origemUnidade: OrigemUnidadeGql;
  pgdAutorizado: Scalars['Boolean']['output'];
  sigla: Scalars['String']['output'];
};

export type UnidadeInstituidoraType = {
  __typename?: 'UnidadeInstituidoraType';
  atoInstituicaoRef: Scalars['String']['output'];
  codUnidadeInstituidora: Scalars['Int']['output'];
  conteudoMinimoTcr: Scalars['String']['output'];
  dataInstituicao: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  nivelProdutividadeAdicionalTt?: Maybe<Scalars['String']['output']>;
  nome: Scalars['String']['output'];
  prazoAntecedenciaConvocacaoDias: Scalars['Int']['output'];
  sigla: Scalars['String']['output'];
  status: StatusPgdGql;
  unidadeAutorizadoraId: Scalars['ID']['output'];
};

export type UserType = {
  __typename?: 'UserType';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  role: Scalars['String']['output'];
};
