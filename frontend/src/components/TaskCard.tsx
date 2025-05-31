import { Task } from "@task-manager/shared";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-700/60 rounded-md p-5 hover:bg-neutral-800/80 hover:border-neutral-600/70 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-neutral-100 mb-2">{task.title}</h3>
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
    </div>
  );
}