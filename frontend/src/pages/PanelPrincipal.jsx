import React from 'react'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

const cards = [
  {
    label: "Registrar Jugador",
    to: "/registrar-jugador",
    color: "bg-red-100 hover:bg-red-200",
    icon: "➕",
  },
  {
    label: "Buscar Jugador",
    to: "/buscar-jugador",
    color: "bg-blue-100 hover:bg-blue-200",
    icon: "🔍",
  },
  {
    label: "Lista de Aspirantes",
    to: "/jugadores-aspirantes",
    color: "bg-green-100 hover:bg-green-200",
    icon: "📝",
  },
  {
    label: "Ver Últimas Lesiones",
    to: "/ultimas-lesiones",
    color: "bg-yellow-100 hover:bg-yellow-200",
    icon: "💢",
  },
  {
    label: "Configuración",
    to: "/configuracion",
    color: "bg-gray-100 hover:bg-gray-200",
    icon: "⚙️",
  },
];

const PanelPrincipal = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Panel Principal</h1>
      <div className="flex flex-wrap gap-8 w-full max-w-6xl mx-auto">
        {cards.map(card => (
          <button
            key={card.label}
            onClick={() => navigate(card.to)}
            className={`flex flex-col items-center justify-center rounded-lg shadow-md p-10 transition-colors cursor-pointer ${card.color} aspect-square min-w-[180px] w-56`}
          >
            <span className="text-5xl mb-4">{card.icon}</span>
            <span className="text-lg font-semibold">{card.label}</span>
          </button>
        ))}
      </div>
    </Layout>
  )
}

export default PanelPrincipal
