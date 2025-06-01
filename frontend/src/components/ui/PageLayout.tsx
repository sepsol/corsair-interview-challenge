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
  /** Optional action button to display in the header */
  headerAction?: ReactNode;
  /** Optional user info and logout section to display in the header */
  userSection?: ReactNode;
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
export default function PageLayout({ title, description, children, headerAction, userSection }: PageLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'var(--card)', borderBottomColor: 'var(--border)' }} className="border-b">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h1>
              {description && (
                <p className="mt-1" style={{ color: 'var(--muted-foreground)' }}>{description}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              {headerAction && (
                <div className="flex-shrink-0">
                  {headerAction}
                </div>
              )}
              {userSection && (
                <div className="flex-shrink-0">
                  {userSection}
                </div>
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