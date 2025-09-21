import { insertUser } from '@/lib/data-base/inserir-usuario';
import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/services/create-user';
import { getAllUsers } from '@/lib/services/read-user';
import { updateUser } from '@/lib/services/update-user';
import { deleteUser } from '@/lib/services/delete-user';

/* // GET /api/user - Lista todos os usuários
export async function GET() {
    return NextResponse.json();
} */

export async function GET() {
    try {
        const users = await getAllUsers();
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Erro ao buscar usuários.' }, { status: 500 });
    }
}

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

/* // PUT /api/user?id=1 - Atualiza um usuário
export async function PUT(req: NextRequest) {
    const id = Number(req.nextUrl.searchParams.get('id'));
    if (!id) {
        return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }
    const { name, email } = await req.json();
    const user = users.find(u => u.id === id);
    if (!user) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }
    if (name) user.name = name;
    if (email) user.email = email;
    return NextResponse.json(user);
}
    */

// PUT /api/user?id=1 - Atualiza um usuário
export async function PUT(req: NextRequest) {
    const id = Number(req.nextUrl.searchParams.get('id'));

    if (!id) {
        return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }

    const { name, email, password, admin, enterprise_id } = await req.json();

    if (!name && !email && !password && admin === undefined && enterprise_id === undefined) {
        return NextResponse.json({ error: 'Nenhum campo para atualizar.' }, { status: 400 });
    }

    try {
        const updatedUser = await updateUser(id, { name, email, password, admin, enterprise_id });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/*
// DELETE /api/user?id=1 - Remove um usuário
export async function DELETE(req: NextRequest) {
    const id = Number(req.nextUrl.searchParams.get('id'));
    if (!id) {
        return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }
    const index = users.findIndex(u => u.id === id);
    if (index === -1) {
        return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 });
    }
    const deleted = users.splice(index, 1)[0];
    return NextResponse.json(deleted);
} */

// DELETE /api/user?id=1 - Remove um usuário
export async function DELETE(req: NextRequest) {
    const id = Number(req.nextUrl.searchParams.get('id'));

    if (!id) {
        return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }

    try {
        const deletedUser = await deleteUser(id);
        return NextResponse.json(deletedUser, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
