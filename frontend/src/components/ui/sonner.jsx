import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }) => {
  // Since we're not using next-themes, we'll default to light theme
  const theme = "light";

  const toasterStyles = {
    // Custom CSS injection for sonner toast styling
  };

  // Inject global styles for sonner toasts
  if (typeof document !== 'undefined' && !document.head.querySelector('#sonner-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'sonner-styles';
    styleElement.textContent = `
      .toaster {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .toaster .toast {
        background-color: hsl(0, 0%, 100%) !important;
        color: hsl(222, 47%, 11%) !important;
        border: 1px solid hsl(220, 13%, 91%) !important;
        box-shadow: 0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1) !important;
      }
      .toaster .toast[data-description] {
        color: hsl(215, 16%, 47%) !important;
      }
      .toaster .toast [data-action] {
        background-color: hsl(238, 64%, 59%) !important;
        color: hsl(0, 0%, 100%) !important;
      }
      .toaster .toast [data-cancel] {
        background-color: hsl(220, 13%, 91%) !important;
        color: hsl(215, 16%, 47%) !important;
      }
    `;
    document.head.appendChild(styleElement);
  }

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        style: {
          backgroundColor: 'hsl(0, 0%, 100%)',
          color: 'hsl(222, 47%, 11%)',
          border: '1px solid hsl(220, 13%, 91%)',
          boxShadow: '0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1)'
        }
      }}
      {...props}
    />
  );
};

export { Toaster, toast };