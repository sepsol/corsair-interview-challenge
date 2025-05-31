import { Task } from "@task-manager/shared";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";

/**
 * Props for the TaskCard component
 */
interface TaskCardProps {
  /** The task object to display */
  task: Task;
  /** Callback function to handle editing a task */
  onEdit?: (task: Task) => void;
  /** Callback function to handle deleting a task */
  onDelete?: (task: Task) => void;
  /** Callback function to handle toggling task status */
  onToggleStatus?: (task: Task) => void;
}

/**
 * A card component for displaying individual task information
 * 
 * Displays task details including:
 * - Title and description
 * - Creation date
 * - Status indicator with appropriate styling
 * - Edit and delete action buttons
 * - Hover effects for interactive feel
 * 
 * @param props - The component props
 * @returns A styled card displaying task information
 * 
 * @example
 * ```tsx
 * <TaskCard task={taskObject} />
 * ```
 */
export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    } else {
      console.log('Edit task:', task.id, task.title);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(task);
    } else {
      console.log('Delete task:', task.id, task.title);
    }
  };

  const handleCheckboxToggle = () => {
    if (onToggleStatus) {
      onToggleStatus(task);
    } else {
      console.log('Toggle status for task:', task.id, task.title);
    }
  };


  return (
    <div className="group bg-neutral-900 border border-neutral-700/60 rounded-md p-5 hover:bg-neutral-800/80 hover:border-neutral-600/70 transition-all duration-200">
      {/* Title row with checkbox and action buttons */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 flex-1 mr-3">
          <Checkbox
            checked={task.status === 'completed'}
            size="lg"
            onChange={handleCheckboxToggle}
          />
          <h3 className="font-medium text-neutral-100">{task.title}</h3>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            onClick={handleEdit}
            variant="secondary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Button>
          <Button
            onClick={handleDelete}
            variant="danger-outline"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </div>
      </div>
      
      {/* Description and metadata */}
      <div>
        <p className="text-neutral-400 text-sm mb-3 leading-relaxed">{task.description}</p>
        <div className="flex items-center gap-4 text-xs text-neutral-600">
          <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
          {task.status === 'completed' && (
            <span className="text-green-400/60 font-medium">✓ Completed</span>
          )}
          {task.status === 'pending' && (
            <span className="text-amber-400/65 font-medium">⏳ Pending</span>
          )}
        </div>
      </div>
    </div>
  );
}