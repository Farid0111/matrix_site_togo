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
    .select('price_fcfa, name')
    .eq('slug', 'neckcool-pro-2026')
    .eq('active', true)
    .maybeSingle()

  if (productError) throw productError
  if (!product) throw new Error('Produit introuvable')

  const price = product.price_fcfa
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
