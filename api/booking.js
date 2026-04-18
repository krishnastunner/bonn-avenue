import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, event_type, proposed_date, city, note } = req.body

  if (!name || !email || !event_type) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // 1. Save to database
  const { error: dbError } = await supabase.from('bookings').insert({
    name, email, event_type, proposed_date, city, note,
  })

  if (dbError) {
    console.error('DB error:', dbError)
    return res.status(500).json({ error: 'Could not save booking' })
  }

  // 2. Send email notification via Resend (if key is set)
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Bonn Avenue Website <noreply@bonnavenue.in>',
          to: [process.env.BOOKING_NOTIFY_EMAIL || 'hello@bonnavenue.in'],
          subject: `New booking inquiry from ${name}`,
          html: `
            <h2>New Booking Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Event type:</strong> ${event_type}</p>
            <p><strong>Proposed date:</strong> ${proposed_date || '—'}</p>
            <p><strong>City:</strong> ${city || '—'}</p>
            <p><strong>Note:</strong><br/>${note || '—'}</p>
          `,
        }),
      })
    } catch (emailErr) {
      // Don't fail the request if email fails — booking is already saved
      console.error('Email error:', emailErr)
    }
  }

  return res.status(200).json({ ok: true })
}
