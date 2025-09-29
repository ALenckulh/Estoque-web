import { listUsers } from "@/lib/services/user/list-users";
import { NextResponse } from "next/server";

// GET -> listar todos usuários
export async function GET() {
  try {
    const users = await listUsers();
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}