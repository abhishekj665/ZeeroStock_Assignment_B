import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import InventoryPage from "./pages/InventoryPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/search" replace />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="inventory" element={<InventoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
