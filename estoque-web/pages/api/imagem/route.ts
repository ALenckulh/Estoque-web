import {NextResponse} from 'next/server';

// import {supabase} from "../../../../supabase/conexao";

export async function GET() {
    const response = await fetch('https://edzgcmswjcjlroeqhhbb.supabase.co/storage/v1/object/authenticated/imagens/Amvali.png', {
        method: 'GET',
        headers: {'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkemdjbXN3amNqbHJvZXFoaGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1NjgxMzcsImV4cCI6MjA1NjE0NDEzN30.rP3xEcckAXdpKYkuFdimOubrb-Mma9Gbnrl_GgYNa40'}
    });

    const data = await response.json();

    console.log(data);

    return NextResponse.json({message: 'Função ainda não implementada'});
}