import { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
}

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