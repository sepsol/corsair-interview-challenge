/**
 * Props for the EmptyState component
 */
interface EmptyStateProps {
  /** The main title to display */
  title: string;
  /** Description text explaining the empty state */
  description: string;
  /** Optional emoji or icon to display above the title */
  icon?: string;
}

/**
 * A reusable empty state component for displaying when no data is available
 * 
 * @param props - The component props
 * @returns An empty state display with icon, title, and description
 * 
 * @example
 * ```tsx
 * // Default empty state
 * <EmptyState 
 *   title="No tasks yet" 
 *   description="Create your first task to get started" 
 * />
 * 
 * // Custom icon
 * <EmptyState 
 *   title="No notifications" 
 *   description="You're all caught up!" 
 *   icon="🔔" 
 * />
 * ```
 */
export default function EmptyState({ 
  title, 
  description, 
  icon = "📝" 
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-neutral-100 mb-2">{title}</h3>
      <p className="text-neutral-400 mb-6">{description}</p>
    </div>
  );
}