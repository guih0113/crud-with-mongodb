import { type FormEvent, useEffect, useRef, useState } from 'react'
import { FiTrash } from 'react-icons/fi'
import { api } from './services/api'

interface CustomerProps {
  id: string
  name: string
  email: string
  status: boolean
  created_at: string
}

export default function App() {
  const [customers, setCustomers] = useState<CustomerProps[]>([])
  const nameRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const response = await api.get('/customers')
    setCustomers(response.data)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!nameRef.current?.value || !emailRef.current?.value) return

    const response = await api.post('/customer', {
      name: nameRef.current?.value,
      email: emailRef.current?.value
    })

    setCustomers((allCustomers) => [...allCustomers, response.data])

    nameRef.current.value = ''
    emailRef.current.value = ''
  }

  async function handleDelete(id: string) {
    try {
      await api.delete('/customer', {
        params: {
          id
        }
      })

      const allCustomers = customers.filter((customer) => customer.id !== id)
      setCustomers(allCustomers)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex min-h-screen w-full justify-center bg-slate-900 px-4 py-8 font-sans">
      <main className="my-10 w-full max-w-xl rounded-xl bg-slate-800 p-6 shadow-2xl md:max-w-2xl lg:max-w-3xl">
        <h1 className="mb-8 text-center font-extrabold text-5xl text-sky-400">Usuários</h1>

        <form className="my-6 flex flex-col space-y-5 rounded-lg bg-slate-700 p-6 shadow-lg" onSubmit={handleSubmit}>
          <label htmlFor="name" className="font-semibold text-gray-200 text-lg">
            Nome:
          </label>
          <input
            type="text"
            id="name"
            className="w-full rounded-md border border-slate-600 bg-slate-800 p-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-sky-500"
            placeholder="Digite o seu nome completo..."
            ref={nameRef}
          />

          <label htmlFor="email" className="font-semibold text-gray-200 text-lg">
            Email:
          </label>
          <input
            type="text"
            id="email"
            className="w-full rounded-md border border-slate-600 bg-slate-800 p-3 text-white placeholder-gray-400 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-sky-500"
            placeholder="Digite o seu email..."
            ref={emailRef}
          />

          <input
            type="submit"
            value="Cadastrar"
            className="w-full transform cursor-pointer rounded-md bg-emerald-600 p-3 font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-emerald-700 hover:shadow-lg"
          />
        </form>

        <section className="mt-8 flex flex-col gap-5">
          {customers.map((customer) => (
            <article
              key={customer.id}
              className="relative w-full rounded-lg border border-slate-600 bg-slate-700 p-5 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <p className="mb-1 text-base text-gray-200">
                <span className="font-semibold text-gray-400">Nome:</span> {customer.name}
              </p>
              <p className="mb-1 text-base text-gray-200">
                <span className="font-semibold text-gray-400">Email:</span> {customer.email}
              </p>
              <p className="text-base text-gray-200">
                <span className="font-semibold text-gray-400">Status:</span> {customer.status ? 'ATIVO' : 'INATIVO'}
              </p>

              <button
                type="button"
                className="absolute top-3 right-3 flex h-9 w-9 transform cursor-pointer items-center justify-center rounded-full bg-red-600 shadow-md transition-all duration-200 hover:scale-110 hover:bg-red-700"
                onClick={() => handleDelete(customer.id)}
              >
                <FiTrash size={20} color="#fff" />
              </button>
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}
