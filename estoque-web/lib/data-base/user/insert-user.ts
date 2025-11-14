import { supabase } from "@/utils/supabase/supabaseClient";
import { supabaseAdmin } from "@/utils/supabase/supabaseAdmin";
import { User } from "../../models/user_model";

/**
 * - `name` and `email` are stored in the Auth system's metadata (e.g., Supabase Auth / auth.users)
 *   rather than in the public.users table. This avoids duplicating personal data across systems
 */
export async function insertUser(user: User) {
  const { name, email, ...userDataForDB } = user;

  const { error } = await supabase.from("users").insert(userDataForDB);

  // 23505 = violação de chave única (pode ocorrer se tentar reutilizar um id já existente)
  if (error?.code === "23505") {
    throw new Error("Usuário já existe (chave duplicada).");
  }
  if (error) {
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );

    if (deleteError) {
      throw new Error(
        `Falha ao inserir usuário na tabela E ao deletar do Auth (rollback falhou): ${error.message} | ${deleteError.message}`
      );
    }
    throw new Error(`Erro ao inserir usuário: ${error.message}`);
  }

  console.log(`Usuário ${user.id} inserido com sucesso!`);
}
