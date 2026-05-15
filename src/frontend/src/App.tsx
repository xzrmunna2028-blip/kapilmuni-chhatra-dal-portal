import AchievementsPage from "@/pages/Achievements";
import AdminPage from "@/pages/Admin";
import AdminLoginPage from "@/pages/AdminLogin";
import AlumniPage from "@/pages/Alumni";
import ChatPage from "@/pages/Chat";
import CommitteePage from "@/pages/Committee";
import DashboardPage from "@/pages/Dashboard";
import GalleryPage from "@/pages/Gallery";
import LandingPage from "@/pages/Landing";
import LibraryPage from "@/pages/Library";
import LoginPage from "@/pages/Login";
import NoticesPage from "@/pages/Notices";
import RegisterPage from "@/pages/Register";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const committeeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/committee",
  component: CommitteePage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
});

const noticesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notices",
  component: NoticesPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: GalleryPage,
});

const alumniRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alumni",
  component: AlumniPage,
});

const achievementsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/achievements",
  component: AchievementsPage,
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/library",
  component: LibraryPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: AdminLoginPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  committeeRoute,
  chatRoute,
  noticesRoute,
  galleryRoute,
  alumniRoute,
  achievementsRoute,
  libraryRoute,
  adminRoute,
  adminLoginRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
