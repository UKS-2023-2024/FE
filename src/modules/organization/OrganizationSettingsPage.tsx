import { Button } from "../../components/button/Button";
import { useDeleteOrganization } from "../../api/mutations/useDeleteOrganization";
import { currentOrganizationAtom } from "../../store/store";
import { useAtom } from "jotai";

export const OrganizationSettingsPage = () => {
  const { mutateAsync: deleteOrganization } = useDeleteOrganization();
  const [organization] = useAtom(currentOrganizationAtom);

  const handleDelete = async () => {
    await deleteOrganization(organization?.id ?? "");
  };

  return (
    <div className="w-full flex flex-col items-center pt-6">
      <div className="flex gap-8 border border-white rounded p-10">
        <div className="text-white">
          <p>Delete this organization</p>
          <p>Once deleted, it will be gone forever. Please be certain.</p>
        </div>
        <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-400">
          Delete this organization
        </Button>
      </div>
    </div>
  );
};
