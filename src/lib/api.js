import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function submitOrder({ name, phone, city, address, color, quantity }) {
  if (!supabase) throw new Error('Configuration Supabase manquante')

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
    if (!supabase) return null
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
    if (!supabase) return []
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
