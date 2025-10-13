/**
 * Reusable Empty State Component
 * Display when no data is available
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.title - Main title text
 * @param {string} [props.description] - Optional description
 * @param {Object} [props.action] - Optional action button config
 * @param {string} props.action.label - Button label
 * @param {Function} props.action.onClick - Button click handler
 * @param {React.ReactNode} [props.children] - Additional content
 */
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  children 
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {Icon && (
          <div className="mb-4 rounded-full bg-muted p-4">
            <Icon className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        
        <h3 className="mb-2 text-xl font-semibold text-gray-900">
          {title}
        </h3>
        
        {description && (
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {action && (
          <Button onClick={action.onClick}>
            {action.label}
          </Button>
        )}
        
        {children}
      </CardContent>
    </Card>
  );
}
