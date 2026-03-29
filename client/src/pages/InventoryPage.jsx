import { useEffect, useState } from "react";
import {
  createSupplier,
  createInventory,
  fetchSuppliers,
  getGroupedInventory,
} from "../services/inventory.service.js";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

function InventoryPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [groupedInventory, setGroupedInventory] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [supplierCity, setSupplierCity] = useState("");
  const [productName, setProductName] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadSuppliers = async () => {
    try {
      const result = await fetchSuppliers();
      if (result.success) {
        setSuppliers(result.data);
        if (!supplierId && result.data.length > 0) {
          setSupplierId(result.data[0].id);
        }
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load suppliers",
      );
    }
  };

  const loadGroupedInventory = async () => {
    try {
      const result = await getGroupedInventory();
      if (result.success) {
        setGroupedInventory(result.data);
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Unable to load inventory",
      );
    }
  };

  useEffect(() => {
    loadSuppliers();
    loadGroupedInventory();
  }, []);

  const resetMessages = () => {
    setError("");
    setMessage("");
  };

  const handleCreateSupplier = async (event) => {
    event.preventDefault();
    resetMessages();

    try {
      setLoading(true);
      const result = await createSupplier({
        name: supplierName,
        city: supplierCity,
      });
      if (result.success) {
        setMessage("Supplier created successfully.");
        setSupplierName("");
        setSupplierCity("");
        await loadSuppliers();
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create supplier.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInventory = async (event) => {
    event.preventDefault();
    resetMessages();

    try {
      if (!supplierId) {
        throw new Error("Please select a supplier for the inventory item.");
      }
      setLoading(true);
      const result = await createInventory({
        supplierId,
        product_name: productName,
        quantity,
        price,
      });
      if (result.success) {
        setMessage("Inventory item created successfully.");
        setProductName("");
        setQuantity("");
        setPrice("");
        await loadGroupedInventory();
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "Failed to create inventory item.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth={false}
      className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-12"
    >
      <Box className="mx-auto w-full max-w-7xl">
        <Box className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Box>
            <Typography
              variant="overline"
              className="text-indigo-600 tracking-[0.32em]"
            >
              Zeerostock Database Assignment
            </Typography>
            <Typography
              variant="h3"
              className="mt-3 font-semibold text-slate-900"
            >
              Suppliers & Inventory
            </Typography>
            <Typography
              variant="body1"
              className="mt-2 text-slate-600 max-w-2xl"
            >
              Create suppliers and inventory items, then view all inventory
              grouped by supplier sorted by total value.
            </Typography>
          </Box>
        </Box>

        <Box className="mt-8 space-y-8">
          {(error || message) && (
            <Alert severity={error ? "error" : "success"} className="mb-4">
              {error || message}
            </Alert>
          )}

          <Grid container spacing={6}>
            <Grid item xs={12} lg={6}>
              <Paper className="rounded-3xl p-6 shadow-sm" elevation={1}>
                <Typography variant="h6" className="mb-4">
                  Add Supplier
                </Typography>
                <form onSubmit={handleCreateSupplier}>
                  <Box className="space-y-4">
                    <TextField
                      fullWidth
                      label="Supplier Name"
                      value={supplierName}
                      onChange={(event) => setSupplierName(event.target.value)}
                      sx={{ marginBottom: "16px", marginTop: "8px" }}
                    />
                    <TextField
                      fullWidth
                      label="City"
                      value={supplierCity}
                      onChange={(event) => setSupplierCity(event.target.value)}
                      sx={{ marginBottom: "16px" }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      Create Supplier
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Paper className="rounded-3xl p-6 shadow-sm" elevation={1}>
                <Typography variant="h6" className="mb-4">
                  Add Inventory Item
                </Typography>
                <form onSubmit={handleCreateInventory}>
                  <Box className="space-y-4" sx={{ marginTop: "8px" }}>
                    <FormControl fullWidth>
                      <InputLabel id="supplier-select-label">
                        Supplier
                      </InputLabel>
                      <Select
                        labelId="supplier-select-label"
                        label="Supplier"
                        value={supplierId}
                        onChange={(event) => setSupplierId(event.target.value)}
                        sx={{ marginBottom: "16px" }}
                      >
                        {suppliers.map((supplier) => (
                          <MenuItem key={supplier.id} value={supplier.id}>
                            {supplier.name} — {supplier.city}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Product Name"
                      value={productName}
                      onChange={(event) => setProductName(event.target.value)}
                      sx={{ marginBottom: "16px" }}
                    />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          type="number"
                          inputProps={{ min: 0 }}
                          value={quantity}
                          onChange={(event) => setQuantity(event.target.value)}
                          sx={{ marginBottom: "16px" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Price"
                          type="number"
                          inputProps={{ min: 0.01, step: 0.01 }}
                          value={price}
                          onChange={(event) => setPrice(event.target.value)}
                          sx={{ marginBottom: "16px" }}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || suppliers.length === 0}
                    >
                      Create Inventory
                    </Button>
                  </Box>
                </form>
              </Paper>
            </Grid>
          </Grid>

          <Paper className="rounded-3xl p-6 shadow-sm" elevation={1}>
            <Box className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Typography variant="h6">
                  Inventory grouped by supplier
                </Typography>
                <Typography variant="body2" className="text-slate-500">
                  Suppliers are sorted by total inventory value.
                </Typography>
              </div>
              <Button
                onClick={loadGroupedInventory}
                variant="outlined"
                disabled={loading}
              >
                Refresh
              </Button>
            </Box>
            <Divider className="my-6" />
            {groupedInventory.length === 0 ? (
              <Typography className="text-slate-500">
                No inventory data available.
              </Typography>
            ) : (
              <Box className="space-y-6">
                {groupedInventory.map((group) => (
                  <Paper
                    key={group.supplier.id}
                    className="rounded-3xl border border-slate-200 p-5 bg-slate-50"
                  >
                    <Box className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                      <Box>
                        <Typography
                          variant="subtitle1"
                          className="font-semibold"
                        >
                          {group.supplier.name}
                        </Typography>
                        <Typography variant="body2" className="text-slate-600">
                          {group.supplier.city}
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle2"
                        className="text-slate-700"
                      >
                        Total inventory value: ${group.totalValue.toFixed(2)}
                      </Typography>
                    </Box>
                    <TableContainer className="mt-4 overflow-x-auto">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.inventory.map((item) => (
                            <TableRow key={item.id} hover>
                              <TableCell>{item.product_name}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>
                                ${Number(item.price).toFixed(2)}
                              </TableCell>
                              <TableCell>
                                $
                                {(item.quantity * Number(item.price)).toFixed(
                                  2,
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default InventoryPage;
