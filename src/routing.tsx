import { RouteObject } from "react-router-dom";
import App from "./App";
import { RegisterPage } from "./modules/auth/RegisterPage";
import { UserProfilePage } from "./modules/user/UserProfilePage";
import { HomePage } from "./modules/HomePage";
import { CreateOrganizationPage } from "./modules/organization/CreateOrganizationPage";
import { OrganizationPage } from "./modules/organization/OrganizationPage";
import { OrganizationSettingsPage } from "./modules/organization/OrganizationSettingsPage";
import { OrganizationRepositoriesPage } from "./modules/organization/OrganizationRepositoriesPage";
import { RepositoryPage } from "./modules/repository/RepositoryPage";
import { RepositorySettingsPage } from "./modules/repository/RepositorySettingsPage";
import { CreateRepositoryPage } from "./modules/repository/CreateRepositoryPage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: `/register`,
        element: <RegisterPage />,
      },
      {
        path: `/profile`,
        element: <UserProfilePage />,
      },
      {
        path: "/new-organization",
        element: <CreateOrganizationPage />,
      },
      {
        path: `/organizations/:name`,
        element: <OrganizationPage />,
        children: [
          {
            path: "settings",
            element: <OrganizationSettingsPage />,
          },
          {
            path: "repositories",
            element: <OrganizationRepositoriesPage/>,
          }
        ],
      },
      {
        path: "/repository/:name",
        element: <RepositoryPage/>,
        children: [
          {
            path: "settings",
            element: <RepositorySettingsPage/>,
          }
        ]
      },
      {
        path: "/new-repository",
        element: <CreateRepositoryPage/>,
      }
    ],
  },
];
