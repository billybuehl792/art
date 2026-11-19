import {
  createContext,
  useState,
  useCallback,
  type PropsWithChildren,
} from "react";
import ConfirmDialog, {
  type ConfirmOptions,
} from "@/components/modals/ConfirmDialog";

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

interface PendingConfirm {
  options: ConfirmOptions;
  resolve: (confirmed: boolean) => void;
}

export const ConfirmContext = createContext<ConfirmContextValue | null>(null);

const ConfirmProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  /** Callbacks */

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setPending({ options, resolve });
      setOpen(true);
    });
  }, []);

  const handleOnConfirm = () => {
    pending?.resolve(true);
    setOpen(false);
  };

  const handleOnCancel = () => {
    pending?.resolve(false);
    setOpen(false);
  };

  const handleExited = () => setPending(null);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialog
        open={open}
        onClose={handleOnCancel}
        onConfirm={handleOnConfirm}
        onTransitionExited={handleExited}
        {...pending?.options}
      />
    </ConfirmContext.Provider>
  );
};

export default ConfirmProvider;
