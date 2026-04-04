import React, {useState} from 'react';
import { Loader2, Trophy, Shirt, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import { SelectField } from '@/components/form/SelectField';
import { Textarea } from '@/components/ui/textarea';
import type { UserRegistrationData } from '@/types/index';
import { useFuncoes } from '@/hooks/useServices';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserStep3Props {
  formData: UserRegistrationData;
  errors: Partial<Record<keyof UserRegistrationData, string>>;
  setFieldValue: (field: keyof UserRegistrationData, value: any) => void;
  setFieldTouched: (field: keyof UserRegistrationData) => void;
  enviar_codigo: () => void;
  onBack: () => void;
  validateForm: (fields?: (keyof UserRegistrationData)[]) => boolean;
  loading: boolean;
}

export const UserStep3: React.FC<UserStep3Props> = ({
  formData,
  errors,
  setFieldValue,
  setFieldTouched,
  enviar_codigo,
  onBack,
  validateForm,
  loading,
}) => {

  const { data: funcoes, isLoading, isError } = useFuncoes();
  const [funcaoId, setFuncaoId] = useState<string>("");

  const handleSubmit = () => {
    const isValid = validateForm(['funcao_id', 'data_inicio', 'observacao']);
    if (isValid) {
      enviar_codigo();
    }
  };

  const esporteSelecionado = funcoes?.find(
    (funcao) => funcao.id === formData.funcao_id
  );

  

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Perfil Esportivo</h2>
        <p className="text-muted-foreground">Informações sobre sua carreira</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select value={funcaoId} onValueChange={setFuncaoId}>
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione um carro"} />
            </SelectTrigger>
            <SelectContent>
              {funcoes.map((funcao) => (
                <SelectItem key={funcao.id} value={String(funcao.id)}>
                  {funcao.nome}
                </SelectItem>
              ))}
            </SelectContent>
        </Select>

          <FormField
          label="Data de inicio"
          type="date"
          value={formData.data_inicio}
          onChange={(e) => setFieldValue('data_inicio', e.target.value)}
          onBlur={() => setFieldTouched('data_inicio')}
          error={errors.data_inicio}
          icon={<Calendar className="w-5 h-5" />}
          required
        />
        </div>



        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Bio curta
          </label>
          <Textarea
            placeholder="Fale um pouco sobre você, suas conquistas e objetivos..."
            value={formData.observacao || ''}
            onChange={(e) => setFieldValue('observacao', e.target.value)}
            className="min-h-[100px] rounded-xl border-2 bg-secondary/30 focus:border-primary focus:bg-background transition-all"
          />
          <p className="text-xs text-muted-foreground">
            Máximo de 500 caracteres
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1" disabled={loading}>
          Voltar
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleSubmit}
          className="flex-1"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enviando codigo...
            </>
          ) : (
            <>
              <Trophy className="w-5 h-5" />
              Finalizar Cadastro
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserStep3;