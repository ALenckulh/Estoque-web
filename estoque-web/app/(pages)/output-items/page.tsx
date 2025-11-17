"use client";

import { Appbar } from "@/components/Appbar/appbar";
import { Icon } from "@/components/ui/Icon";
import { Detail4, Subtitle1, Subtitle2 } from "@/components/ui/Typography";
import { ToastContainer } from "@/components/ui/Toast/Toast";
import { useToast } from "@/hooks/toastHook";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Add } from "@mui/icons-material";

type Option = {
    label: string;
    value: string | number;
};

export default function Page() {
    const [selectedTab, setSelectedTab] = useState("itens");
    const params = useParams();
    const { toasts, showToast } = useToast();

    const [productItems, setProductItems] = useState([{ produto: null, quantidade: null }]);

    const produtoOptions: Option[] = [
        { label: "Produto A", value: "A" },
        { label: "Produto B", value: "B" },
        { label: "Produto C", value: "C" },
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
                        <Card sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1, mb: 1, minHeight: 115 }}>
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
                            height: '70vh',
                            overflow: 'auto',
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
                                                placeholder="Produto"
                                                variant="outlined"
                                                size="small"
                                                inputProps={{
                                                    ...params.inputProps,
                                                    style: { color: '#1B1D20' }
                                                }}
                                            />
                                        )}
                                    />
                                    <TextField
                                        placeholder="Quantidade"
                                        variant="outlined"
                                        size="small"
                                        value={item.quantidade || ''}
                                        onChange={(e) => handleUpdateItem(index, 'quantidade', e.target.value)}
                                        sx={{ flex: 1 }}
                                        inputProps={{
                                            style: { color: '#1A1A1A' }
                                        }}
    
                                    />
    
                                    {productItems.length > 1 && (
                                        <Button
                                            color="error"
                                            onClick={() => handleRemoveItem(index)}
                                            startIcon={<Icon name="X" />}
                                            sx={{ minWidth: 0, display: "flex", alignSelf: "center", height: 40, width: 40}}
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