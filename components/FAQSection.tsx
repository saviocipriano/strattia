'use client'

const faqs = [
  {
    question: 'A IA realmente gerencia as campanhas sozinha?',
    answer: 'Sim. A Strattia monitora dados em tempo real e aplica ajustes automáticos baseados em padrões de performance e aprendizado contínuo.'
  },
  {
    question: 'Preciso assinar contrato?',
    answer: 'Não. Todos os planos são mensais e você pode cancelar a qualquer momento sem burocracia.'
  },
  {
    question: 'Posso integrar mais de uma conta de anúncios?',
    answer: 'Sim. Cada plano possui um número de contas inclusas e você pode fazer upgrade sempre que quiser.'
  },
  {
    question: 'A plataforma serve para agências?',
    answer: 'Sim! A Strattia foi pensada desde o início para gestores que cuidam de múltiplos clientes.'
  }
]

export default function FAQSection() {
  return (
    <section className="py-20 px-6 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Perguntas Frequentes</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-zinc-800 rounded-lg p-5 hover:border-blue-500 transition">
              <h3 className="font-semibold text-lg mb-2 text-white">{faq.question}</h3>
              <p className="text-gray-400 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}