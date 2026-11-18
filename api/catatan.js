import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const sql = neon(process.env.DATABASE_URL);

  if (req.method === 'POST') {
    const isi = String(req.body?.isi || '').trim();
    if (!isi || isi.length > 1000) {
      return res
        .status(400)
        .json({ error: 'Catatan kosong atau terlalu panjang (maks. 1000 karakter)' });
    }
    const rows = await sql`
      INSERT INTO catatan (isi) VALUES (${isi})
      RETURNING id, isi, created_at
    `;
    return res.status(201).json(rows[0]);
  }

  if (req.method === 'GET') {
    const rows = await sql`
      SELECT id, isi, created_at FROM catatan ORDER BY id DESC LIMIT 100
    `;
    return res.status(200).json(rows);
  }

  res.status(405).json({ error: 'Metode tidak diizinkan' });
}
