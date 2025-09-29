import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ style, ...props }, ref) => {
  const viewportStyles = {
    position: 'fixed',
    top: 0,
    zIndex: 100,
    display: 'flex',
    maxHeight: '100vh',
    width: '100%',
    flexDirection: 'column-reverse',
    padding: '16px',
    '@media (min-width: 640px)': {
      bottom: 0,
      right: 0,
      top: 'auto',
      flexDirection: 'column'
    },
    '@media (min-width: 768px)': {
      maxWidth: '420px'
    },
    ...style
  };

  return (
    <ToastPrimitives.Viewport
      ref={ref}
      style={viewportStyles}
      {...props}
    />
  );
});
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const Toast = React.forwardRef(({ style, variant = 'default', ...props }, ref) => {
  const baseStyles = {
    position: 'relative',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    overflow: 'hidden',
    borderRadius: '6px',
    border: '1px solid hsl(220, 13%, 91%)',
    padding: '24px',
    paddingRight: '32px',
    boxShadow: '0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1)',
    transition: 'all 0.3s ease',
    pointerEvents: 'auto'
  };

  const variantStyles = {
    default: {
      backgroundColor: 'hsl(0, 0%, 100%)',
      color: 'hsl(222, 47%, 11%)'
    },
    destructive: {
      border: '1px solid hsl(0, 84%, 60%)',
      backgroundColor: 'hsl(0, 84%, 60%)',
      color: 'hsl(0, 0%, 100%)'
    }
  };

  const toastStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...style
  };

  return <ToastPrimitives.Root ref={ref} style={toastStyles} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ style, ...props }, ref) => {
  const actionStyles = {
    display: 'inline-flex',
    height: '32px',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '6px',
    border: '1px solid hsl(220, 13%, 91%)',
    backgroundColor: 'transparent',
    padding: '0 12px',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'colors 0.2s ease',
    cursor: 'pointer',
    ...style
  };

  return (
    <ToastPrimitives.Action
      ref={ref}
      style={actionStyles}
      {...props}
    />
  );
});
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ style, ...props }, ref) => {
  const closeStyles = {
    position: 'absolute',
    right: '8px',
    top: '8px',
    borderRadius: '6px',
    padding: '4px',
    color: 'hsl(215, 16%, 47%)',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    ...style
  };

  return (
    <ToastPrimitives.Close
      ref={ref}
      style={closeStyles}
      onMouseOver={(e) => {
        e.target.style.opacity = 1;
        e.target.style.color = 'hsl(222, 47%, 11%)';
      }}
      onMouseOut={(e) => {
        e.target.style.opacity = 0;
        e.target.style.color = 'hsl(215, 16%, 47%)';
      }}
      {...props}
    >
      <X style={{ height: '16px', width: '16px' }} />
    </ToastPrimitives.Close>
  );
});
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ style, ...props }, ref) => {
  const titleStyles = {
    fontSize: '14px',
    fontWeight: 600,
    ...style
  };

  return (
    <ToastPrimitives.Title ref={ref} style={titleStyles} {...props} />
  );
});
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ style, ...props }, ref) => {
  const descriptionStyles = {
    fontSize: '14px',
    opacity: 0.9,
    ...style
  };

  return (
    <ToastPrimitives.Description ref={ref} style={descriptionStyles} {...props} />
  );
});
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
};