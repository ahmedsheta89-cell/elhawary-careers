/**
 * Card Component
 * Reusable card with header, content, and footer sections
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children?: React.ReactNode;
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
          'border-border-default overflow-hidden rounded-xl border bg-white shadow-sm',
          hoverable &&
            'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg',
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
              <h3 className="text-text-primary mb-2 text-xl font-semibold">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-text-secondary text-sm">{description}</p>
            )}
          </div>
        )}

        {children && (
          <div className={cn((title || description) && 'mt-4')}>{children}</div>
        )}

        {footer && (
          <div
            className={cn(
              'border-border-default mt-6 border-t pt-6',
              padding === 'none' && 'border-t-0 pt-0'
            )}
          >
            {footer}
          </div>
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// Card Header component
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mb-4 flex flex-col gap-1', className)}
      {...props}
    >
      {title && (
        <h3 className="text-text-primary text-xl font-semibold">{title}</h3>
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
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-text-secondary', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

// Card Footer component
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'border-border-default mt-6 flex items-center gap-4 border-t pt-6',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
