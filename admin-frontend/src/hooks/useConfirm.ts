import { use } from "react";
import { ConfirmContext } from "@/providers/ConfirmProvider";

const useConfirm = () => {
  const context = use(ConfirmContext);
  if (!context)
    throw new Error("useConfirm must be used within a ConfirmProvider");

  return context.confirm;
};

export default useConfirm;
