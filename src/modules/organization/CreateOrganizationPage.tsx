import { useForm } from "react-hook-form";
import { Input } from "../../components/input/Input";
import { CREATE_ORGANIZATION_VALIDATION_SCHEMA } from "../../utils/auth.constants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "../../components/button/Button";
import { useCreateOrganization } from "../../api/mutations/useCreateOrganization";
import { SearchableDropdown } from "../../components/dropdown/SearchableDropdown";
import { useSearchUsers } from "../../api/query/useSearchUsers";
import { useState } from "react";
import { User } from "../../store/model/user.model";

export type CreateOrganizationFormValues = {
  name: string;
  contactEmail: string;
};

export const CreateOrganizationPage = () => {
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm<CreateOrganizationFormValues>({
    resolver: yupResolver(CREATE_ORGANIZATION_VALIDATION_SCHEMA),
  });

  const [searchValue, setSearchValue] = useState<string>("");
  const { mutateAsync: createOrganization } = useCreateOrganization();
  const { data: searchedUsers } = useSearchUsers(searchValue);
  const [pendingMembers, setPendingMembers] = useState<any[]>([]);

  const handleChangeOptions = (value: string) => {
    setSearchValue(value);
  };

  const handleSelect = (values: any[]) => {
    setPendingMembers(values);
  };

  const handleOnSubmit = async (values: CreateOrganizationFormValues) => {
    console.log(pendingMembers);
    await createOrganization({
      name: values.name,
      contactEmail: values.contactEmail,
      pendingMembers: pendingMembers.map(
        (pendingMember) => pendingMember.value.id
      ),
    });
    reset();
  };

  const mapOptions = () => {
    if (!searchedUsers) return [];
    return searchedUsers.map((user: User) => ({
      label: user.username,
      value: user,
    }));
  };

  return (
    <div className="w-full h-full flex justify-center pt-20 bg-[#11151C]">
      <div className="w-1/2 flex flex-col items-cemter">
        <div className="p-6 text-white">
          <p className="text-center font-sans">
            Tell us about your organization
          </p>
          <p className="text-center text-3xl font-sans">
            Set up your organization
          </p>
        </div>

        <Input
          placeholder="Organization name"
          {...register("name")}
          hasError={errors.name}
          errorMessage={errors.name?.message}
          className="w-full"
        />
        <Input
          placeholder="Contact email"
          {...register("contactEmail")}
          hasError={errors.contactEmail}
          errorMessage={errors.contactEmail?.message}
          className="w-full"
        />
        <SearchableDropdown
          options={mapOptions()}
          handleChangeOptions={(value) => handleChangeOptions(value)}
          handleSelect={(values) => handleSelect(values)}
        ></SearchableDropdown>
        <Button onClick={handleSubmit(handleOnSubmit)} className="w-full mt-6">
          Create
        </Button>
      </div>
    </div>
  );
};
