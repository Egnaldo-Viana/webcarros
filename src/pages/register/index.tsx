import React from 'react';
import { Container } from '../../components/container';
import logoImg from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router';

import { AuthContext } from '../../contexts/AuthContext';

import { Input } from '../../components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import supabase from '../../services/superbaseClient';

const schema = z.object({
  name: z.string().nonempty('O campo nome é obrigatório'),
  email: z
    .string()
    .email('Insira um email válido')
    .nonempty('O campo email é obrigatório'),
  password: z
    .string()
    .min(6, 'A senha deve ter no mínimo')
    .nonempty('O campo senha é obrigatório 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export function Register() {
  const { handleInfoUser } = React.useContext(AuthContext);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  async function onSubmit(dataForm: FormData) {
    const { name, email, password } = dataForm;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      console.log(error.message);
      return;
    }

    if (data.user) {
      handleInfoUser({
        name: data.user.user_metadata.name,
        email: data.user.email!,
        uid: data.user.id,
      });
    }

    console.log('Cadastro realizado com sucesso');
    navigate('/dashboard');
  }

  React.useEffect(() => {
    async function handleLogout() {
      await supabase.auth.signOut();
    }

    handleLogout();
  }, []);

  return (
    <div>
      <Container>
        <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4">
          <Link to="/" className="mb-6 max-w-sm w-full">
            <img className="w-full" src={logoImg} alt="logo do site" />
          </Link>
          <form
            className="bg-white max-w-xl w-full rounded-lg p-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-3">
              <Input
                type="text"
                placeholder="Digite seu nome completo..."
                name="name"
                error={errors.name?.message}
                register={register}
              />
            </div>

            <div className="mb-3">
              <Input
                type="email"
                placeholder="Digite seu email..."
                name="email"
                error={errors.email?.message}
                register={register}
              />
            </div>

            <div className="mb-3">
              <Input
                type="password"
                placeholder="Digite sua senha..."
                name="password"
                error={errors.password?.message}
                register={register}
              />
            </div>

            <button
              type="submit"
              className="bg-zinc-900 w-full rounded-md text-white font-medium h-10"
            >
              Cadastrar
            </button>
          </form>
          <Link to="/login"> Já possui uma conta? Faça o login!</Link>
        </div>
      </Container>
    </div>
  );
}
