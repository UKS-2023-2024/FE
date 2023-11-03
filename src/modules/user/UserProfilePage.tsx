import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { useEffect, useState } from "react";
import { currentUserAtom } from "../../store/store";
import { useAtom } from "jotai";
import { useUpdateUser } from "../../api/mutations/useUpdateUser";

export const UserProfilePage = () => {
  const [currentUser] = useAtom(currentUserAtom);
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

  const handleUpdate = async () => {
    await updateUser(updateUserParam);
    setIsDisabled(true);
  };


  return (
    <div className="mt-20 w-full h-full flex justify-center items-center">
      <div className="w-1/2 flex flex-col items-center shadow-lg pt-14 rounded">
        <label className="mb-0">Name</label>
        <Input
          placeholder="Name"
          className="w-1/2"
          value={updateUserParam.fullName}
          onChange={(e) =>
            setUpdateUserParam({
              ...updateUserParam,
              fullName: e.target.value,
            })
          }
          disabled={isDisabled}
        />
        <label className="mb-0">Bio</label>
        <textarea
          placeholder="Bio"
          className="w-1/2 mb-5"
          value={updateUserParam.bio}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, bio: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-0">Company</label>
        <Input
          placeholder="Company"
          className="w-1/2"
          value={updateUserParam.company}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, company: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-0">Location</label>
        <Input
          placeholder="Location"
          className="w-1/2"
          value={updateUserParam.location}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, location: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-0">Website</label>
        <Input
          placeholder="Website"
          className="w-1/2"
          value={updateUserParam.website}
          onChange={(e) =>
            setUpdateUserParam({ ...updateUserParam, website: e.target.value })
          }
          disabled={isDisabled}
        />
        <label className="mb-0">Social accounts</label>
        <div className="w-full">
          <ul>
            {updateUserParam.socialAccounts.map((account, index) => (
              <li key={index} className="flex justify-center">
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
                  <Button onClick={() => removeSocialAccount(index)}>
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
        {!isDisabled && (
          <Button onClick={addSocialAccount}>Add Social Account</Button>
        )}
        {isDisabled ? (
          <Button onClick={enableEditing} className="w-1/2 mt-2">
            Update
          </Button>
        ) : (
          <div className="w-full">
            <Button onClick={handleUpdate} className="w-1/2 mt-2">
              Save
            </Button>
            <Button onClick={disableEditing} className="w-1/2 mt-2">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};