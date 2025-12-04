import { fetchMovementsByEnterprise } from "@/lib/data-base/movement/fetch-movements-by-enterprise";
import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";

interface ListMovementsParams {
  enterpriseId?: string | null;
  filters?: {
    safe_delete?: boolean;
    type?: "entrada" | "saida";
  };
}

export async function listMovements({
  enterpriseId,
  filters,
}: ListMovementsParams) {

  // Validação 1: enterprise_id é obrigatório
  if (!enterpriseId) {
    throw new Error("Parâmetro 'enterprise_id' é obrigatório.");
  }

  // Converter para número e validar
  const entId = Number(enterpriseId);
  if (Number.isNaN(entId) || entId <= 0) {
    throw new Error("Parâmetro 'enterprise_id' deve ser um número válido e maior que zero.");
  }

  const data = await fetchMovementsByEnterprise(entId, filters);

  // Build a map of user_id -> email
  const userIds = Array.from(
    new Set((data || []).map((m: any) => String(m.user_id)).filter(Boolean))
  );

  let userEmailMap: Record<string, string> = {};
  if (userIds.length > 0) {
    // Prefer getting email from Supabase Auth via service role
    // Fallback to public.users if needed
    const emailEntries: Array<[string, string]> = [];

    for (const uid of userIds) {
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(uid);
        if (!authError && authData?.user?.email) {
          emailEntries.push([uid, String(authData.user.email)]);
          continue;
        }
      } catch {}
      // Fallback: try public.users table
      try {
        const { data: userRow, error: userErr } = await supabase
          .from("users")
          .select("id, email")
          .eq("id", uid)
          .single();
        if (!userErr && userRow) {
          emailEntries.push([String(userRow.id), String(userRow.email ?? "")]);
        }
      } catch {}
    }

    userEmailMap = Object.fromEntries(emailEntries);
  }

  // Return movements without formatting the date here; keep original ISO/string
  // and attach user_email for display
  return (data || []).map((m: any) => ({
    ...m,
    user_email: userEmailMap[String(m.user_id)] ?? String(m.user_id ?? ""),
    // Keep original date; let the UI renderer format it appropriately
    date: m.date,
  }));
}