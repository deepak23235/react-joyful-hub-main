import { Route, Routes } from "react-router-dom";
import { RouteConfig, routes } from "./config";
import ProtectedRoute from "@/components/ProtectedRoute";

const renderRoutes = (routeList: RouteConfig[]) => {
  return routeList.map((route, idx) => {
    const { element, path, children, protected: isProtected, index: isIndex } = route;
    const wrappedElement = isProtected ? (
      <ProtectedRoute>{element}</ProtectedRoute>
    ) : (
      element
    );

    if (isIndex) {
      return (
        <Route
          key={`route-index-${idx}`}
          index
          element={wrappedElement}
        />
      );
    }

    return (
      <Route
        key={path || `route-${idx}`}
        path={path}
        element={wrappedElement}
      >
        {children && renderRoutes(children)}
      </Route>
    );
  });
};

export const RouteGenerator = () => {
  return <Routes>{renderRoutes(routes)}</Routes>;
};
