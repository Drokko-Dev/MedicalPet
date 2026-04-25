import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuthStore } from '../../store/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setErrorMsg('');
    try {
      const formData = new URLSearchParams();
      formData.append('username', data.email);
      formData.append('password', data.password);

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      login(response.data.access_token);
      
      const user = useAuthStore.getState().user;
      if (user?.role === 'vet') {
        navigate('/vet/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMsg('Email o contraseña incorrectos');
      } else {
        setErrorMsg('Ocurrió un error inesperado');
      }
    }
  };

  return (
    <div className="flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-[var(--color-surface)] rounded-2xl shadow-sm border border-[var(--color-border)] p-8">
        <h2 className="text-2xl font-bold text-center text-[var(--color-foreground)] mb-6">
          Iniciar Sesión
        </h2>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand-green)] transition-colors disabled:opacity-70"
          >
            {isSubmitting ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-[var(--color-brand-blue)] hover:text-[var(--color-brand-blue-hover)] font-medium">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}
