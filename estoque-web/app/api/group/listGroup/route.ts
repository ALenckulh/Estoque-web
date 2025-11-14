import { NextResponse } from "next/server";
import { readGroup } from "@/lib/services/group/list-groups";

// GET -> listar grupos por enterprise_id
export async function GET(request: Request) {
  try {
    const headerEnterpriseId = request.headers.get("x-enterprise-id");
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

    const groups = await readGroup(enterprise_id);
    return NextResponse.json({ success: true, groups });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/group/listGroup:
 *   get:
 *     summary: Lista grupos por enterprise
 *     description: Retorna os grupos (safe_delete=true) do enterprise informado via header ou query.
 *     parameters:
 *       - in: header
 *         name: x-enterprise-id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID do enterprise
 *       - in: query
 *         name: enterprise_id
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID do enterprise (alternativo ao header)
 *     responses:
 *       200:
 *         description: Lista de grupos retornada com sucesso
 *       400:
 *         description: Parâmetros inválidos
 *       500:
 *         description: Erro interno do servidor
 */
