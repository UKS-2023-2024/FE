import { currentOrganizationAtom, currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useGetRepositoriesForOrganization } from "../../api/query/repository/useRepositoriesForOrganization";
import { Repository } from "../../store/model/repository.model";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

export const OrganizationRepositoriesPage = () => {
  const [organization] = useAtom(currentOrganizationAtom);
  const [, setSelectedRepository] = useAtom(currentRepositoryAtom);
  const { data: organizationRepositories} = useGetRepositoriesForOrganization(organization?.id ?? "");
  const navigate = useNavigate();

  const handleRepositoryClick = (repo: Repository) => {
    navigate(`/repository/${repo.name}`);
    setSelectedRepository(repo);
  };

  return (
    <div className="w-full flex flex-col items-center pt-6">
    <Button onClick={() => navigate('/new-repository')}>New repository</Button>
    {organizationRepositories.map((repo: Repository) => (
      <div key={repo.id} className="flex gap-8 border border-white rounded p-10 w-1/2">
        <div className="flex flex-col">
          <div className="h-[30px] text-white text-lg hover:underline hover:cursor-pointer" onClick={() => handleRepositoryClick(repo)}>
            {repo.name}
          </div>
          <div className="flex items-center gap-2">
            <div className="h-[30px] text-white text-xs">
              {repo.description}
            </div>
          </div>
        </div>
        <div className="w-[72px] h-[20px] rounded-full text-xs text-center border border-white text-white ">
        {repo.isPrivate ? 'Private' : 'Public'}
        </div>
      </div>
    ))}
  </div>
  );
};
