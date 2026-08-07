/**
 * Card Component
 * Reusable card with header, content, and footer sections
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      title,
      description,
      header,
      footer,
      children,
      hoverable = false,
      padding = 'md',
      ...props
    },
    ref
  ) => {
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'bg-white rounded-xl border border-border-default shadow-sm overflow-hidden',
          hoverable && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          paddingClasses[padding],
          className
        )}
        whileHover={hoverable ? { y: -4 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {header && <div className="mb-4">{header}</div>}
        
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-text-secondary text-sm">
                {description}
              </p>
            )}
          </div>
        )}
        
        {children && <div className={cn((title || description) && 'mt-4')}>
          {children}
        </div>}
        
        {footer && (
          <div className={cn(
            'mt-6 pt-6 border-t border-border-default',
            padding === 'none' && 'border-t-0 pt-0'
          )}>
            {footer}
          </div>
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header component
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1 mb-4', className)}
      {...props}
    >
      {title && (
        <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      )}
      {description && (
        <p className="text-text-secondary text-sm">{description}</p>
      )}
      {children}
    </div>
  )
);

CardHeader.displayName = 'CardHeader';

// Card Content component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-text-secondary', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

// Card Footer component
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-4 mt-6 pt-6 border-t border-border-default',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
