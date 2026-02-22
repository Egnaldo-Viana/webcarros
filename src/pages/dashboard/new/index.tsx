import React from 'react';
import { Container } from '../../../components/container';
import { DashboardHeader } from '../../../components/panelheader';
import { FiUpload } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../../../contexts/AuthContext';
import { v4 as uuidV4 } from 'uuid';
import supabase from '../../../services/superbaseClient';

const schema = z.object({
  name: z.string().nonempty('O campo nome é obrigatório'),
  model: z.string().nonempty('O modelo é obrigatório'),
  year: z.string().nonempty('O Ano do carro é obrigatório'),
  km: z.string().nonempty('O KM do carro é obrigatório'),
  price: z.string().nonempty('O preço é obrigatório'),
  city: z.string().nonempty('A cidade é obrigatória'),
  whatsapp: z
    .string()
    .min(1, 'O telefone é obrigatório')
    .refine((value) => /^(\d{11,12})$/.test(value), {
      message: 'Número de telefone inválido',
    }),
  description: z.string().nonempty('A descrição é obrigatória'),
});

type FormData = z.infer<typeof schema>;

export function New() {
  const { user } = React.useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onChange' });

  function onSubmit(data: FormData) {
    console.log(data);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === 'image/jpeg' || image.type === 'imagem/png') {
        await handleUpload(image);
      } else {
        alert('Envie uma imagem jpeg ou png !!!');
        return;
      }
    }
  }

  async function handleUpload(image: File) {
    if (!user?.uid) return;

    const currentUid = user.uid;
    const uidImage = uuidV4();

    const filePath = `images/${currentUid}/${uidImage}`;

    const { error } = await supabase.storage
      .from('car')
      .upload(filePath, image);

    if (error) {
      console.log('Erro no upload:', error.message);
      return;
    }

    const { data } = supabase.storage.from('car').getPublicUrl(filePath);

    const publicUrl = data.publicUrl;

    return publicUrl;
  }

  return (
    <Container>
      <DashboardHeader />
      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 ">
        <button className="border-2 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48 ">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer "
              onChange={handleFile}
            />
          </div>
        </button>
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0... "
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex "
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2020/2021... "
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">KM rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.567... "
              />
            </div>
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 99999999999... "
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: São Paulo - SP"
              />
            </div>
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 69.500... "
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register('description')}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro..."
            />
            {errors.description && (
              <p className="mb-1 text-red-500">{errors.description.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="rounded-md bg-zinc-900 text-white font-medium w-full h-10"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </Container>
  );
}
