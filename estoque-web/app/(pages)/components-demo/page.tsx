"use client";

import React, { useState } from "react";

// Imports dos seus componentes
import { IconButton } from "@/components/IconButton";
import { PasswordField } from "@/components/PasswordField";
import { ErrorMenuItem } from "@/components/MenuItem/ErrorMenuItem";
import { Appbar } from "@/components/ui/Appbar/Appbar";
import { ToastButton } from "@/components/ui/Toast/ToastButton";
import { useToast } from "@/components/ui/Toast";
import { Home, Plus, Delete, Edit, Trash2, Calendar, X, User, Users, Truck } from "lucide-react"; // Importe os ícones adicionais

export default function ComponentsDemoPage() {
  const [password, setPassword] = useState("");
  const [currentTab, setCurrentTab] = useState(0); 
  const { Toast, showToast } = useToast();
  
  // Função de exemplo para o onClick
  const handleIconButtonClick = () => {
    console.log('IconButton clicado!');
    showToast("IconButton clicado com sucesso!", "success");
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Components Demo</h1>

      {/* Appbar */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Appbar</h2>
        <Appbar />
      </section>

      {/* IconButton */}
      <section>
        <h2 className="text-xl font-semibold mb-2">IconButton</h2>
        <div className="flex gap-6 p-6">
      <IconButton
        tooltip="Editar item"
        icon={<Edit />}
        color="primary"
      />

      <IconButton
        tooltip="Editar item"
        icon={<Calendar />}
        color="primary"
      />

      <IconButton
          tooltip="Home"
          icon={<Home />}
          color="error"
        />

      <IconButton
        tooltip="Deletar item"
        icon={<X />}
        color="error"
      />

      <IconButton
        tooltip="Caminhão"
        icon={<Truck />}
        color="success"
      />

      <IconButton
        tooltip="Usuário"
        icon={<User />}
        color="success"
      />

      <IconButton
        tooltip="Usuários"
        icon={<Users />}
        color="success"
      />
      
      <IconButton
        tooltip="Excluir item"
        icon={<Trash2 />}
        color="error"
      />
      <IconButton
        tooltip="Adicionar novo"
        icon={<Plus />}
        color="success"
      />
    </div>
        <p className="text-sm text-gray-600 mt-2">
          Passe o mouse sobre os ícones para ver os tooltips. Clique para ver as ações.
        </p>
      </section>

      {/* PasswordField */}
      <section>
        <h2 className="text-xl font-semibold mb-2">PasswordField</h2>
        <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
      </section>

      {/* Menu Items */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Menu Items</h2>
        <ErrorMenuItem onClick={() => alert("Clicou no item de erro")}>
          Sair
        </ErrorMenuItem>
      </section>

      {/* Toasts */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Toasts</h2>
        <div className="flex gap-4">
          <ToastButton />
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => showToast("Toast disparado da página!", "info")}
          >
            Testar Toast da Página
          </button>
        </div>
      </section>
      {Toast}
    </div>
  );
}