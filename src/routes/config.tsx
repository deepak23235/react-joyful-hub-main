import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
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
import AboutPage from "@/pages/AboutPage";
import GlobalLayout from "@/components/GlobalLayout";
import { EscortsCanonical, LegacyRedirect } from "@/components/SeoRedirects";

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
      { path: "about-us", element: <AboutPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "escorts", element: <Navigate to="/" replace /> },
      {
        path: "escorts/:locationSlug",
        element: <EscortsCanonical />,
        children: [{ index: true, element: <LocationPage /> }],
      },
      {
        path: "escorts/:locationSlug/:areaSlug",
        element: <EscortsCanonical />,
        children: [{ index: true, element: <AreaPage /> }],
      },
      {
        path: "escorts/:locationSlug/:areaSlug/:modelSlug",
        element: <EscortsCanonical />,
        children: [{ index: true, element: <ModelDetailPage /> }],
      },
      // Old URLs without the /escorts prefix
      { path: ":locationSlug", element: <LegacyRedirect /> },
      { path: ":locationSlug/:areaSlug", element: <LegacyRedirect /> },
      { path: ":locationSlug/:areaSlug/:modelSlug", element: <LegacyRedirect /> },
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
