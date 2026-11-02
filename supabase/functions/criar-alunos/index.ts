// Cria logins de aluno de uma turma. Só o Adm ou o professor da turma pode chamar.
// Cada aluno entra com um código (ex.: TURMA7-K8SDQP), sem e-mail real:
// por baixo, o login é <codigo>@aluno.volt-up.app com o próprio código como senha.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const SEGURO = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sem 0/O, 1/I/L
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });

function sufixo(n = 6) {
  const a = new Uint32Array(n);
  crypto.getRandomValues(a);
  return Array.from(a, (x) => SEGURO[x % SEGURO.length]).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ erro: "use POST" }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  // Quem está chamando?
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  const { data: u } = await admin.auth.getUser(token);
  if (!u?.user) return json({ erro: "faça login" }, 401);

  const { turma_id, apelidos } = await req.json().catch(() => ({}));
  if (!turma_id || !Array.isArray(apelidos) || apelidos.length < 1 || apelidos.length > 60)
    return json({ erro: "envie turma_id e de 1 a 60 apelidos" }, 400);

  const { data: perfil } = await admin.from("perfis").select("papel").eq("id", u.user.id).single();
  const { data: turma } = await admin.from("turmas").select("id,nome,vagas,professor_id").eq("id", turma_id).single();
  if (!turma) return json({ erro: "turma não encontrada" }, 404);
  if (perfil?.papel !== "admin" && turma.professor_id !== u.user.id) return json({ erro: "sem permissão" }, 403);

  const { count } = await admin.from("perfis").select("id", { count: "exact", head: true }).eq("turma_id", turma_id);
  if ((count ?? 0) + apelidos.length > turma.vagas) return json({ erro: "vagas insuficientes" }, 409);

  const prefixo = String(turma.nome).toUpperCase().normalize("NFD").replace(/[^A-Z0-9]/g, "").slice(0, 6) || "TURMA";
  const criados: { apelido: string; codigo: string }[] = [];
  for (const bruto of apelidos) {
    const apelido = String(bruto).trim().slice(0, 18) || "Aluno";
    const codigo = `${prefixo}-${sufixo()}`;
    const { data: novo, error } = await admin.auth.admin.createUser({
      email: `${codigo.toLowerCase()}@aluno.volt-up.app`,
      password: codigo,
      email_confirm: true,
      user_metadata: { apelido },
    });
    if (error || !novo.user) return json({ erro: "falha ao criar " + apelido, criados }, 500);
    await admin.from("perfis").update({ apelido, turma_id, codigo, papel: "aluno" }).eq("id", novo.user.id);
    criados.push({ apelido, codigo });
  }
  return json({ criados });
});
