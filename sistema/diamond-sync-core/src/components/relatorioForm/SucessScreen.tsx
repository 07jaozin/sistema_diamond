import { CheckCircle2 } from "lucide-react";

interface SuccessScreenProps {
  onReset: () => void;
}

const SuccessScreen = ({ onReset }: SuccessScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 animate-fade-up">
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-success/20 animate-pulse-ring" />
        <div className="relative w-24 h-24 rounded-full bg-success/10 flex items-center justify-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="text-success"
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="currentColor"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <path
              d="M14 24L22 32L34 16"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-check-draw"
            />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-foreground mb-3 text-center">
        Relatório enviado com sucesso! ✅
      </h2>
      <p className="text-muted-foreground text-center mb-10 max-w-sm">
        Agradecemos o envio do relatório técnico.
      </p>

      <button
        onClick={onReset}
        className="gradient-btn text-primary-foreground font-medium px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-white/10 active:scale-[0.98]"
      >
        Enviar novo relatório
      </button>
    </div>
  );
};

export default SuccessScreen;
