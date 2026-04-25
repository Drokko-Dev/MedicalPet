import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['owner', 'vet']),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'owner',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    setErrorMsg('');
    try {
      await api.post('/auth/register', data);
      // Tras registro exitoso, redirigimos al login
      navigate('/login');
    } catch (error: any) {
      if (error.response?.status === 400) {
        setErrorMsg(error.response.data.detail || 'Error al registrar el usuario');
      } else {
        setErrorMsg('Ocurrió un error inesperado');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-8">
        <h2 className="text-2xl font-bold text-center text-[var(--color-foreground)] mb-6">
          Crear una Cuenta
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              {...register('full_name')}
              className={`w-full px-4 py-2 bg-[var(--color-background)] border ${
                errors.full_name ? 'border-red-500' : 'border-[var(--color-border)]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)] transition-colors`}
              placeholder="Juan Pérez"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-4 py-2 bg-[var(--color-background)] border ${
                errors.email ? 'border-red-500' : 'border-[var(--color-border)]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)] transition-colors`}
              placeholder="tu@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              className={`w-full px-4 py-2 bg-[var(--color-background)] border ${
                errors.password ? 'border-red-500' : 'border-[var(--color-border)]'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] text-[var(--color-foreground)] transition-colors`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">
              Soy un...
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="owner"
                  {...register('role')}
                  className="w-4 h-4 text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]"
                />
                <span className="text-[var(--color-foreground)]">Dueño de mascota</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="vet"
                  {...register('role')}
                  className="w-4 h-4 text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]"
                />
                <span className="text-[var(--color-foreground)]">Veterinario</span>
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 mt-2 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="text-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue-hover)] font-medium">
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
