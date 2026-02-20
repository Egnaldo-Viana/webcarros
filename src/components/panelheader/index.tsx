import { Link } from 'react-router';
import supabase from '../../services/superbaseClient';

export function DashboardHeader() {
  async function handleLogout() {
    await supabase.auth.signOut();
  }
  return (
    <div className="w-full items-center flex h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/dashboard/new">Cadastrar carro</Link>

      <button className="ml-auto" onClick={handleLogout}>
        Sair da conta
      </button>
    </div>
  );
}
