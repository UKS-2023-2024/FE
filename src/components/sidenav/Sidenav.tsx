import { useNavigate } from "react-router-dom";
import { Button } from "../button/Button";
import { currentRepositoryAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useGetRepositoriesUserBelongsTo } from "../../api/query/repository/useRepositoriesUserBelongsTo";
import { Repository } from "../../store/model/repository.model";
import { useEffect } from "react";

export const Sidenav = () => {
  const navigate = useNavigate();
  const { data: userRepositories } = useGetRepositoriesUserBelongsTo();
  const [, setSelectedRepository] = useAtom(currentRepositoryAtom);

  const handleRepositoryClick = (repo: Repository) => {
    navigate(`/repository/${repo.name}`);
    setSelectedRepository(repo);
  };

  useEffect(() => {
    console.log(userRepositories)
})

  return (
    <div className="w-[300px] h-full flex flex-col p-6 bg-[#11151C] border-r-[1px] border-gray-600">
      <Button className="mb-5" onClick={() => navigate("/repositories")}>
        Your Repositories
      </Button>
      <Button className="mb-5" onClick={() => navigate("/organizations")}>
        Your Organizations
      </Button>
      <div className="border-b border-gray-600 mt-6 mb-6"></div>
      <div className="text-white mb-5"><i>Top Repositories:</i></div>
      <div>
        {userRepositories.map((repo: Repository) => (
          <div
            key={repo.id}
            className="h-[30px] text-white text-m hover:underline hover:cursor-pointer"
            onClick={() => handleRepositoryClick(repo)}
          >
           {repo.organization !== null ? (
  
              <>
                {repo.organization?.name} / {repo.name}
              </>
              ) : (
              <>
                {repo.members.find(member => member.role === 0)?.member.username} / {repo.name}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
