import LoadingSpinner from '@/components/ui/LoadingSpinner';

/**
 * A full-screen loading component specifically for authentication checks
 * 
 * Features:
 * - Full screen height and centered layout
 * - Theme-aware background color
 * - Consistent "Checking authentication..." message
 * - Reusable across authentication flows
 * 
 * @returns A themed full-screen loading spinner for authentication
 */
export default function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background)' }}>
      <LoadingSpinner message="Checking authentication..." />
    </div>
  );
}