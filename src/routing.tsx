import { RouteObject } from "react-router-dom";
import App from "./App";
import { RegisterPage } from "./modules/auth/RegisterPage";
import { UserProfilePage } from "./modules/user/UserProfilePage";
import { HomePage } from "./modules/HomePage";
import { CreateOrganizationPage } from "./modules/organization/CreateOrganizationPage";
import { OrganizationPage } from "./modules/organization/OrganizationPage";
import { OrganizationSettingsPage } from "./modules/organization/OrganizationSettingsPage";
import { OrganizationRepositoriesPage } from "./modules/repository/OrganizationRepositoriesPage";
import { RepositoryPage } from "./modules/repository/RepositoryPage";
import { RepositorySettingsPage } from "./modules/repository/RepositorySettingsPage";
import { CreateRepositoryPage } from "./modules/repository/CreateRepositoryPage";
import { UserRepositoriesPage } from "./modules/repository/UserRepositoriesPage";
import { RepositoryCodePage } from "./modules/repository/RepositoryCodePage";
import { RepositoryBranchesPage } from "./modules/repository/branches/RepositoryBranchesPage";
import { RepositoryYoursBranchesPage } from "./modules/repository/branches/RepositoryYoursBranchesPage";
import { RepositoryAllBranchesPage } from "./modules/repository/branches/RepositoryAllBranchesPage";
import { RepositoryOverviewBranchesPage } from "./modules/repository/branches/RepositoryOverviewBranchesPage";
import { RepositoryMembersPage } from "./modules/repository/RepositoryMembersPage";
import { RepositoryInviteAcceptPage } from "./modules/repository/RepositoryInviteAcceptPage";

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
            element: <OrganizationRepositoriesPage />,
          },
        ],
      },
      {
        path: "/repository/:name",
        element: <RepositoryPage />,
        children: [
          {
            path: "settings",
            element: <RepositorySettingsPage />,
          },
          {
            path: "",
            element: <RepositoryCodePage />,
          },
          {
            path: "members",
            element: <RepositoryMembersPage />,
          },
          {
            path: "branches",
            element: <RepositoryBranchesPage />,
            children: [
              {
                path: "",
                element: <RepositoryOverviewBranchesPage />,
              },
              {
                path: "yours",
                element: <RepositoryYoursBranchesPage />,
              },
              {
                path: "all",
                element: <RepositoryAllBranchesPage />,
              },
            ],
          },
        ],
      },
      {
        path: "/new-repository",
        element: <CreateRepositoryPage />,
      },
      {
        path: "/repositories",
        element: <UserRepositoriesPage />,
      },
      {
        path: "/repository/invites/:token",
        element: <RepositoryInviteAcceptPage />,
      },
    ],
  },
];
