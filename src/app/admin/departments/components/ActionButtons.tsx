import { TrashIcon } from "@heroicons/react/24/outline";

interface ActionButtonsProps {
  departmentId: number;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

const ActionButtons = ({ departmentId, onDelete, onEdit }: ActionButtonsProps) => {
  const handleDelete = () => {
    onDelete(departmentId);
  };
  const handleEdit = () => {
    onEdit(departmentId);
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
