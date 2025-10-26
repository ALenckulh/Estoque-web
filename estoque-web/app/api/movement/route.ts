import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// GET — listar movimentações
export async function GET(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // server-side
  );

  try {
    const url = new URL(req.url);
    const groupId = url.searchParams.get("group_id");
    const userId = url.searchParams.get("user_id");
    const enterpriseId = url.searchParams.get("enterprise_id");
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 20);
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("movement_history")
      .select(`
        group_id,
        nota_fiscal,
        date,
        user_id,
        enterprise_id,
        item_id,
        quantity
      `)
      .order("date", { ascending: false })
      .range(from, to);

    if (groupId) query = query.eq("group_id", groupId);
    if (userId) query = query.eq("user_id", userId);
    if (enterpriseId) query = query.eq("enterprise_id", enterpriseId);

    const { data, error } = await query;

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const formatted = data.map((m) => ({
      ...m,
      data_movimentacao: new Date(m.date).toLocaleDateString("pt-BR"),
    }));

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao buscar histórico de movimentações." },
      { status: 500 }
    );
  }
}

// POST — criar movimentações
export async function POST(req: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // client-side
  );

  const body = await req.json();

  const {
    type,
    lote,
    nota_fiscal,
    date,
    user_id,
    participate_id,
    enterprise_id,
    items,
  } = body;

  try {
    const { data: lastMovement } = await supabase
      .from("movement_history")
      .select("group_id")
      .order("group_id", { ascending: false })
      .limit(1)
      .single();

    const newGroupId = lastMovement ? lastMovement.group_id + 1 : 1;

    const movementsToInsert: any[] = [];

    for (const { item_id, quantity } of items) {
      const { data: item, error: itemError } = await supabase
        .from("item")
        .select("*")
        .eq("id", item_id)
        .eq("enterprise_id", enterprise_id)
        .eq("safe_delete", false)
        .single();

      if (itemError || !item) {
        return NextResponse.json(
          { error: `Item ${item_id} não encontrado.` },
          { status: 404 }
        );
      }

      let newQuantity = item.quantity;

      if (type === "entrada") {
        newQuantity += quantity;
      } else if (type === "saida") {
        if (item.quantity < quantity) {
          return NextResponse.json(
            { error: `Estoque insuficiente para o item ${item.name}.` },
            { status: 400 }
          );
        }
        newQuantity -= quantity;
      } else {
        return NextResponse.json(
          { error: "Tipo de movimentação inválido." },
          { status: 400 }
        );
      }

      const { error: updateError } = await supabase
        .from("item")
        .update({ quantity: newQuantity })
        .eq("id", item_id);

      if (updateError) throw updateError;

      movementsToInsert.push({
        group_id: newGroupId,
        lote,
        nota_fiscal,
        date,
        quantity,
        user_id,
        item_id,
        participate_id,
        safe_delete: false,
        created_at: new Date().toISOString(),
        enterprise_id,
      });
    }

    const { data: movements, error: movementError } = await supabase
      .from("movement_history")
      .insert(movementsToInsert)
      .select();

    if (movementError) throw movementError;

    return NextResponse.json({
      message: "Movimentação registrada com sucesso.",
      group_id: newGroupId,
      movements,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao registrar movimentação." },
      { status: 500 }
    );
  }
}