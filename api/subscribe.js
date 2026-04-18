import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' })

  const { error } = await supabase.from('subscribers').insert({ email })

  if (error) {
    if (error.code === '23505') return res.status(200).json({ ok: true, alreadySubscribed: true })
    console.error('DB error:', error)
    return res.status(500).json({ error: 'Could not save subscriber' })
  }

  return res.status(200).json({ ok: true })
}
