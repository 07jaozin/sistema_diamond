import React from 'react';
import { Mail, Lock, Eye, EyeOff, Phone, User, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form/FormField';
import FileUpload from '../form/FileUpload';
import type { UserRegistrationData } from '@/types/index';


interface UserStep1Props {
  formData: UserRegistrationData;
  errors: Partial<Record<keyof UserRegistrationData, string>>;
  setFieldValue: (field: keyof UserRegistrationData, value: any) => void;
  setFieldTouched: (field: keyof UserRegistrationData) => void;
  onNext: () => void;
  validateForm: (fields?: (keyof UserRegistrationData)[]) => boolean;
}

export const UserStep1: React.FC<UserStep1Props> = ({
  formData,
  errors,
  setFieldValue,
  setFieldTouched,
  onNext,
  validateForm,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [open, setOpen] = React.useState(true);

  const handleNext = () => {
    const isValid = validateForm(['nome', 'email', 'senha', 'confirmar_senha', 'telefone']);
    if (isValid) {
      onNext();
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  return (
  
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Dados Básicos</h2>
        <p className="text-muted-foreground">Informações para criar sua conta</p>
      </div>

  

      {/* Profile photo */}
      <div className="flex justify-center">
        <FileUpload
          variant="avatar"
          label="Foto de perfil"
          hint="Opcional - JPG ou PNG"
          accept="image/*"
          value={formData.foto_perfil}
          onChange={(file) => setFieldValue('foto_perfil', file)}
        />
      </div>

      <div className="space-y-4">
        <FormField
          label="Nome completo"
          type="text"
          placeholder="Seu nome completo"
          value={formData.nome}
          onChange={(e) => setFieldValue('nome', e.target.value)}
          onBlur={() => setFieldTouched('nome')}
          error={errors.nome}
          icon={<User className="w-5 h-5" />}
          required
        />

        <FormField
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFieldValue('email', e.target.value)}
          onBlur={() => setFieldTouched('email')}
          error={errors.email}
          icon={<Mail className="w-5 h-5" />}
          required
        />

        <FormField
          label="Telefone"
          type="tel"
          placeholder="(00) 00000-0000"
          value={formData.telefone}
          onChange={(e) => setFieldValue('telefone', formatPhone(e.target.value))}
          onBlur={() => setFieldTouched('telefone')}
          error={errors.telefone}
          icon={<Phone className="w-5 h-5" />}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <FormField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={formData.senha}
              onChange={(e) => setFieldValue('senha', e.target.value)}
              onBlur={() => setFieldTouched('senha')}
              error={errors.senha}
              icon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[42px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <FormField
              label="Confirmar senha"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repita a senha"
              value={formData.confirmar_senha}
              onChange={(e) => setFieldValue('confirmar_senha', e.target.value)}
              onBlur={() => setFieldTouched('confirmar_senha')}
              error={errors.confirmar_senha}
              icon={<Lock className="w-5 h-5" />}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-[42px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full mt-6"
        onClick={handleNext}
      >
        Continuar
      </Button>
    </div>

  );
};

export default UserStep1;