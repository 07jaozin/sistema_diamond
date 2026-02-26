import { useState } from "react";
import {
  User,
  Users,
  Calendar,
  MapPin,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Diamond,
  FileImage,
} from "lucide-react";
import FileUpload from "@/components/FileUpload";
import SuccessScreen from "@/components/SuccessScreen";
import { enviarRelatorio, type RelatorioData } from "@/services/relatorioService";

const EQUIPE_OPTIONS = [
  "João",
  "Gabriel",
  "Vinicius",
  "Mauricio",
  "Patrick",
  "Raimundo",
];

const CIDADE_OPTIONS = ["Araraquara", "São Carlos", "Ibitinga"];

interface FormErrors {
  [key: string]: string;
}

const ReportForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [cliente, setCliente] = useState("");
  const [equipe, setEquipe] = useState<string[]>([]);
  const [dataExecucao, setDataExecucao] = useState("");
  const [cidade, setCidade] = useState("");
  const [servicoExecutado, setServicoExecutado] = useState("");
  const [pendencias, setPendencias] = useState("");
  const [status, setStatus] = useState("");
  const [precisaRetornar, setPrecisaRetornar] = useState("");
  const [anexos, setAnexos] = useState<File[]>([]);

  const toggleEquipe = (name: string) => {
    setEquipe((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
    if (errors.equipe) setErrors((e) => ({ ...e, equipe: "" }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!cliente.trim()) newErrors.cliente = "Campo obrigatório";
    if (equipe.length === 0) newErrors.equipe = "Selecione pelo menos um membro";
    if (!dataExecucao) newErrors.dataExecucao = "Campo obrigatório";
    if (!cidade) newErrors.cidade = "Selecione uma cidade";
    if (!servicoExecutado.trim()) newErrors.servicoExecutado = "Campo obrigatório";
    if (!pendencias.trim()) newErrors.pendencias = "Campo obrigatório";
    if (!status) newErrors.status = "Selecione o status";
    if (!precisaRetornar) newErrors.precisaRetornar = "Selecione uma opção";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const dados: RelatorioData = {
        cliente,
        equipe,
        data_execucao: dataExecucao,
        cidade,
        servico_executado: servicoExecutado,
        pendencias,
        status,
        precisa_retornar: precisaRetornar,
        anexos,
      };
      await enviarRelatorio(dados);
      setSubmitted(true);
    } catch {
      setErrors({ form: "Erro ao enviar relatório. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCliente("");
    setEquipe([]);
    setDataExecucao("");
    setCidade("");
    setServicoExecutado("");
    setPendencias("");
    setStatus("");
    setPrecisaRetornar("");
    setAnexos([]);
    setErrors({});
    setSubmitted(false);
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl gradient-card rounded-2xl border border-border shadow-2xl shadow-black/40">
          <SuccessScreen onReset={resetForm} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-10">
      <div className="w-full max-w-2xl gradient-card rounded-2xl border border-white shadow-2xl shadow-white/40 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-border">
          <div className="flex justify-between items-center gap-3 mb-1">
            <img className="w-44" src="https://res.cloudinary.com/dcdfpnnyp/image/upload/v1770139865/Sem_t%C3%ADtulo-removebg-preview_tmvrmd.png" alt="" />
            <div className="flex flex-col">
                <span className="text-lg font-medium tracking-wider text-white uppercase">
                    Diamond Automações
                </span>
                <span className="text-xs text-center font-extralight tracking-wider text-muted-foreground uppercase">
                    tecnologia audiovisual
                </span>
            </div>
            
          </div>
          <h1 className="text-2xl font-semibold text-foreground mt-4">
            Relatório Técnico
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Preencha todos os campos obrigatórios para enviar o relatório.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {errors.form && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 text-sm text-destructive">
              {errors.form}
            </div>
          )}

          {/* Cliente */}
          <FieldWrapper label="Cliente" icon={<User className="w-4 h-4" />} error={errors.cliente}>
            <input
              type="text"
              value={cliente}
              onChange={(e) => {
                setCliente(e.target.value);
                clearError("cliente");
              }}
              placeholder="Nome do cliente"
              className="form-input"
            />
          </FieldWrapper>

          {/* Equipe */}
          <FieldWrapper label="Equipe que executou o serviço" icon={<Users className="w-4 h-4" />} error={errors.equipe}>
            <div className="flex flex-wrap gap-2">
              {EQUIPE_OPTIONS.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => toggleEquipe(name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${
                    equipe.includes(name)
                      ? "bg-foreground text-primary-foreground border-foreground"
                      : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </FieldWrapper>

          {/* Data + Cidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FieldWrapper label="Data de execução" icon={<Calendar className="w-4 h-4" />} error={errors.dataExecucao}>
              <input
                type="date"
                value={dataExecucao}
                onChange={(e) => {
                  setDataExecucao(e.target.value);
                  clearError("dataExecucao");
                }}
                className="form-input"
              />
            </FieldWrapper>

            <FieldWrapper label="Cidade" icon={<MapPin className="w-4 h-4" />} error={errors.cidade}>
              <select
                value={cidade}
                onChange={(e) => {
                  setCidade(e.target.value);
                  clearError("cidade");
                }}
                className="form-input"
              >
                <option value="">Selecione</option>
                {CIDADE_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </FieldWrapper>
          </div>

          {/* Serviço Executado */}
          <FieldWrapper label="Serviço Executado" icon={<Wrench className="w-4 h-4" />} error={errors.servicoExecutado}>
            <textarea
              value={servicoExecutado}
              onChange={(e) => {
                setServicoExecutado(e.target.value);
                clearError("servicoExecutado");
              }}
              placeholder="Descreva o serviço executado..."
              rows={4}
              className="form-input resize-y min-h-[100px]"
            />
          </FieldWrapper>

          {/* Pendências */}
          <FieldWrapper label="Pendências" icon={<AlertTriangle className="w-4 h-4" />} error={errors.pendencias}>
            <textarea
              value={pendencias}
              onChange={(e) => {
                setPendencias(e.target.value);
                clearError("pendencias");
              }}
              placeholder='Descreva as pendências ou escreva "Nenhuma"'
              rows={3}
              className="form-input resize-y min-h-[80px]"
            />
          </FieldWrapper>

          {/* Status + Retorno */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FieldWrapper label="Status do Serviço" icon={<CheckCircle2 className="w-4 h-4" />} error={errors.status}>
              <div className="flex gap-3">
                {["Parcial", "Concluído"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 border ${
                      status === opt
                        ? "bg-foreground text-primary-foreground border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={opt}
                      checked={status === opt}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        clearError("status");
                      }}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </FieldWrapper>

            <FieldWrapper label="Precisa voltar futuramente?" icon={<RotateCcw className="w-4 h-4" />} error={errors.precisaRetornar}>
              <div className="flex gap-3">
                {["Sim", "Não"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 border ${
                      precisaRetornar === opt
                        ? "bg-foreground text-primary-foreground border-foreground"
                        : "bg-transparent text-muted-foreground border-border hover:border-foreground/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="precisaRetornar"
                      value={opt}
                      checked={precisaRetornar === opt}
                      onChange={(e) => {
                        setPrecisaRetornar(e.target.value);
                        clearError("precisaRetornar");
                      }}
                      className="sr-only"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </FieldWrapper>
          </div>

          {/* Anexos */}
          <FieldWrapper label="Anexos" icon={<FileImage className="w-4 h-4" />} optional>
            <FileUpload files={anexos} onChange={setAnexos} />
          </FieldWrapper>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-btn text-primary-foreground font-semibold py-3.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-white/10 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Relatório"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

/* Field Wrapper */

const FieldWrapper = ({
  label,
  icon,
  error,
  optional,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
      <span className="text-muted-foreground">{icon}</span>
      {label}
      {optional && (
        <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
      )}
    </label>
    {children}
    {error && (
      <p className="mt-1.5 text-xs text-destructive animate-fade-up">{error}</p>
    )}
  </div>
);

export default ReportForm;
