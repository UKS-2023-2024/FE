import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Tab } from "../../components/tab/Tab";
import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";

export const RepositoryPage = () => {
  const [repository, setSelectedRepository] = useAtom(currentRepositoryAtom);
  const { name } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-[#11151C]">
      <div className="text-white ml-5">
        {repository?.organization ? repository.organization.name  : repository?.members.find(member => member.role === 0)?.member.username}/{name}
      </div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <Tab>Code</Tab>
          <Tab>Issues</Tab>
          <Tab>Pull requests</Tab>
          <Tab>Actions</Tab>
          <Tab>Projects</Tab>
          <Tab>Wiki</Tab>
          <Tab>Security</Tab>
          <Tab>Insight</Tab>
          <Tab onClick={() => navigate(`/repository/${name}/settings`)}>Settings</Tab>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};