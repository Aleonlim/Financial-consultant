import { createBrowserRouter} from "react-router-dom"
import { ProtectedRoute } from "@/app/providers/ProtectedRoute"
import {RootRedirect} from "@/app/providers/RootRedirect"

import LoginPage from "@/pages/login"
import AccountsPage from "@/pages/accounts"
import {AccountDetailsPage} from "@/pages/accountDetails"
import OperationsPage from "@/pages/operations"
import FundsPage from "@/pages/funds"
import FundDetailsPage from "@/pages/fundDetails"
import AnalyticsPage from "@/pages/analytics"
import SettingsPage from "@/pages/settings"
import NotFoundPage from "@/pages/notFound"
import Layout from "@/widgets/Layout"



export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/accounts",
        element: <AccountsPage />,
      },
      {
        path: "/accounts/:accountId",
        element: <AccountDetailsPage />,
      },
      {
        path: "/operations",
        element: <OperationsPage />,
      },
      {
        path: "/funds",
        element: <FundsPage />,
      },
      {
        path: "/funds/:fundId",
        element: <FundDetailsPage />,
      },
      {
        path: "/analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ]
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
])