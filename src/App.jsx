import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import RestrictedRoute from "./components/RestrictedRoute/RestrictedRoute";
import { useDispatch, useSelector } from "react-redux";
import { selectIsRefreshing } from "./redux/auth/selectors";
import { selectIsLoggedIn } from "./redux/auth/selectors";
import { refreshUserThunk } from "./redux/auth/operations";
import Preloader from "./components/Preloader/Preloader";
import useMedia from "./hooks/UseMadia";

const HomeTab = lazy(() => import("./components/Home/Home"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage/DashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const RegistrationPage = lazy(() =>
  import("./pages/RegistrationPage/RegistrationPage")
);
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage/ChangePasswordPage"));
const CurrencyTab = lazy(() => import("./components/Currency/Currency"));
const StatisticsTab = lazy(() =>
  import("./components/StatisticsDashboard/StatisticsDashboard")
);

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isRefreshing = useSelector(selectIsRefreshing);
  useEffect(() => {
    dispatch(refreshUserThunk());
  }, [dispatch]);

  const [isFirstLoad, setIsFirstLoad] = useState(false);
  useEffect(() => {
    const isFirstVisit = localStorage.getItem("isFirstVisit");
    if (!isFirstVisit) {
      setIsFirstLoad(true);
      localStorage.setItem("isFirstVisit", "true");
    }
    dispatch(refreshUserThunk());
  }, [dispatch]);

  const { isMobile, isTablet, isDesctop } = useMedia();

  useEffect(() => {
    if (!isMobile && location.pathname === "/dashboard/currency") {
      navigate("/dashboard/home", { replace: true });
    }
  }, [isMobile, location.pathname, navigate]);

  return isFirstLoad || isRefreshing ? (
    <Preloader />
  ) : (
    <Suspense fallback={<p>Loading page...</p>}>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegistrationPage />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ChangePasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RestrictedRoute>
              <DashboardPage />
            </RestrictedRoute>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeTab />} />
          <Route path="statistic" element={<StatisticsTab />} />
          {isMobile && <Route path="currency" element={<CurrencyTab />} />}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;