import type { Metadata } from "next";
import PasswordListComponent from "@/components/layout/PasswordList";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Password Manager | PassProtector",
  description: "Securely manage all your passwords in one place",
};

export default function PasswordsPage() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "8px",
            border: "1px solid rgba(139, 92, 246, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#333",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#333",
            },
          },
        }}
      />
      <PasswordListComponent />
    </>
  );
}
