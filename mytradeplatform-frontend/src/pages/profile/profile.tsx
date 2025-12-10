import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styles from "./profile.module.scss";
import Head from "./components/head";
import History from "./components/history";
import Info from "./components/info";
import Interest from "./components/interest";
import Reviews from "./components/reviews";
import { SERVER_URL } from "../../config";
import type { UserProfile } from "@/types";

interface ProfileProps {
  user: UserProfile | null;
}

interface ApiErrorResponse {
  message?: string;
}

const loaderStyles = {
  display: "block",
  margin: "10vh auto",
  borderColor: "#209999",
};

export default function Profile({ user }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<"reviews" | "history">("reviews");
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  const handleError = (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.message ?? "We could not load the profile.";

    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const getUser = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedUserId = urlParams.get("id");
      const activeUserId = user?.id ? String(user.id) : null;
      const endpoint =
        requestedUserId && requestedUserId !== activeUserId
          ? `/api/auth/profile/user/${requestedUserId}/`
          : "/api/auth/user/";

      const response = await apiClient.get<UserProfile>(endpoint);

      setUserData(response.data);
      setIsLoaded(true);
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    if (!isLoaded) {
      void getUser();
    }
  }, [isLoaded]);

  if (!isLoaded || !userData) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "100vh", backgroundColor: "#fff" }}
      >
        <div style={{ top: "20vh", position: "relative" }}>
          <BarLoader color="#209999" cssOverride={loaderStyles} />
        </div>
      </div>
    );
  }

  const viewer = user ?? userData;

  return (
    <section className={styles["profile"]}>
      <div className="auto__container">
        <div className={styles["profile__inner"]}>
          <Head userData={userData} user={viewer} />
          <Info userData={userData} />
          <Interest userData={userData} user={viewer} />
          <div className={styles["profileTabs"]}>
            <button
              type="button"
              className={activeTab === "reviews" ? styles["active"] : ""}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews
            </button>
            <button
              type="button"
              className={activeTab === "history" ? styles["active"] : ""}
              onClick={() => setActiveTab("history")}
            >
              Trade History
            </button>
          </div>
          {activeTab === "reviews" && <Reviews userData={userData} />}
          {activeTab === "history" && <History userData={userData} />}
        </div>
      </div>
    </section>
  );
}
