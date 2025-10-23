// theme.ts
import { createTheme } from "@mui/material/styles";
import { typography } from "./typography";
import { palette } from "./palette";

const theme = createTheme({
  typography,
  palette,
  breakpoints: {
    values: {
      xs: 0,
      sm: 500, // antes era ~600
      md: 800, // antes era ~900
      lg: 1100, // antes era ~1200
      xl: 1400, // antes era ~1536
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          variants: [
            //sucess
            {
              props: { color: "success" },
              style: {
                "&:hover": {
                  backgroundColor: "rgba(var(--success-20-rgb), 0.1)",
                },
              },
            },
            //secondary
            {
              props: { color: "secondary" },
              style: {
                color: "var(--neutral-70)",
                "&:hover": {
                  backgroundColor: "rgba(var(--neutral-30-rgb), 0.4)",
                },
              },
            },
            //primary
            {
              props: { color: "primary" },
              style: {
                "&:hover": {
                  backgroundColor: "rgba(var(--primary-20-rgb), 0.1)",
                },
              },
            },
            //error
            {
              props: { color: "error" },
              style: {
                "&:hover": {
                  backgroundColor: "rgba(var(--danger-30-rgb), 0.1)",
                },
              },
            },
          ],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          marginLeft: "0 !important",
          variants: [
            //sucess
            {
              props: { variant: "contained", color: "success" },
              style: {
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--success-20)",
                  boxShadow: "none",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              },
            },
            {
              props: { variant: "text", color: "success" },
              style: {
                paddingLeft: 16,
                paddingRight: 16,
                "&:hover": {
                  backgroundColor: "rgba(var(--success-20-rgb), 0.1)",
                },
              },
            },
            //secondary
            {
              props: { variant: "outlined", color: "secondary" },
              style: {
                borderColor: "var(--neutral-40)",
                color: "var(--neutral-80)",
                "&:hover": {
                  backgroundColor: "rgba(var(--neutral-40-rgb), 0.2)",
                },
                "&:focus": {
                  boxShadow: "none",
                },
                "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                  color: "var(--neutral-70)", // força só o ícone
                },
              },
            },
            {
              props: { variant: "contained", color: "secondary" },
              style: {
                backgroundColor: "var(--neutral-20)",
                color: "var(--neutral-80)",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--neutral-30)",
                  boxShadow: "none",
                },
                "&:focus": {
                  boxShadow: "none",
                },
                "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                  color: "var(--neutral-70)", // força só o ícone
                },
              },
            },
            {
              props: { variant: "text", color: "secondary" },
              style: {
                paddingLeft: 16,
                paddingRight: 16,
                color: "var(--neutral-80)",
                "&:hover": {
                  backgroundColor: "rgba(var(--neutral-30-rgb), 0.4)",
                },
                "& .MuiButton-startIcon, & .MuiButton-endIcon": {
                  color: "var(--neutral-70)", // força só o ícone
                },
              },
            },
            //primary
            {
              props: { variant: "contained", color: "primary" },
              style: {
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--primary-20)",
                  boxShadow: "none",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              },
            },
            {
              props: { variant: "text", color: "primary" },
              style: {
                paddingLeft: 16,
                paddingRight: 16,
                "&:hover": {
                  backgroundColor: "rgba(var(--primary-20-rgb), 0.1)",
                },
              },
            },
            //error
            {
              props: { variant: "contained", color: "error" },
              style: {
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "var(--danger-30)",
                  boxShadow: "none",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              },
            },
            {
              props: { variant: "text", color: "error" },
              style: {
                paddingLeft: 16,
                paddingRight: 16,
                "&:hover": {
                  backgroundColor: "rgba(var(--danger-30-rgb), 0.1)",
                },
              },
            },
          ],
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          fontSize: "1rem",
          "& fieldset": {
            borderColor: "var(--neutral-40)",
          },
          "&:hover:not(.Mui-focused) fieldset": {
            borderColor: "var(--neutral-50)",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "var(--neutral-40)",
          padding: 12,
          "& .MuiSvgIcon-root": {
            fontSize: 28,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
        },
      },
    },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiSelect: { defaultProps: { size: "small" } },
    MuiMenu: {
      styleOverrides: {
        root: { marginTop: 4 },
        paper: { maxHeight: 200 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          padding: "4px 15px",
        },
      },
    },
    MuiFormControl: { defaultProps: { size: "small" } },
    MuiAutocomplete: {
      styleOverrides: {
        paper: { maxHeight: 200, marginTop: 4 },
        option: { fontSize: "1rem", padding: "4px 15px" },
        noOptions: { fontSize: "1rem" },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--neutral-20)",
          color: "var(--neutral-60)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 64,
          boxShadow: "var(--shadow-sm)",
          backgroundColor: "var(--neutral-0)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: "24px",
          borderRadius: "24px",
        },
      },
      defaultProps: {
        fullWidth: true,
        maxWidth: "sm",
        BackdropProps: {
          sx: { backgroundColor: "var(--neutral-90/20)" },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "0px",
          paddingTop: "24px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontSize: "24px", fontWeight: 500, padding: "0px" },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: { fontSize: "16px", fontWeight: 500, paddingTop: "20px" },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "0px",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          marginTop: 4,
          boxShadow: "var(--shadow-sm)",
          border: "1px solid var(--neutral-20)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { width: 450, padding: 24 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "var(--neutral-70)",
          padding: "4px 8px",
          borderRadius: 4,
        },
        arrow: { color: "var(--neutral-70)" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "24px",
          boxShadow: "var(--shadow-sm)",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: "16px",
          color: "var(--neutral-100)",    // opcional
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        disableGutters: true,
      },
      styleOverrides: {
        root: {
          margin: 0,
          maxWidth: "100% !important",
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "var(--neutral-40)",
        },
      },
      defaultProps: {
        animation: "pulse",
        color: "var(--neutral-20)",
      },
    },
  },
});

export default theme;
