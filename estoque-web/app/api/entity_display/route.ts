import { NextResponse } from "next/server";
import { readEntityDisplay } from "@/lib/services/entity_display/read-entity_display";

// GET -> retorna todas as entity_display configuradas para o enterprise
export async function GET(request: Request) {
  try {
    const headerEnterpriseId = request.headers.get("x-enterprise-id");
    const { searchParams } = new URL(request.url);
    const queryEnterpriseId = searchParams.get("enterprise_id");
    const rawEnterpriseId = headerEnterpriseId || queryEnterpriseId;

    if (!rawEnterpriseId) {
      return NextResponse.json(
        { success: false, message: "enterprise_id não informado" },
        { status: 400 }
      );
    }
    const enterprise_id = Number(rawEnterpriseId);
    if (Number.isNaN(enterprise_id) || enterprise_id <= 0) {
      return NextResponse.json(
        { success: false, message: "enterprise_id inválido" },
        { status: 400 }
      );
    }

    const entities = await readEntityDisplay(enterprise_id);
    return NextResponse.json({ success: true, entities });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/entity_display:
 *   get:
 *     summary: Lê display_name de entidade
 *     description: Retorna o display_name configurado para entidades, ou fallback.
 *     parameters:
 *       - in: header
 *         name: x-enterprise-id
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: enterprise_id
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: display_name retornado com sucesso
 *       400:
 *         description: Parâmetro inválido
 *       500:
 *         description: Erro interno
 */
