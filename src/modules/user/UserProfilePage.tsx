import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { useEffect, useState } from "react";
import { currentUserAtom, tokenAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useUpdateUser } from "../../api/mutations/useUpdateUser";
import { useDeleteUser } from "../../api/mutations/useDeleteUser";
import { useNavigate } from "react-router-dom";

export const UserProfilePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [, setToken] = useAtom(tokenAtom);
  const [isDisabled, setIsDisabled] = useState(true);
  const [updateUserParam, setUpdateUserParam] = useState({
    fullName: currentUser?.fullName || "",
    bio: currentUser?.bio || "",
    company: currentUser?.company || "",
    location: currentUser?.location || "",
    website: currentUser?.website || "",
    socialAccounts: JSON.parse(JSON.stringify(currentUser?.socialAccounts ?? [{ value: "" }])),
  });

  useEffect(() => {
    fetchCurrentUser()
  }, [currentUser])

  const fetchCurrentUser = () => {
    setUpdateUserParam({
      fullName: currentUser?.fullName || "",
      bio: currentUser?.bio || "",
      company: currentUser?.company || "",
      location: currentUser?.location || "",
      website: currentUser?.website || "",
      socialAccounts: JSON.parse(JSON.stringify(currentUser?.socialAccounts ?? [{ value: "" }])),
    })
  }
  const enableEditing = () => {
    setIsDisabled(false);
  };

  const disableEditing = () => {
    fetchCurrentUser()
    setIsDisabled(true);
  };

  const addSocialAccount = () => {
    setUpdateUserParam({
      ...updateUserParam,
      socialAccounts: [...updateUserParam.socialAccounts, { value: "" }],
    });
  };

  const removeSocialAccount = (index: number) => {
    const updatedSocialAccounts = [...updateUserParam.socialAccounts];
    updatedSocialAccounts.splice(index, 1);
    setUpdateUserParam({
      ...updateUserParam,
      socialAccounts: updatedSocialAccounts,
    });
  };

  const { mutateAsync: updateUser } = useUpdateUser();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const handleUpdate = async () => {
    await updateUser(updateUserParam);
    setIsDisabled(true);
  };

  const handleDelete = async () => {
    await deleteUser();
    logout()
    
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    navigate("/")
  };

  return  (
    <div className="min-h-screen bg-[#11151C]">
    <div className="w-full flex justify-center items-center">
      <div className="w-1/2 flex flex-col items-center shadow-lg p-6 rounded">
        <label className="mb-2 text-white">Name</label>
        <Input
          placeholder="Name"
          className="w-1/2 bg-white"
          value={updateUserParam.fullName}
          onChange={(e) =>
            setUpdateUserParam({
              ...updateUserParam,
              fullName: e.target.value,
            })
          }
          disabled={isDisabled}
        />
        <label className="mb-2 text-white">Bio</label>
        <textarea
          placeholder="Bio"
          className="w-1/2 mb-2"
          value={updateUserParam.bio}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, bio: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-2 text-white">Company</label>
        <Input
          placeholder="Company"
          className="w-1/2 bg-white"
          value={updateUserParam.company}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, company: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-2 text-white">Location</label>
        <Input
          placeholder="Location"
          className="w-1/2 bg-white"
          value={updateUserParam.location}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, location: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-2 text-white">Website</label>
        <Input
          placeholder="Website"
          className="w-1/2 bg-white"
          value={updateUserParam.website}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, website: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-2 text-white">Social accounts</label>
        <div className="w-full flex justify-center">
          <ul>
            {updateUserParam.socialAccounts.map((account, index) => (
              <li key={index} className="flex items-center mb-2">
                <Input
                  placeholder="Link to social account"
                  disabled={isDisabled}
                  value={account.value}
                  onChange={(e) => {
                    const updatedSocialAccounts = [...updateUserParam.socialAccounts];
                    updatedSocialAccounts[index].value = e.target.value;
                    setUpdateUserParam({
                      ...updateUserParam,
                      socialAccounts: updatedSocialAccounts,
                    });
                  }}
                />
                {!isDisabled && (
                  <Button onClick={() => removeSocialAccount(index)} className="ml-2 px-2">
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
        {!isDisabled && (
          <Button onClick={addSocialAccount} className="mt-2 px-2">Add Social Account</Button>
        )}
        <div className="w-full mt-2">
          {isDisabled ? (
            <div className="flex justify-center items-center">
              <Button onClick={enableEditing} className="w-1/2">
                Update
              </Button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Button onClick={handleUpdate} className="w-1/2">
                Save
              </Button>
              <Button onClick={disableEditing} className="w-1/2">
                Close
              </Button>
            </div>
          )}
        </div>
        <button onClick={handleDelete} className="bg-red-500 text-white mt-2 w-1/2 h-10">
          Delete profile
        </button>
      </div>
    </div>
    </div>
  );
};
