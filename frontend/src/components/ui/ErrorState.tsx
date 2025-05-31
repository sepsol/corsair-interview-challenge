interface ErrorStateProps {
  message: string;
  title?: string;
}

export default function ErrorState({ message, title = "Error loading tasks" }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-neutral-100 mb-2">{title}</h2>
        <p className="text-neutral-500">{message}</p>
      </div>
    </div>
  );
}