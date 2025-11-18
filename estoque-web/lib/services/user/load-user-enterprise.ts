import { findMyUserId } from "@/lib/services/user/find-my-user-id";

/**
 * Busca o enterprise_id do usuário logado através da API `/api/user/:id`
 * e armazena o resultado no `localStorage` (quando disponível).
 * Retorna a enterprise id como string ou `null`.
 */
export async function loadAndStoreUserEnterprise(): Promise<string | null> {
  try {
    const userId = await findMyUserId();
    if (!userId) return null;

    const resp = await fetch(`/api/user/${userId}`, { credentials: "same-origin" });
    if (!resp.ok) return null;

    const json = await resp.json().catch(() => null);
    const enterpriseId = json?.data?.user?.enterprise_id ?? json?.user?.enterprise_id ?? null;
    const value = enterpriseId != null ? String(enterpriseId) : null;

    if (typeof window !== "undefined") {
      try {
        if (value !== null) {
          localStorage.setItem("myUserEnterpriseId", value);
        } else {
          localStorage.removeItem("myUserEnterpriseId");
        }
      } catch (e) {
        // ignore localStorage errors
      }
    }

    return value;
  } catch (e) {
    return null;
  }
}

export default loadAndStoreUserEnterprise;
