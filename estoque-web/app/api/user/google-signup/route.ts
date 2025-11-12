import { NextRequest, NextResponse } from "next/server";
import { createUserWithGoogle } from "@/lib/services/user/create-user-with-google";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { is_admin, is_owner, redirectTo } = body;

    // Validação dos parâmetros
    if (typeof is_admin !== "boolean") {
      return NextResponse.json(
        { error: "is_admin deve ser um boolean" },
        { status: 400 }
      );
    }

    if (typeof is_owner !== "boolean") {
      return NextResponse.json(
        { error: "is_owner deve ser um boolean" },
        { status: 400 }
      );
    }

    // Iniciar OAuth com Google
    const data = await createUserWithGoogle({
      is_admin,
      is_owner,
      redirectTo: redirectTo || undefined,
    });

    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error: any) {
    console.error("Erro ao iniciar OAuth com Google:", error);
    return NextResponse.json(
      { error: error?.message || "Erro ao iniciar OAuth com Google" },
      { status: 500 }
    );
  }
}
