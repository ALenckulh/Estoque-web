"use client";

import Appbar from "@/components/Appbar/Appbar";
import AgGridExample from "@/components/TableExample/TableExample";
import TableHistoryEntity from "@/components/Tables/Entity/TableHistoryEntity";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Body1, Detail1, Detail4, Subtitle2 } from "@/components/ui/Typograph";
import { Box, Button, Card, Container, Grid, Typography } from "@mui/material";
import { Table } from "lucide-react";
import React, { useState } from "react";

export default function page() {
  const [selectedTab, setSelectedTab] = useState("items");

  return (
    <div>
      <Appbar
        showTabs={true}
        showAvatar={true}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
      />
      <div
        style={{
          margin: "24px",
          display: "flex",
          gap: "12px",
          flexDirection: "column",
          height: "calc(100vh - 112px)",
        }}
      >
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            minHeight: "244px",
            maxHeight: "344px",
            overflowY: "auto",
            border: "1px solid var(--neutral-30)",
          }}
        >
          <Container
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Detail1 style={{ paddingBottom: "4px" }}>Cód: 01203002</Detail1>
              <Body1>Nome da entidade</Body1>
            </Box>
            <Container
              style={{
                width: "fit-content",
                display: "flex",
                flexDirection: "row",
                gap: "32px",
                alignItems: "center",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Detail1 style={{ paddingBottom: "8px" }}>Criado em</Detail1>
                <Subtitle2>04/02/2004</Subtitle2>
              </Box>
              <Container
                style={{
                  width: "fit-content",
                  display: "flex",
                  flexDirection: "row",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Icon name="Pencil" />}
                >
                  Editar
                </Button>
                <IconButton
                  onClick={() => {}}
                  tooltip="Desativar"
                  buttonProps={{ color: "error", variant: "outlined" }}
                  icon="Trash"
                />
              </Container>
            </Container>
          </Container>
          <Box
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <Icon
              name="Circle"
              size={10}
              color="var(--success-10)"
              fill="var(--success-10)"
            />
            <Subtitle2>Ativo</Subtitle2>
          </Box>
          <Container
            style={{ display: "flex", flexDirection: "row", gap: "16px" }}
          >
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "20%",
                borderRight: "1px solid var(--neutral-40)",
                paddingRight: "8px",
              }}
            >
              <Detail1>Telefone</Detail1>
              <Subtitle2>+55 (47) 99229-3641</Subtitle2>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "20%",
                borderRight: "1px solid var(--neutral-40)",
                paddingRight: "8px",
              }}
            >
              <Detail1>E-mail</Detail1>
              <Subtitle2>e-mail@gmail.com</Subtitle2>
            </Box>
            <Box
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "60%",
                paddingRight: "8px",
              }}
            >
              <Detail1>Endereço</Detail1>
              <Subtitle2>
                País, Estado, Cidade, Bairro, Rua, N° da casa
              </Subtitle2>
            </Box>
          </Container>
          <Box style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Detail1>Descrição</Detail1>
            <Subtitle2>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. It is a long established fact that a reader will be
              distracted by the readable content of a page when looking at its
              layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using
              'Content here, content here', making it look like readable
              English. Many desktop publishing packages and web page editors now
              use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC,
              making it over 2000 years old. Richard McClintock, a Latin
              professor at Hampden-Sydney College in Virginia, looked up one of
              the more obscure Latin words, consectetur, from a Lorem Ipsum
              passage, and going through the cites of the word in classical
              literature, discovered the undoubtable source. Lorem Ipsum comes
              from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et
              Malorum" (The Extremes of Good and Evil) by Cicero, written in 45
              BC. This book is a treatise on the theory of ethics, very popular
              during the Renaissance. The first line of Lorem Ipsum, "Lorem
              ipsum dolor sit amet..", comes from a line in section 1.10.32.
            </Subtitle2>
          </Box>
        </Card>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: "500px",
            backgroundColor: "var(--neutral-30)",
            borderRadius: "8px",
          }}
        >
          <Box
            style={{
              paddingLeft: "16px",
              paddingTop: "8px",
              paddingBottom: "8px",
              display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: "4px",
            }}
          >
            <Icon name="History" size={14} color="var(--neutral-60)" />
            <Detail4>Histórico de Movimentação</Detail4>
          </Box>
          <TableHistoryEntity />
        </Box>
      </div>
    </div>
  );
}
