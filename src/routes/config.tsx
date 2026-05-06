import { ReactElement } from "react";
import Index from "@/pages/Index";
import LocationPage from "@/pages/LocationPage";
import AreaPage from "@/pages/AreaPage";
import ModelDetailPage from "@/pages/ModelDetailPage";
import LoginPage from "@/pages/LoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLocations from "@/pages/admin/AdminLocations";
import AdminAreas from "@/pages/admin/AdminAreas";
import AdminModels from "@/pages/admin/AdminModels";
import AdminEnquiries from "@/pages/admin/AdminEnquiries";
import NotFound from "@/pages/NotFound";
import GlobalLayout from "@/components/GlobalLayout";

export interface RouteConfig {
  path?: string;
  element: ReactElement;
  children?: RouteConfig[];
  protected?: boolean;
  index?: boolean;
}

export const routes: RouteConfig[] = [
  {
    element: <GlobalLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "login", element: <LoginPage /> },
      { path: ":locationSlug", element: <LocationPage /> },
      { path: ":locationSlug/:areaSlug", element: <AreaPage /> },
      { path: ":locationSlug/:areaSlug/:modelSlug", element: <ModelDetailPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin",
    protected: true,
    element: <AdminDashboard />,
  },
  {
    path: "/admin/locations",
    protected: true,
    element: <AdminLocations />,
  },
  {
    path: "/admin/areas",
    protected: true,
    element: <AdminAreas />,
  },
  {
    path: "/admin/models",
    protected: true,
    element: <AdminModels />,
  },
  {
    path: "/admin/enquiries",
    protected: true,
    element: <AdminEnquiries />,
  },
];
