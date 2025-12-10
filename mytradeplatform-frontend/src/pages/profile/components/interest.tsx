import type { UserProfile } from "@/types";
import styles from "../profile.module.scss";

interface InterestProps {
  userData: UserProfile;
  user: UserProfile | null;
}

export default function Interest({ userData, user }: InterestProps) {
  const interests = userData.interests ?? [];
  const isOwner = user?.id === userData.id;

  return (
    <div className={styles["interest"]}>
      <div className={styles["interest__title"]}>
        <h5>Looking For</h5>
        <p>Items this user is interested in trading for</p>
      </div>
      <div className={styles["interest__row"]}>
        {interests.length > 0 ? (
          interests.map((interest) => (
            <div key={interest.id} className={styles["interest__item"]}>
              {interest.icon && <span>{interest.icon}</span>}
              <p>{interest.name}</p>
            </div>
          ))
        ) : (
          <div className={styles["interest__item"]}>
            <p>No interests listed</p>
          </div>
        )}
        {isOwner && (
          <div className={styles["interest__item"]}>
            <p>+</p>
          </div>
        )}
      </div>
    </div>
  );
}
