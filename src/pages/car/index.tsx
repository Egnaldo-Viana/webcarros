import React from 'react';
import { Container } from '../../components/container';
import { FaWhatsapp } from 'react-icons/fa';
import { useParams } from 'react-router';
import supabase from '../../services/superbaseClient';

interface CarProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string;
  created: string;
  price: string | number;
  owner: string;
  uid: string;
  whatsapp: string;
  images: ImagesCarProps[];
}

interface ImagesCarProps {
  uid: string;
  name: string;
  url: string;
}

export function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = React.useState<CarProps>();

  React.useEffect(() => {
    async function loadCars() {
      if (!id) {
        return;
      }

      const { data, error } = await supabase
        .from('carros')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erro ao buscar carro:', error);
        return;
      }
      setCar(data);
    }

    loadCars();
  }, [id]);

  return (
    <Container>
      <div>
        <h1>Slider</h1>
        {car && (
          <main className="w-full bg-white rounded-lg p-6 my-4">
            <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
              <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
              <h1 className="font-bold text-3xl text-black">
                {Number(car?.price).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </h1>
            </div>
            <p>{car?.model}</p>
            <div className="flex w-full gap-6 my-4">
              <div className="flex flex-col gap-4">
                <div>
                  <p>Cidade</p>
                  <strong>{car?.city}</strong>
                </div>
                <div>
                  <p>Ano</p>
                  <strong>{car?.year}</strong>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p>KM</p>
                  <strong>{car?.km}</strong>
                </div>
              </div>
            </div>

            <strong>Descrição:</strong>
            <p className="mb-4">{car?.description}</p>

            <strong>Telefone / WhatsApp </strong>
            <p>{car?.whatsapp}</p>

            <a className="bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer ">
              Conversar com o vendedor <FaWhatsapp size={26} color="#fff" />
            </a>
          </main>
        )}
      </div>
    </Container>
  );
}
