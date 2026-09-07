import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY manquantes dans .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function submitOrder({ name, phone, city, address, color, quantity }) {
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('price, name')
    .eq('active', true)
    .maybeSingle()

  if (productError) throw productError
  if (!product) throw new Error('Produit introuvable')

  const price = product.price
  const total = price * quantity

  const { error } = await supabase.from('orders_togo').insert({
    customer_name: name.trim(),
    customer_phone: phone.trim(),
    address: address.trim(),
    city: city.trim(),
    items: [
      {
        product: product.name,
        color,
        quantity,
        unit_price: price,
      },
    ],
    total,
  })

  if (error) throw error
}

export async function fetchSiteContent() {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('id', 'main')
      .maybeSingle()

    if (error) return null
    return data
  } catch {
    return null
  }
}

export async function fetchActiveProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: true })

    if (error) return []
    return data || []
  } catch {
    return []
  }
}
