import { listEntities } from "@/lib/services/entity/list-entities";
import { NextResponse } from "next/server";

// GET -> listar todas entidades
export async function GET(request: Request) {
  try {
    // 1. Tenta obter enterprise_id do header (ex: x-enterprise-id)
    const headerEnterpriseId = request.headers.get("x-enterprise-id");
    // 2. Ou da query string (?enterprise_id=123)
    const { searchParams } = new URL(request.url);
    const queryEnterpriseId = searchParams.get("enterprise_id");

    const rawEnterpriseId = headerEnterpriseId || queryEnterpriseId;
    if (!rawEnterpriseId) {
      return NextResponse.json(
        { success: false, message: "enterprise_id não informado (header x-enterprise-id ou query ?enterprise_id=)" },
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

    const entities = await listEntities(enterprise_id);
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
 * /api/entity/listEntity:
 *   get:
 *     summary: Lista todas as entidades
 *     description: Retorna uma lista de todas as entidades registradas no banco de dados.
 *     responses:
 *       200:
 *         description: Lista de entidades retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entity'
 *       500:
 *         description: Erro interno do servidor
 */
