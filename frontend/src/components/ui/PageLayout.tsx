import { ReactNode } from "react";

/**
 * Props for the PageLayout component
 */
interface PageLayoutProps {
  /** The main page title displayed in the header */
  title: string;
  /** Optional description text displayed below the title */
  description?: string;
  /** The main content to render in the page body */
  children: ReactNode;
}

/**
 * A consistent page layout wrapper with header and content area
 * 
 * Provides a standardized dark theme layout with:
 * - Fixed header with title and optional description
 * - Responsive content area with consistent spacing
 * - Maximum width container for optimal readability
 * 
 * @param props - The component props
 * @returns A complete page layout with header and content
 * 
 * @example
 * ```tsx
 * <PageLayout title="Tasks" description="Manage your tasks efficiently">
 *   <div>Your page content here</div>
 * </PageLayout>
 * ```
 */
export default function PageLayout({ title, description, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-700/50">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-100">{title}</h1>
              {description && (
                <p className="text-neutral-500 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
}