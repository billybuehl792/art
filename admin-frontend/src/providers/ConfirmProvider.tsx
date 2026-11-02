import {
  use,
  createContext,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";
import ConfirmDialog, {
  type ConfirmOptions,
} from "@/components/modals/ConfirmDialog";

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

type PendingConfirm = {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
};

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

const ConfirmProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  /** Callbacks */

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({
        options,
        resolve,
      });

      setOpen(true);
    });
  }, []);

  const handleConfirm = () => {
    pending?.resolve(true);
    setOpen(false);
  };

  const handleCancel = () => {
    pending?.resolve(false);
    setOpen(false);
  };

  const handleExited = () => setPending(null);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={open}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        onTransitionExited={handleExited}
        {...pending?.options}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = use(ConfirmContext);
  if (!context)
    throw new Error("useConfirm must be used within a ConfirmProvider");
  return context.confirm;
};

export default ConfirmProvider;
