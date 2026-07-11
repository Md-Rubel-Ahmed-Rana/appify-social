"use client";
import { useRouter } from "next/navigation";
import { useLogoutMutation } from "@/api/auth";

const LogoutButton = () => {
  const router = useRouter();

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    if (isLoading) return;

    try {
      await logout({}).unwrap();

      router.replace("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
