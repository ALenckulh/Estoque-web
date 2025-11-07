"use client";

import { Appbar } from "@/components/Appbar/appbar";
import TableHistoryItems from "@/components/Items/Tables/TableHistoryItems";
import { RowDataItem } from "@/components/Items/Tables/TableListItems";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { Body1, Detail1, Detail2, Detail4, Subtitle1, Subtitle2 } from "@/components/ui/Typograph";
import { itemList } from "@/utils/dataBaseExample";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Drawer,
    TextField,
    FormControl,
    InputLabel,
    InputAdornment,
    Select,
    MenuItem,
} from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import CopyTooltip from "@/components/ui/CopyTooltip";
import { NotFound } from "@/components/NotFound";
import { EntityIdLoading } from "@/components/Entity/Loading/EntityIdLoading";
import { ToastContainer, useToast } from "@/components/ui/Toast/Toast";
import TableMovimentHistory from "@/components/MovimentHistory/Tables/TableMovimentHistory";
import { DateField } from "@/components/ui/DateField";
import { Close, Add } from "@mui/icons-material";

type Option = {
    label: string;
    value: string | number;
};

export default function Page() {
    const [selectedTab, setSelectedTab] = useState("itens");
    const [item, setItem] = useState<RowDataItem | null>(null);
    const params = useParams();
    const id = params.id;
    const [openDrawer, setOpenDrawer] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openModalInactive, setOpenModalInactive] = useState(false);
    const [openModalActive, setOpenModalActive] = useState(false);
    const { toasts, showToast } = useToast();
    const [date, setDate] = React.useState<Date | null>(null);

    const [productItems, setProductItems] = useState([{ produto: null, quantidade: null }]);

    const produtoOptions: Option[] = [
        { label: "Produto A", value: "A" },
        { label: "Produto B", value: "B" },
        { label: "Produto C", value: "C" },
    ];

    const quantidadeOptions: Option[] = [
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5", value: 5 },
    ];

    const handleAddItem = () => {
        setProductItems([...productItems, { produto: null, quantidade: null }]);
    };

    const handleRemoveItem = (index: number) => {
        if (productItems.length > 1) {
            const newItems = productItems.filter((_, i) => i !== index);
            setProductItems(newItems);
        }
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        const newItems = [...productItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setProductItems(newItems);
    };

    return (
        <div>
            <Appbar
                showTabs={true}
                showAvatar={true}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
            />
            <div className="container">
                <>
                    <Card sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                        <Subtitle2>
                            Informações de <span style={{ color: '#E42D2D' }}>Saída</span>
                        </Subtitle2>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <TextField
                                multiline
                                rows={1}
                                label="NF"
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                multiline
                                rows={1}
                                label="Lote"
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Data de Movimentação"
                                type="date"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 2 }}
                            />
                            <TextField
                                multiline
                                rows={1}
                                label="Fornecedor (ID)"
                                sx={{ flex: 5 }}
                            />
                        </Box>
                    </Card>

                    <Card sx={{
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        mb: 2,
                        maxHeight: 400,
                        overflow: 'auto'
                    }}>
                        <Subtitle1>Produtos</Subtitle1>

                        {productItems.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                                <Autocomplete
                                    options={produtoOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={item.produto}
                                    onChange={(_, newValue) => handleUpdateItem(index, 'produto', newValue)}
                                    isOptionEqualToValue={(option, val) => option.value === val?.value}
                                    sx={{ flex: 1 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Produto"
                                            placeholder="Selecione..."
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                                <Autocomplete
                                    options={quantidadeOptions}
                                    getOptionLabel={(option) => option.label}
                                    value={item.quantidade}
                                    onChange={(_, newValue) => handleUpdateItem(index, 'quantidade', newValue)}
                                    isOptionEqualToValue={(option, val) => option.value === val?.value}
                                    sx={{ flex: 1 }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Quantidade"
                                            placeholder="Selecione..."
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />

                                {productItems.length > 1 && (
                                    <Button
                                        color="error"
                                        onClick={() => handleRemoveItem(index)}
                                        startIcon={<Icon name="X" />}
                                        sx={{ minWidth: 0 }}
                                    >
                                    </Button>
                                )}
                            </Box>
                        ))}

                        <Button
                            startIcon={<Add />}
                            onClick={handleAddItem}
                            variant="contained"
                            color="success"
                            sx={{ alignSelf: 'flex-start', mt: 1 }}
                        >
                            Adicionar item
                        </Button>
                    </Card>

                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                        <Button variant="text" color="secondary">
                            Cancelar
                        </Button>
                        <Button variant="contained">
                            Confirmar
                        </Button>
                    </Box>

                    <ToastContainer toasts={toasts} />
                </>
            </div>
        </div>
    );
}