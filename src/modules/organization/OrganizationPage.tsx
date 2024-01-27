import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Tab } from "../../components/tab/Tab";

export const OrganizationPage = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-[#11151C]">
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <Tab>Overview</Tab>
          <Tab onClick={() => navigate(`/organizations/${name}/repositories`)}>Repositories</Tab>
          <Tab>Projects</Tab>
          <Tab>Packages</Tab>
          <Tab>Teams</Tab>
          <Tab>People</Tab>
          <Tab onClick={() => navigate(`/organizations/${name}/settings`)}>Settings</Tab>
          <Tab onClick={() => navigate(`/organizations/${name}/members`)}>Members</Tab>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};
