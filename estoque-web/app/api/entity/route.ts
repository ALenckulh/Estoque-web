// app/api/entity/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createEntity } from "@/lib/services/entity/create-entity";

// POST -> criar entidade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entity = await createEntity(body);
    return NextResponse.json({ success: true, entity });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/entity:
 *   post:
 *     summary: Cria uma nova entidade
 *     description: Insere uma nova entidade no banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entity'
 *     responses:
 *       201:
 *         description: Entidade criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 *
 *   get:
 *     summary: Busca uma entidade (por ID se informado)
 *     description: Retorna uma entidade específica pelo ID via query param ou todas se não informado.
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         schema:
 *           type: string
 *           example: "8f9c2e12-4a63-4f3b-a091-3eebd7c6dbe1"
 *         description: ID da entidade a ser buscada
 *     responses:
 *       200:
 *         description: Entidade(s) encontrada(s)
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Entity'
 *                 - type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 *       404:
 *         description: Entidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 *
 * /api/entity/{id}:
 *   get:
 *     summary: Busca uma entidade pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "8f9c2e12-4a63-4f3b-a091-3eebd7c6dbe1"
 *     responses:
 *       200:
 *         description: Entidade encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       404:
 *         description: Entidade não encontrada
 *       500:
 *         description: Erro interno do servidor
 *
 *   put:
 *     summary: Atualiza uma entidade existente
 *     description: Atualiza os campos de uma entidade pelo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entity'
 *     responses:
 *       200:
 *         description: Entidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       400:
 *         description: ID ou dados inválidos
 *       500:
 *         description: Erro interno do servidor
 *
 *   patch:
 *     summary: Ativa ou desativa uma entidade (safe delete)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ativo:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Status da entidade atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       400:
 *         description: ID ou campo 'ativo' inválido
 *       500:
 *         description: Erro interno do servidor
 *
 *   delete:
 *     summary: Exclusão permanente de uma entidade
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entidade removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       400:
 *         description: ID inválido
 *       500:
 *         description: Erro interno do servidor
 */
