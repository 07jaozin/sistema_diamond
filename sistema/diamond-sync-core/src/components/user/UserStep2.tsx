import React, { useState } from 'react';
import { Calendar, MapPin, Ruler, Weight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import { SelectField } from '@/components/form/SelectField';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { UserRegistrationData } from '@/types/index';
import FileUpload from '@/components/form/FileUpload';

interface UserStep2Props {
  formData: UserRegistrationData;
  errors: Partial<Record<keyof UserRegistrationData, string>>;
  setFieldValue: (field: keyof UserRegistrationData, value: any) => void;
  setFieldTouched: (field: keyof UserRegistrationData) => void;
  onNext: () => void;
  onBack: () => void;
  validateForm: (fields?: (keyof UserRegistrationData)[]) => boolean;
}



export const UserStep2: React.FC<UserStep2Props> = ({
  formData,
  errors,
  setFieldValue,
  setFieldTouched,
  onNext,
  onBack,
  validateForm,
}) => {
  const handleNext = () => {
    const isValid = validateForm(['data_nascimento', 'cidade', 'estado']);
    if (isValid) {
      onNext();
    }
  };

  const [arquivoUnico, setArquivoUnico] = useState<boolean>(false);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Dados Pessoais</h2>
        <p className="text-muted-foreground">Informações sobre você</p>
      </div>

      <div className="space-y-4">
        <FormField
          label="Data de nascimento"
          type="date"
          value={formData.data_nascimento}
          onChange={(e) => setFieldValue('data_nascimento', e.target.value)}
          onBlur={() => setFieldTouched('data_nascimento')}
          error={errors.data_nascimento}
          icon={<Calendar className="w-5 h-5" />}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Cidade"
            type="text"
            placeholder="Sua cidade"
            value={formData.cidade}
            onChange={(e) => setFieldValue('cidade', e.target.value)}
            onBlur={() => setFieldTouched('cidade')}
            error={errors.cidade}
            icon={<MapPin className="w-5 h-5" />}
            required
          />

          <SelectField
            label="Estado"
            value={formData.estado}
            onChange={(value) => setFieldValue('estado', value)}
            options={[{ value: "SÃO PAULO", label: "São Paulo" }]}
            placeholder="Selecione"
            error={errors.estado}
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            label="Rua"
            type="string"
            placeholder="Rua onde mora"
            value={formData.rua || ''}
            onChange={(e) => setFieldValue('rua', e.target.value)}
            icon={<Ruler className="w-5 h-5" />}
          />

          <FormField
            label="Numero"
            type="number"
            placeholder="Ex: 70"
            value={formData.numero || 0}
            onChange={(e) => setFieldValue('numero', parseInt(e.target.value) || 0)}
            icon={<Weight className="w-5 h-5" />}
          />

          <FormField
            label="Complemento"
            type="number"
            value={formData.complemento || ''}
            onChange={(e) => setFieldValue('complemento', parseInt(e.target.value))}
            placeholder="Casa, ap, etc"
          />

          
        </div>
        
       

        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
          <div>
            <Label htmlFor="disponivel" className="font-medium">
              Disponível para oportunidades
            </Label>
            <p className="text-sm text-muted-foreground">
              Agentes e clubes poderão entrar em contato
            </p>
          </div>
          <Switch
            id="disponivel"
            checked={formData.ativo}
            onCheckedChange={(checked) => setFieldValue('ativo', checked)}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button variant="outline" size="lg" onClick={handleNext} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default UserStep2;