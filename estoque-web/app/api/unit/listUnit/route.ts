import { NextResponse } from "next/server";
import { listUnit } from "@/lib/services/unit/list-unit";

// GET -> listar unidades por enterprise_id
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

    const units = await listUnit(enterprise_id);
    return NextResponse.json({ success: true, units });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/unit/listUnit:
 *   get:
 *     summary: Lista unidades
 *     description: Retorna unidades (safe_delete=true) de um enterprise.
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
 *         description: Lista retornada
 *       400:
 *         description: Parâmetro inválido
 *       500:
 *         description: Erro interno
 */
