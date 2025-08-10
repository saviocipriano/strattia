'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    name: 'Lucas Pereira',
    feedback: 'Com a Strattia economizei 80% do meu tempo e dobrei meus resultados. É surreal.',
  },
  {
    name: 'Ana Souza',
    feedback: 'Nunca vi uma IA tão eficiente para tráfego. Vale cada centavo!',
  },
  {
    name: 'Marcos Lima',
    feedback: 'Uso a plataforma todos os dias. Contratos automatizados salvaram minha operação.',
  },
  {
    name: 'Juliana Ramos',
    feedback: 'A Strattia me fez parecer uma agência gigante mesmo trabalhando sozinho!',
  },
]

export default function TestimonialSlider() {
  return (
    <section className="py-20 px-6 bg-black border-t border-zinc-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          O que dizem nossos <span className="text-blue-500">clientes?</span>
        </h2>
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-6 w-[200%] animate-slide">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="min-w-[300px] bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-sm text-left"
              >
                <p className="text-gray-300 italic mb-4">“{t.feedback}”</p>
                <p className="text-sm text-gray-400">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
