import { RouteObject } from "react-router-dom";
import App from "./App";
import { RegisterPage } from "./modules/auth/RegisterPage";
import { UserProfilePage } from "./modules/settings/SettingsProfilePage";
import { HomePage } from "./modules/HomePage";
import { CreateOrganizationPage } from "./modules/organization/CreateOrganizationPage";
import { OrganizationPage } from "./modules/organization/OrganizationPage";
import { OrganizationSettingsPage } from "./modules/organization/OrganizationSettingsPage";
import { OrganizationRepositoriesPage } from "./modules/repository/OrganizationRepositoriesPage";
import { RepositoryPage } from "./modules/repository/RepositoryPage";
import { RepositorySettingsPage } from "./modules/repository/RepositorySettingsPage";
import { CreateRepositoryPage } from "./modules/repository/CreateRepositoryPage";
import { UserRepositoriesPage } from "./modules/repository/UserRepositoriesPage";
import { RepositoryIssuePage } from "./modules/repository/RepositoryIssuePage";
import { RepositoryMilestonePage } from "./modules/milestone/RepositoryMilestonePage";
import { CreateMilestonePage } from "./modules/milestone/CreateMilestonePage";
import { EditMilestonePage } from "./modules/milestone/EditMilestonePage";
import { RepositoryCodePage } from "./modules/repository/RepositoryCodePage";
import { RepositoryBranchesPage } from "./modules/repository/branches/RepositoryBranchesPage";
import { RepositoryYoursBranchesPage } from "./modules/repository/branches/RepositoryYoursBranchesPage";
import { RepositoryAllBranchesPage } from "./modules/repository/branches/RepositoryAllBranchesPage";
import { RepositoryOverviewBranchesPage } from "./modules/repository/branches/RepositoryOverviewBranchesPage";
import { RepositoryMembersPage } from "./modules/repository/RepositoryMembersPage";
import { RepositoryInviteAcceptPage } from "./modules/repository/RepositoryInviteAcceptPage";
import { UsersThatStarredPage } from "./modules/repository/UsersThatStarredPage";
import { CreateIssuePage } from "./modules/issues/CreateIssuePage";
import { IssueOverviewPage } from "./modules/issues/IssueOverviewPage";
import { OrganizationMembersPage } from "./modules/organization/OrganizationMembersPage";
import { OrganizationInviteAcceptPage } from "./modules/organization/OrganizationInviteAcceptPage";
import { AllOrganizationsPage } from "./modules/organization/AllOrganizationsPage";
import { UsersWatchingPage } from "./modules/repository/UsersWatchingPage";
import { SettingsNotifications } from "./modules/settings/SettingsNotifications";
import { NotificationsPage } from "./modules/notifications/NotificationsPage";
import { SettingsAccessPage } from "./modules/settings/SettingsAccessPage";
import { SettingsPage } from "./modules/settings/SettingsPage";
import { RepositoryPullRequestPage } from "./modules/repository/RepositoryPullRequestPage";
import { CreatePullRequestPage } from "./modules/pull-requests/CreatePullRequestPage";
import { PullRequestOverviewPage } from "./modules/pull-requests/PullRequestOverviewPage";
import { LabelOverviewPage } from "./modules/labels/LabelOverviewPage";

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
        path: "/new-organization",
        element: <CreateOrganizationPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
        children: [
          {
            path: `profile`,
            element: <UserProfilePage />,
          },
          {
            path: `access`,
            element: <SettingsAccessPage />,
          },
          {
            path: `notifications`,
            element: <SettingsNotifications />,
          },
        ],
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
          {
            path: "members",
            element: <OrganizationMembersPage />,
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
            path: "issues",
            element: <RepositoryIssuePage />,
          },
          {
            path: "issues/new",
            element: <CreateIssuePage />,
          },
          {
            path: "issues/:id",
            element: <IssueOverviewPage />,
          },
          {
            path: "issues/labels",
            element: <LabelOverviewPage />,
          },
          {
            path: "pull-requests",
            element: <RepositoryPullRequestPage />,
          },
          {
            path: "pull-requests/new",
            element: <CreatePullRequestPage />,
          },
          {
            path: "pull-requests/:id",
            element: <PullRequestOverviewPage />,
          },
          {
            path: "milestones",
            element: <RepositoryMilestonePage />,
          },
          {
            path: "milestones/new",
            element: <CreateMilestonePage />,
          },
          {
            path: "milestones/edit",
            element: <EditMilestonePage />,
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
            path: "stargazers",
            element: <UsersThatStarredPage />,
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
          {
            path: "watchers",
            element: <UsersWatchingPage />,
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
      {
        path: "/organization/invites/:token",
        element: <OrganizationInviteAcceptPage />,
      },
      {
        path: "/organizations",
        element: <AllOrganizationsPage />,
      },

      {
        path: `/notifications`,
        element: <NotificationsPage />,
      },
    ],
  },
];
