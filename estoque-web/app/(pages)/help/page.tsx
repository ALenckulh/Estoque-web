"use client";
import Image from "next/image";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Paper,
  Typography,
} from "@mui/material";
import { Icon } from "@/components/ui/Icon";
import { Subtitle1, Detail3 } from "@/components/ui/Typography";
import { Appbar } from "@/components/Appbar/appbar";

const LINKS = {
  reportBug: "https://forms.gle/t6UZiH8mVSPGigd18",
  suggestImprovement: "https://forms.gle/GL9vh84mFoLweN5w5",
  changeEmail: "https://forms.gle/4mcGdQyGxEhKX5eA9",
  requestAddition: "https://forms.gle/qswr736o6NzvqXrk8",
};

const accordionSx = {
  borderRadius: 2,
  boxShadow: "var(--shadow-sm)",
  overflow: "hidden",
  "&::before": { display: "none" },
  backgroundColor: "var(--neutral-0)",
  border: "1px solid var(--neutral-30)",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "var(--shadow-md)",
    borderColor: "var(--primary-10)",
  },
} as const;

export default function Page() {
  return (
    <>
      <Appbar selectedTab={""} />
      <div
        className="container"
        style={{ backgroundColor: "var(--neutral-10)", minHeight: "100vh" }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* Left side: Content */}
          <Box sx={{ flex: 1 }}>
            

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 4 },
                backgroundColor: "var(--neutral-0)",
                borderRadius: 3,
                border: "1px solid var(--neutral-30)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 5,
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: "var(--neutral-90)",
                  fontSize: { xs: "2rem", md: "2.5rem" },
                }}
              >
                Central de Ajuda
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "var(--neutral-60)",
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                }}
              >
                Encontre respostas rápidas para suas dúvidas ou entre em contato
                com nossa equipe
              </Typography>
            </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Accordion disableGutters sx={accordionSx}>
                  <AccordionSummary
                    expandIcon={<Icon name="ChevronDown" />}
                    aria-controls="help-bug"
                    id="help-bug"
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--neutral-10)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "100%",
                          backgroundColor: "var(--danger-0)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--neutral-0)",
                        }}
                      >
                        <Icon name="Bug" size={20} />
                      </Box>
                      <Subtitle1 sx={{ color: "var(--neutral-90)" }}>
                        Encontrei um erro no sistema
                      </Subtitle1>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                    <Box sx={{ pl: 7 }}>
                      <Detail3
                        sx={{
                          color: "var(--neutral-60)",
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        Se algo não está funcionando corretamente, nos avise!
                        Relatar bugs nos ajuda a manter o sistema estável e
                        confiável.
                      </Detail3>
                      <Button
                        component="a"
                        href={LINKS.reportBug}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        sx={{
                          backgroundColor: "var(--danger-10)",
                          color: "var(--neutral-0)",
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "var(--danger-30)",
                          },
                        }}
                      >
                        Relatar bug
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters sx={accordionSx}>
                  <AccordionSummary
                    expandIcon={<Icon name="ChevronDown" />}
                    aria-controls="help-suggestion"
                    id="help-suggestion"
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--neutral-10)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "var(--primary-10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--neutral-0)",
                        }}
                      >
                        <Icon name="Lightbulb" size={20} />
                      </Box>
                      <Subtitle1 sx={{ color: "var(--neutral-90)" }}>
                        Quero sugerir uma melhoria
                      </Subtitle1>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                    <Box sx={{ pl: 7 }}>
                      <Detail3
                        sx={{
                          color: "var(--neutral-60)",
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        Tem uma ideia para deixar o sistema melhor? Envie sua
                        sugestão — valorizamos o seu feedback!
                      </Detail3>
                      <Button
                        component="a"
                        href={LINKS.suggestImprovement}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        sx={{
                          backgroundColor: "var(--primary-20)",
                          color: "var(--neutral-0)",
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "var(--primary-10)",
                          },
                        }}
                      >
                        Enviar sugestão
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters sx={accordionSx}>
                  <AccordionSummary
                    expandIcon={<Icon name="ChevronDown" />}
                    aria-controls="help-email"
                    id="help-email"
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--neutral-10)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "var(--alert-10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--neutral-0)",
                        }}
                      >
                        <Icon name="Mail" size={20} />
                      </Box>
                      <Subtitle1 sx={{ color: "var(--neutral-90)" }}>
                        Preciso mudar o e-mail da minha conta
                      </Subtitle1>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                    <Box sx={{ pl: 7 }}>
                      <Detail3
                        sx={{
                          color: "var(--neutral-60)",
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        Mudou de e-mail ou digitou errado no cadastro? Solicite
                        a atualização do seu endereço de e-mail de forma rápida
                        e segura.
                      </Detail3>
                      <Button
                        component="a"
                        href={LINKS.changeEmail}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        sx={{
                          backgroundColor: "var(--alert-10)",
                          color: "var(--neutral-0)",
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "var(--alert-30)",
                          },
                        }}
                      >
                        Solicitar mudança de e-mail
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                <Accordion disableGutters sx={accordionSx}>
                  <AccordionSummary
                    expandIcon={<Icon name="ChevronDown" />}
                    aria-controls="help-addition"
                    id="help-addition"
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--neutral-10)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "var(--success-10)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--neutral-0)",
                        }}
                      >
                        <Icon name="CirclePlus" size={20} />
                      </Box>
                      <Subtitle1 sx={{ color: "var(--neutral-90)" }}>
                        Quero adicionar um novo item a uma lista
                      </Subtitle1>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                    <Box sx={{ pl: 7 }}>
                      <Detail3
                        sx={{
                          color: "var(--neutral-60)",
                          mb: 3,
                          lineHeight: 1.6,
                        }}
                      >
                        Deseja incluir uma nova unidade de medida, segmento,
                        fabricante ou grupo de item? Envie uma solicitação para
                        que nossa equipe analise e adicione o item à base de
                        dados.
                      </Detail3>
                      <Button
                        component="a"
                        href={LINKS.requestAddition}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                        sx={{
                          backgroundColor: "var(--success-10)",
                          color: "var(--neutral-0)",
                          textTransform: "none",
                          fontWeight: 600,
                          px: 3,
                          py: 1,
                          "&:hover": {
                            backgroundColor: "var(--success-20)",
                          },
                        }}
                      >
                        Solicitar adição
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Paper>
          </Box>

          <Box
            sx={{
              display: { xs: "none", lg: "flex" },
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              height: "100%",
            }}
          >
            <Image
              src="/illustrations/help.svg"
              alt="Ilustração de ajuda"
              width={500}
              height={500}
              style={{ maxWidth: "100%", height: "auto" }}
              priority
            />
          </Box>
        </Box>
      </div>
    </>
  );
}
