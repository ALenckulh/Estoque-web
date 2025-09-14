// theme.ts
import { alpha, createTheme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";

const theme = createTheme({
  palette,
  typography,
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
        option: {
          fontSize: "1rem",
          padding: "4px 15px",
        },
      },
    },
  },
});

export default theme;
