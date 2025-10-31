import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/services/user/create-user';

// POST /api/user - Cria um novo usuário
export async function POST(req: NextRequest) {
    if (req.method !== 'POST') {
        return NextResponse.json({ error: 'Método não permitido' }, { status: 405 });
    }
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
        return NextResponse.json({ error: 'Nome, senha e email são obrigatórios.' }, { status: 400 });
    }
    try {
        const newUser = await createUser({ name, email, password });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao criar usuário.' }, { status: 500 });
    }
}