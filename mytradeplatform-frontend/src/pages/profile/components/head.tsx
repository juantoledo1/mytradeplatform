import type { UserProfile } from "@/types";
import { editIcon, flagIcon, vaultIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import { apiClient } from "@/services/api/client";
import styles from "../profile.module.scss";
import { SERVER_URL } from "../../../config";

interface HeadProps {
  userData: UserProfile;
  user: UserProfile | null;
}

const formattedDate = (dateString?: string): string => {
  if (!dateString) {
    return "Unknown";
  }

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const calculateDifferenceInTime = (date1?: string, date2?: Date): string => {
  if (!date1 || !date2) {
    return "just now";
  }

  const diffInMs = Math.abs(date2.getTime() - new Date(date1).getTime());
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / (1000 * 60));
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`;
  }
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }
  return "just now";
};

export default function Head({ userData, user }: HeadProps) {
  const isOwner = user?.id === userData.id;
  const avatarPath = userData.profile_pic ?? "/profiles/default.png";

  return (
    <div className={styles["head"]}>
      <div className={styles["head__avatar"]}>
        <img src={`${SERVER_URL}${avatarPath}`} alt="avatar" />
        <div className={styles["head__status"]}>
          {vaultIcon}
          Trusted
        </div>
      </div>
      <div className={styles["headContent"]}>
        <h1 className="sm">{userData.username}</h1>
        <div className={styles["headContent__location"]}>
          {flagIcon}
          <p>{userData.location ?? "Unknown"}</p>
        </div>
        <div className={styles["headContent__text"]}>
          <p>{userData.description ?? "No description available."}</p>
        </div>
        <div className={styles["headContent__info"]}>
          <p>
            Member since {formattedDate(userData.create_ts)}
            <span>�</span> Last active {calculateDifferenceInTime(userData.last_activity_ts, new Date())}
          </p>
        </div>
      </div>
      <div className={styles["head__button"]}>
        {isOwner ? (
          <div className={styles["edit"]} onClick={() => {
            // Lógica para editar perfil
            window.location.href = "/profile/edit";
          }}>{editIcon}</div>
        ) : (
          <CustomButton 
            size="sm" 
            title="Send Trade Request" 
            styleType="primary" 
            onClick={async () => {
              try {
                // Lógica para enviar solicitud de comercio
                const response = await apiClient.post('/api/trade/create', {
                  traderReceivingId: userData.id,
                  itemOfferedId: null, // El usuario seleccionará qué artículo ofrecer
                  notes: "Trade request from profile"
                });
                
                if (response.status === 201) {
                  alert("Trade request sent successfully!");
                } else {
                  alert("Error sending trade request");
                }
              } catch (error) {
                console.error('Error sending trade request:', error);
                alert("Error sending trade request. Please try again.");
              }
            }} 
          />
        )}
      </div>
    </div>
  );
}
