"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { NotFound } from "@/components/NotFound";
import React from "react";

export default function page() {
  return (
    <div>
      <Appbar showTabs={false} showAvatar={false} /> {/*Verificar se esta logado e mostrar as tabs e avatar*/}
      <NotFound description="404 - Página não encontrada" />
    </div>
  );
}
