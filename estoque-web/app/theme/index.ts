// theme.ts
import { alpha, createTheme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";

const theme = createTheme({
  palette,
  typography,
  breakpoints: {
    values: {
      xs: 0,
      sm: 500,  // antes era ~600
      md: 800,  // antes era ~900
      lg: 1100, // antes era ~1200
      xl: 1400, // antes era ~1536
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          variants: [
            //sucess
            {
              props: { variant: "contained", color: "success" },
              style: {
                color: "#fff",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: palette.success.light,
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
                  backgroundColor: alpha(palette.success.light, 0.1),
                },
              },
            },
            //secondary
            {
              props: { variant: "outlined", color: "secondary" },
              style: {
                borderColor: palette.secondary.dark,
                color: palette.secondary.light,
                "&:hover": {
                  backgroundColor: alpha(palette.secondary.dark, 0.2),
                },
                "&:focus": {
                  boxShadow: "none",
                },
              },
            },
            {
              props: { variant: "contained", color: "secondary" },
              style: {
                backgroundColor: palette.secondary.main,
                color: palette.secondary.light,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: palette.grey[200],
                  boxShadow: "none",
                },
                "&:focus": {
                  boxShadow: "none",
                },
              },
            },
            {
              props: { variant: "text", color: "secondary" },
              style: {
                paddingLeft: 16,
                paddingRight: 16,
                color: palette.secondary.light,
                "&:hover": {
                  backgroundColor: alpha(palette.grey[200], 0.4),
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
                  backgroundColor: palette.primary.light,
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
                  backgroundColor: alpha(palette.primary.light, 0.1),
                },
              },
            },
            //error
            {
              props: { variant: "contained", color: "error" },
              style: {
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: palette.error.light,
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
                  backgroundColor: alpha(palette.error.light, 0.1),
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
            borderColor: palette.secondary.dark,
          },
          "&:hover:not(.Mui-focused) fieldset": {
            borderColor: palette.grey[400],
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: palette.secondary.dark,
          padding: 12,
          "& .MuiSvgIcon-root": {
            fontSize: 28, // aumenta o quadradinho
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
    MuiTextField: {
      defaultProps: {
        size: "small", // mantém small como padrão
      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small", // mantém small como padrão
      },
    },
    MuiMenu: {
      styleOverrides: {
        root: {
          marginTop: 4,
        },
        paper: {
          maxHeight: 200, // altura máxima padrão
        },
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
    MuiFormControl: {
      defaultProps: {
        size: "small", // todos os FormControls por padrão serão small
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          maxHeight: 200,       // altura máxima do menu
          marginTop: 4,         // espaçamento do menu em relação ao input
        },
        option: {
          fontSize: "1rem",
          padding: "4px 15px",
        },
        noOptions: {
          fontSize: "1rem",    // tamanho da fonte
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.secondary.main,
          color: palette.grey[700],
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
      defaultProps: {
        fullWidth: true,
        maxWidth: "sm",
        BackdropProps: {
          sx: {
            backgroundColor: "var(--neutral-90/20)",
          },
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          // Body1
          fontSize: "24px", 
          fontWeight: 500,
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          // Subtitle2
          fontSize: "16px",
          fontWeight: 500,
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          marginTop: 4,
          boxShadow: "var(--shadow-sm)",
          padding: 24,
          border: `1px solid ${palette.grey[100]}`,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          width: 450,
          padding: 24,
        },
      },
    },
  },
});

export default theme;
