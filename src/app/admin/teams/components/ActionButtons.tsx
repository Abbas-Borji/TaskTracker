import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  teamId: number;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ActionButtons = ({ teamId, onDelete, onEdit }: ActionButtonsProps) => {
  const handleDelete = () => {
    onDelete(teamId);
  };
  const handleEdit = () => {
    console.log("edit " + teamId);
    onEdit(teamId);
  };
  return (
    <div className="flex">
      <button
        onClick={() => {
          handleEdit();
        }}
        className="mr-4 px-2 font-medium text-primary"
      >
        Edit
      </button>

      <button onClick={() => handleDelete()}>
        <TrashIcon className="h-5 w-5 text-red-600" />
      </button>
    </div>
  );
};

export default ActionButtons;
