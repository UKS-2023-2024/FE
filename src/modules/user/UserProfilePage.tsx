import { Input } from "../../components/input/Input";
import { Button } from "../../components/button/Button";
import { useEffect, useState } from "react";
import { currentUserAtom } from "../../store/store";
import { useAtom } from "jotai";
import { SocialAccount } from "../../store/model/socialAccount.model";

export const UserProfilePage = () => {

  const [currentUser] = useAtom(currentUserAtom);
  const [isDisabled, setIsDisabled] = useState(true);
  const [fullName, setFullName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(currentUser?.socialAccounts ?? [{value: ""}]);

  const enableEditing = () => {
    setIsDisabled(false);
  };

  const disableEditing = () => {
    setIsDisabled(true);
  };

  const addSocialAccount = () => {
    setSocialAccounts([...socialAccounts, {value:""}]);
    console.log(socialAccounts)
  };

  const removeSocialAccount = (index: any) => {
    const updatedAccounts = [...socialAccounts];
    updatedAccounts.splice(index, 1);
    setSocialAccounts(updatedAccounts);
  };

  useEffect(() => {
    console.log(currentUser)
  }, [])

  return (
    <div className="mt-20 w-full h-full flex justify-center items-center">
      <div className="w-1/2 flex flex-col items-center shadow-lg pt-14 rounded">
        <label className="mb-0">Name</label>
        <Input
          placeholder="Name"
          className="w-1/2"
          value={currentUser?.fullName ?? ""}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isDisabled}
        />
        <label className="mb-0">Bio</label>
        <Input
          placeholder="Bio"
          className="w-1/2"
          value={currentUser?.bio ?? ""}
          onChange={(e) => setBio(e.target.value)}
          disabled={isDisabled}
        />
        <label className="mb-0">Company</label>
        <Input
          placeholder="Company"
          className="w-1/2"
          value={currentUser?.company ?? ""}
          onChange={(e) => setCompany(e.target.value)}
          disabled={isDisabled}
        />
        <label className="mb-0">Location</label>
        <Input
          placeholder="Location"
          className="w-1/2"
          value={currentUser?.location ?? ""}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isDisabled}
        />
         <label className="mb-0">Website</label>
        <Input
          placeholder="Website"
          className="w-1/2"
          value={currentUser?.website ?? ""}
          onChange={(e) => setWebsite(e.target.value)}
          disabled={isDisabled}
        />
        <label className="mb-0">Social accounts</label>
        <div className="w-full">
          <ul>
            {socialAccounts.map((account, index) => (
              <li key={index} className="flex justify-center">
                  <Input
                    placeholder="Link to social account"
                    disabled={isDisabled}
                    value={account.value}
                    onChange={(e) => {
                      const updatedAccounts = [...socialAccounts];
                      updatedAccounts[index].value = e.target.value;
                      setSocialAccounts(updatedAccounts);
                    }}
                  />
                  { !isDisabled &&
                    <Button onClick={() => removeSocialAccount(index)}>Remove</Button>
                  }
              </li>
            ))}
          </ul>
          </div>
          { !isDisabled &&
            <Button onClick={addSocialAccount}>Add Social Account</Button>
          }

         {isDisabled ? (
            <Button onClick={enableEditing} className="w-1/2 mt-2">Update</Button>
        ) : (
          <div className='w-full'>
            <Button onClick={disableEditing} className="w-1/2 mt-2">Save</Button>
            <Button onClick={disableEditing} className="w-1/2 mt-2">Close</Button>
          </div>
        )}
      </div>
    </div>
  );
};
