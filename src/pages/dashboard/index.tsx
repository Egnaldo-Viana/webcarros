import React from 'react';
import { Container } from '../../components/container';
import { DashboardHeader } from '../../components/panelheader';
import supabase from '../../services/superbaseClient';
import { AuthContext } from '../../contexts/AuthContext';

import { FiTrash2 } from 'react-icons/fi';

interface CarsProps {
  id: string;
  name: string;
  price: string | number;
  city: string;
  km: string;
  year: string;
  uid: string;
  images: ImageCarProps[];
}

interface ImageCarProps {
  name: string;
  uid: string;
  url: string;
}

export function Dashboard() {
  const [cars, setCars] = React.useState<CarsProps[]>([]);
  const [loadImages, setLoadImages] = React.useState<string[]>([]);

  const { user } = React.useContext(AuthContext);

  React.useEffect(() => {
    async function loadCars() {
      if (!user?.uid) {
        return;
      }
      const { data, error } = await supabase
        .from('carros')
        .select('*')
        .eq('user_id', user.uid);

      if (error) {
        console.error('Erro ao buscar carros:', error);
        return;
      }

      setCars(data || []);
    }
    loadCars();
  }, [user]);

  async function handleDeleteCar(car: CarsProps) {
    const imagePaths = car.images.map((image) => {
      return `images/${image.uid}/${image.name}`;
    });

    const { error: storageError } = await supabase.storage
      .from('car')
      .remove(imagePaths);

    if (storageError) {
      console.error('Erro ao deletar imagens:', storageError);
      return;
    }

    const { error } = await supabase.from('carros').delete().eq('id', car.id);
    console.log(error);

    if (error) {
      console.error('Erro ao deletar carro: ', error);
      return;
    }

    setCars((prev) => prev.filter((item) => item.id !== car.id));
  }

  function handleImageLoad(id: string) {
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
  }

  return (
    <Container>
      <DashboardHeader />
      <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <section key={car.id} className="w-full bg-white rounded-lg relative">
            <button
              onClick={() => handleDeleteCar(car)}
              className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2"
            >
              <FiTrash2 size={26} color="#000" />
            </button>
            <div
              className="w-full h-72 rounded-lg bg-slate-200 "
              style={{
                display: loadImages.includes(car.id) ? 'none' : 'block',
              }}
            ></div>
            <img
              className="w-full rounded-lg mb-2 "
              src={car.images?.[0]?.url}
              alt="carro"
              onLoad={() => handleImageLoad(car.id)}
              style={{
                display: loadImages.includes(car.id) ? 'block' : 'none',
              }}
            />
            <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

            <div className="flex flex-col px-2">
              <span className="text-zinc-700">
                Ano {car.year} | {car.km} km
              </span>
              <strong className="text-black font-bold mt-4">
                {' '}
                {Number(car.price).toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </strong>
            </div>

            <div className="w-full h-px bg-slate-200 my-2"> </div>
            <div className="px-2 pb-2">
              <span className="text-black">{car.city}</span>
            </div>
          </section>
        ))}
      </main>
    </Container>
  );
}
