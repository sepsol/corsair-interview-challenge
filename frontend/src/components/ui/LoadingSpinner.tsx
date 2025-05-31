interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Loading..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-800 border-t-neutral-500 mx-auto mb-4"></div>
        <p className="text-neutral-500">{message}</p>
      </div>
    </div>
  );
}