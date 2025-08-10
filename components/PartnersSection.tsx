'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const partners = [
  { name: 'Meta', logo: '/logos/meta.png' },
  { name: 'Google', logo: '/logos/google.png' },
  { name: 'Shopify', logo: '/logos/shopify.png' },
  { name: 'RD Station', logo: '/logos/rdstation.png' },
]

export default function PartnersSection() {
  return (
    <section className="py-16 px-6 bg-zinc-950 border-y border-zinc-800">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Integrada com as melhores plataformas do mercado
        </h2>
        <p className="text-gray-400 text-sm md:text-base mb-10">
          A Strattia já nasce conectada com os principais ecossistemas de tráfego, dados e performance.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                width={120}
                height={60}
                className="grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
