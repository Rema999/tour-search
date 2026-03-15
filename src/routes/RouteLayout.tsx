import { FC } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TourSearchPage } from "@/pages/tour-search";

const RouteLayout: FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/tour-search" replace />} />
      <Route path="/tour-search" element={<TourSearchPage />} />
      <Route path="*" element={<Navigate to="/tour-search" replace />} />
    </Routes>
  </BrowserRouter>
);

export default RouteLayout;
