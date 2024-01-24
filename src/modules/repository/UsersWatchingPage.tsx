import { useAtom } from "jotai";
import { currentRepositoryAtom } from "../../store/store";
import { UserWatching } from "../../store/model/user.model";
import githubPerson from "./../../../public/githubPerson.png";
import location from "./../../../public/location.png";
import { useFindAllUsersWatchingRepository } from "../../api/query/repository/useFindAllUsersWatchingRepository";

export const UsersWatchingPage = () => {
  const [repository] = useAtom(currentRepositoryAtom);
  const { data: usersWatchingRepository} = useFindAllUsersWatchingRepository(
    repository?.id ?? ""
  );

  return (
    <div className="w-full flex flex-col items-center pt-6">
      <div className="p-6 text-white w-[1024px]">
        <div className="mb-4">
          <p className="font-sans text-left text-xl">Watchers</p>
        </div>
        <div className="rounded-sm border-[#30363d] border-[2px] py-2 flex flex-wrap">
          {usersWatchingRepository.map((member: UserWatching, key: number) => {
            return (
              <div key={key} className={"py-4 px-8 flex gap-4 w-1/3"}>
                <img
                  src={githubPerson}
                  alt="githoob person"
                  className="w-[50px] h-[50px] rounded-md"
                />
                <div className="flex flex-col justify-between">
                  {member.username}
                  {member.location && (
                    <div className="flex">
                      <img
                        src={location}
                        alt="location"
                        className="w-[30px] h-[20px] rounded-md my-auto"
                      />
                      {member.location}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
