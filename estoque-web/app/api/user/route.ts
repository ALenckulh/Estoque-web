import { createUser } from '@/lib/services/user/create-user';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/user - Cria um novo usuário
export async function POST(req: NextRequest) {
    // Body pode conter: name (opcional), email, password, enterprise_id (opcional), is_admin?, is_owner?
    const body = await req.json().catch(() => ({}));
    const { name, email, password, enterprise_id: bodyEnterpriseId, is_admin, is_owner } = body || {};

    // enterprise_id também pode vir no header x-enterprise-id
    const headerEnterpriseId = req.headers.get('x-enterprise-id');
    const rawEnterpriseId = bodyEnterpriseId ?? headerEnterpriseId;

    if (!email || !password) {
        return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 });
    }
    if (!rawEnterpriseId) {
        return NextResponse.json({ error: 'enterprise_id é obrigatório (corpo ou header x-enterprise-id).' }, { status: 400 });
    }
    const enterprise_id = Number(rawEnterpriseId);
    if (Number.isNaN(enterprise_id) || enterprise_id <= 0) {
        return NextResponse.json({ error: 'enterprise_id inválido.' }, { status: 400 });
    }

    try {
        const newUser = await createUser({
            name,
            email,
            password,
            enterprise_id,
            is_admin,
            is_owner,
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Erro ao criar usuário.' }, { status: 500 });
    }
}