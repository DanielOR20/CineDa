// backend/services/aiPeliculaService.js
async function autocompletarFichaPelicula(titulo) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DEEPSEEK_API_KEY no encontrada en .env');

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'Eres un catalogador cinematográfico profesional de CineDa. Devuelve ÚNICAMENTE un objeto JSON estrictamente válido, sin texto adicional, sin introducciones ni explicaciones.'
        },
        {
          role: 'user',
          content: `Devuelve un objeto JSON con la información técnica de la película "${titulo}":
{
  "titulo": "${titulo}",
  "genero": "Género principal",
  "duracion": 120,
  "clasificacion": "TE o +12 o +15 o +18",
  "sinopsis": "Sinopsis atractiva para cartelera de 2 a 3 líneas."
}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
    })
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'Error en la API de DeepSeek');
  }

  const rawText = data.choices?.[0]?.message?.content || '{}';
  const cleanJson = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/, '')
    .replace(/```$/g, '')
    .replace(/```/g, '')
    .trim();

  return JSON.parse(cleanJson);
}

module.exports = { autocompletarFichaPelicula };
