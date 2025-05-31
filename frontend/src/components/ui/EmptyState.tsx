interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export default function EmptyState({ 
  title, 
  description, 
  icon = "📝" 
}: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-neutral-100 mb-2">{title}</h3>
      <p className="text-neutral-500 mb-6">{description}</p>
    </div>
  );
}