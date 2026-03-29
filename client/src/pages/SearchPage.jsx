import { useEffect, useMemo, useState } from "react";
import {
    fetchCategories,
  searchInventory,
} from "../services/inventory.service.js";
import {
  Alert,
  Box,
  Button,
  FormControl,
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
  Grid,
} from "@mui/material";

function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [categories, setCategories] = useState(["All"]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const isPriceRangeValid = useMemo(() => {
    if (!minPrice || !maxPrice) return true;
    const min = Number(minPrice);
    const max = Number(maxPrice);
    return !Number.isNaN(min) && !Number.isNaN(max) && min <= max;
  }, [minPrice, maxPrice]);

  const loadCategories = async () => {
    try {
      const result = await fetchCategories();
      if (result.success) {
        setCategories(["All", ...result.data]);
      } else {
        setCategories(["All"]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async () => {
    if (!isPriceRangeValid) {
      setError(
        "Invalid price range. minPrice must be less than or equal to maxPrice.",
      );
      setResults([]);
      setHasLoaded(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await searchInventory({
        q: query,
        category,
        minPrice,
        maxPrice,
      });

      if (result.success) {
        setResults(result.data);
      } else {
        setResults([]);
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setResults([]);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  const onNavigate = () => {
    window.location.href = "/inventory";
  };


  useEffect(() => {
    loadCategories();
    fetchResults();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchResults();
  };

  const handleClear = async () => {
    setQuery("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setError("");
    setLoading(true);

    try {
      const result = await searchInventory({});
      if (result.success) {
        setResults(result.data);
      } else {
        setResults([]);
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setResults([]);
    } finally {
      setLoading(false);
      setHasLoaded(true);
    }
  };

  return (
    <Box
      component="main"
      className="min-h-screen w-full bg-slate-100 px-4 py-8 sm:px-6 lg:px-12"
      sx={{ minHeight: "100vh", width: "100%" }}
    >
      <Box className="mx-auto w-full max-w-7xl">
        <Paper className="rounded-4xl p-6 sm:p-8 shadow-xl" elevation={3}>
          <Box className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Box>
              <Typography
                variant="overline"
                className="text-indigo-600 tracking-[0.32em]"
              >
                Zeerostock
              </Typography>
              <Typography
                variant="h3"
                className="mt-3 font-semibold text-slate-900"
              >
                Inventory Search
              </Typography>
              <Typography
                variant="body1"
                className="mt-2 text-slate-600 max-w-2xl"
              >
                Search surplus inventory across multiple suppliers using product
                name, category, and price filters.
              </Typography>
            </Box>
            {onNavigate ? (
              <Button variant="contained" onClick={onNavigate}>
                Manage Suppliers
              </Button>
            ) : null}
          </Box>

          <Paper
            className="rounded-3xl border border-slate-200 bg-slate-50 p-6 mb-8"
            elevation={0}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product name"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by product name"
                  />
                </Grid>

                <Grid item xs={12} md={6} sx={{width : "100px"}}>
                  <FormControl fullWidth>
                    <InputLabel id="category-label">City</InputLabel>
                    <Select
                      labelId="category-label"
                      label="City"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                    >
                      {categories.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                
                

                <Grid item xs={12} className="flex flex-wrap gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={handleClear}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button type="submit" variant="contained" disabled={loading}>
                    Search
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {error ? (
            <Alert severity="warning" className="mb-6">
              {error}
            </Alert>
          ) : null}

          <Paper
            className="rounded-3xl border border-slate-200 bg-white p-6"
            elevation={0}
          >
            {loading ? (
              <Typography className="text-slate-500">
                Loading inventory…
              </Typography>
            ) : results.length === 0 && hasLoaded ? (
              <Alert severity="info">No results found.</Alert>
            ) : (
              <TableContainer className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.map((item) => (
                      <TableRow key={item.id} hover>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Paper>
      </Box>
    </Box>
  );
}

export default SearchPage;
