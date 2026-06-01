// Deno/Supabase Edge Function: gemini-analysis (now using Groq as per request)
// Ingests base64 image and description, calls Groq Vision, and returns structured hazard analysis.

// @ts-ignore
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { image, description } = await req.json();
    // @ts-ignore
    const groqApiKey = Deno.env.get('GROQ_API_KEY');
    if (!groqApiKey) {
      throw new Error('Missing GROQ_API_KEY');
    }

    // Clean base64 string if it contains data prefix (e.g. data:image/jpeg;base64,...)
    let base64Data = image;
    let mimeType = "image/jpeg";
    const dataPrefixMatch = image?.match(/^data:([^;]+);base64,(.*)$/);
    if (dataPrefixMatch) {
      mimeType = dataPrefixMatch[1];
      base64Data = dataPrefixMatch[2];
    }

    const aiPrompt = `You are CivicTwin AI, an advanced civic hazard classifier for Bhopal.
Analyze the attached photo of the hazard and the user's optional text description: "${description || "None provided"}".

Task:
Generate a structured JSON diagnostics report of the issue. You MUST respond with a valid JSON matching this schema:
{
  "category": "Roads" | "Sanitation" | "Water" | "Utility",
  "severity": number (integer 1 to 10 representing immediate public safety hazard),
  "description": string (clear, professional 2-sentence summary detailing the visual evidence and hazard implications),
  "department": "Municipal Corporation (PWD)" | "Sanitation Dept" | "Water Works Dept" | "MPEB (Electricity Board)"
}

Rules:
1. Category must strictly be one of: "Roads", "Sanitation", "Water", "Utility".
2. Match Category with the correct department:
   - "Roads" -> "Municipal Corporation (PWD)"
   - "Sanitation" -> "Sanitation Dept"
   - "Water" -> "Water Works Dept"
   - "Utility" -> "MPEB (Electricity Board)"
3. Output ONLY the raw JSON. Do not include markdown code block syntax.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: aiPrompt },
              { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64Data}` } }
            ]
          }
        ],
        temperature: 0.1,
      }),
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${await groqResponse.text()}`);
    }

    const groqData = await groqResponse.json();
    let aiAnalysis;
    try {
      const content = groqData.choices[0].message.content;
      const cleanedContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
      aiAnalysis = JSON.parse(cleanedContent);
    } catch (e) {
      console.error('Failed to parse Groq response:', groqData.choices[0].message.content);
      aiAnalysis = { category: 'Utility', severity: 5, description: 'AI analysis failed to parse.', department: 'MPEB (Electricity Board)' };
    }

    return new Response(JSON.stringify(aiAnalysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
