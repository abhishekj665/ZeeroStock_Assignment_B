import { Link, Outlet, useLocation } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";

function MainLayout() {
  const location = useLocation();
  const activePath =
    location.pathname === "/inventory" ? "/inventory" : "/search";

  return (
    <Container
      maxWidth={false}
      className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-12"
    >
      <Box className="mx-auto w-full max-w-7xl">
        <Box className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Box>
            <Typography
              variant="overline"
              className="text-indigo-600 tracking-[0.32em]"
            >
              Zeerostock App
            </Typography>
            <Typography
              variant="h4"
              className="mt-3 font-semibold text-slate-900"
            >
              Inventory Search & Management
            </Typography>
          </Box>

          <Box className="flex flex-wrap gap-3">
            <Button
              component={Link}
              to="/search"
              variant={activePath === "/search" ? "contained" : "outlined"}
            >
              Search Inventory
            </Button>
            <Button
              component={Link}
              to="/inventory"
              variant={activePath === "/inventory" ? "contained" : "outlined"}
            >
              Manage Suppliers
            </Button>
          </Box>
        </Box>
      </Box>

      <Box className="mx-auto w-full max-w-7xl">
        <Outlet />
      </Box>
    </Container>
  );
}

export default MainLayout;
