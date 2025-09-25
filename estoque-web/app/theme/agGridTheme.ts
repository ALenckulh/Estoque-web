import { themeAlpine, iconSetMaterial } from "ag-grid-community";

export const myTheme = themeAlpine.withPart(iconSetMaterial).withParams({
    // Wrapper
    backgroundColor: "var(--neutral-0)",
    foregroundColor: "var(--neutral-90)",
    borderColor: "var(--neutral-30)",
    wrapperBorderRadius: 8,
    wrapperBorder: true,
    fontSize: 16,
    iconColor: "var(--neutral-50)",

    // Column
    columnBorder: false,

    // Row
    rowBorder: true,
    rowHeight: 56,
    rowHoverColor: "var(--neutral-10)",

    // Cell
    cellHorizontalPadding: 16,

    // Header
    headerRowBorder: false,
    headerFontSize: 14,
    headerBackgroundColor: "var(--neutral-20)",
    headerTextColor: "var(--neutral-60)",
    headerFontWeight: "600",
    headerHeight: 36,

    // Checkbox
    checkboxCheckedBackgroundColor: "var(--primary-10)",
    checkboxBorderRadius: 4,
    checkboxUncheckedBorderColor: "var(--neutral-40)",
    checkboxCheckedShapeColor: "var(--neutral-0)",

    // Pagination
    paginationPanelHeight: 44,
});
