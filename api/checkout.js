import { MercadoPagoConfig, Preference } from 'mercadopago';

export default async function handler(req, res) {
  // 1. Configura tus credenciales (Usa Variables de Entorno)
  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

  if (req.method === 'POST') {
    try {
      const { unit_price, title } = req.body;

      const preference = new Preference(client);
      const result = await preference.create({
        body: {
          items: [
            {
              title: title || "Servicio BOOST3D",
              quantity: 1,
              unit_price: Number(unit_price),
              currency_id: 'CLP' // O tu moneda local
            }
          ],
          back_urls: {
            success: "https://tu-sitio.vercel.app", // Cambia por tu link real
            failure: "https://tu-sitio.vercel.app"
          },
          auto_return: "approved",
        }
      });

      // Enviamos el link de pago de vuelta al HTML
      res.status(200).json({ init_point: result.init_point });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}