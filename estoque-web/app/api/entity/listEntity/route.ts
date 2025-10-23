import { listEntities } from "@/lib/services/entity/list-entities";
import { NextResponse } from "next/server";

// GET -> listar todas entidades
export async function GET() {
  try {
    const entities = await listEntities();
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
