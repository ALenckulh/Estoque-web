import React from "react";
import Image from "next/image";
import { Box, Card } from "@mui/material";
import { Subtitle1, H3 } from "../ui/Typography";
import { Appbar } from "../Appbar/appbar";

interface UnauthorizedProps {
  description: string;
}

export const Unauthorized = ({ description, ...props }: UnauthorizedProps) => {
  return (
    <div>
      <Appbar showTabs={true} showAvatar={true} selectedTab="" onTabChange={() => {}} />
      <div className="container" style={{ height: "calc(100vh - 64px)" }}>
        <Card sx={{height: "100%", overflow: "auto"}}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "100%",
              padding: 8,
            }}
          >
            <Image
              src="/illustrations/Unauthorized.svg"
              alt="Página não autorizada"
              width={400}
              height={400}
              style={{ maxWidth: "100%", width: "auto", minHeight: 300 }}
              {...props}
            />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, marginTop: 8 }}>
              <H3>401</H3>
              <Subtitle1 sx={{ color: "var(--neutral-70)" }}>{description}</Subtitle1>
            </Box>
          </Box>
        </Card>
        <Box sx={{ height: 16 }} />
      </div>
    </div>
  );
};
