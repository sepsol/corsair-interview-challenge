interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

export default function LoadingSpinner({ 
  message = "Loading...", 
  fullPage = false 
}: LoadingSpinnerProps) {
  if (fullPage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-800 border-t-neutral-500 mx-auto mb-4"></div>
          <p className="text-neutral-500">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-700 border-t-neutral-400 mx-auto mb-3"></div>
        <p className="text-neutral-500 text-sm">{message}</p>
      </div>
    </div>
  );
}