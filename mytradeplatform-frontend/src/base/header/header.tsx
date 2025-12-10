import type { MouseEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import classNames from "classnames";

import styles from "./header.module.scss";
import { messageIcon, notifIcon } from "../SVG";
import { CustomButton } from "../../components/custom-button/custom-button";
import { SERVER_URL } from "../../config";
import type { Notification, UserProfile } from "@/types";

interface HeaderProps {
  user: UserProfile | null;
  notifications: Notification[];
  logout: () => void;
}

export default function Header({ user, notifications, logout }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.marked_as_read),
    [notifications]
  );

  useEffect(() => {
    document.body.classList.toggle("active", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
    document.body.classList.remove("active");
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY >= 60);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll<HTMLElement>(".anchor");
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute("id");

        if (sectionId && scrollPosition >= sectionTop) {
          setActiveLink(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenuIfOutside = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setMenuOpen(false);
    }
  };

  const userAvatar = user?.avatar ?? user?.profile_pic ?? "default.png";
  const unreadCount = unreadNotifications.length;

  return (
    <header
      className={classNames(styles["header"], {
        [styles["sticky"]]: isSticky,
        [styles["active"]]: menuOpen,
      })}
    >
      <div className="auto__container ex">
        <div className={styles["header__inner"]}>
          <Link to="/" className={styles["header__inner-logo"]}>
            <span>My</span>TradePlatform
          </Link>
          <div className={styles["header__inner-side"]}>
            <nav
              className={classNames(
                styles["nav"],
                menuOpen && styles["active"]
              )}
              onClick={closeMenuIfOutside}
            >
              <div className={styles["nav__inner"]}>
                <div className={styles["nav__inner-links"]}>
                  <li>
                    <Link to="/browse">Home</Link>
                  </li>
                  <li>
                    <a href="./#work" className={"anchorLinks"}>
                      How It Works
                    </a>
                  </li>
                  <li>
                    <Link to="/browse">Browse</Link>
                  </li>
                </div>
                {user ? (
                  <>
                    <li>
                      <Link to="/my-trades">My Trades</Link>
                    </li>
                    <li>
                      <Link to="/wallet">Wallet</Link>
                    </li>
                    <li>
                      <Link to="/trade">Invite</Link>
                    </li>
                    <li>
                      <Link to="/trade/post-item">Post Item</Link>
                    </li>
                    <div className={styles["nav__inner-tools"]}>
                      <Link to="/messages" className={styles["messageBtn"]}>
                        {messageIcon}
                      </Link>
                      <Link to="/notifications" className={styles["notifBtn"]}>
                        {notifIcon}
                        {unreadCount > 0 && <span>{unreadCount}</span>}
                      </Link>
                    </div>
                    <button
                      type="button"
                      className={styles["avatar__outer"]}
                      onClick={() => navigate("/user-profile")}
                    >
                      <h6>{user.username}</h6>
                      <div className={styles["avatar"]}>
                        <img
                          src={`${SERVER_URL}/profiles/${userAvatar}`}
                          alt="avatar"
                        />
                      </div>
                    </button>
                    <div
                      className={`${styles["nav__inner-buttons"]} ${styles["logout"]}`}
                    >
                      <CustomButton
                        data-role="logout"
                        title="Logout"
                        onClick={logout}
                      />
                    </div>
                  </>
                ) : (
                  <div className={styles["nav__inner-buttons"]}>
                    <CustomButton
                      title="Sign In"
                      styleType="solid"
                      onClick={() => navigate("/auth/")}
                    />
                    <CustomButton
                      title="Sign Up"
                      styleType="primary"
                      onClick={() => navigate("/auth/sign-up")}
                    />
                  </div>
                )}
              </div>
            </nav>
            {user && (
              <>
                <Link
                  to="/messages"
                  className={classNames(
                    styles["messageBtn"],
                    styles["hideOnDesktop"]
                  )}
                  style={{ position: "relative", top: "-5px" }}
                >
                  {messageIcon}
                </Link>
                <Link
                  to="/notifications"
                  className={classNames(
                    styles["notifBtn"],
                    styles["hideOnDesktop"]
                  )}
                  style={{
                    position: "relative",
                    top: "-5px",
                    marginRight: "5px",
                  }}
                >
                  {notifIcon}
                  {unreadCount > 0 && <span>{unreadCount}</span>}
                </Link>
                <button
                  type="button"
                  className={classNames(
                    styles["avatar__outer"],
                    styles["hideOnDesktop"]
                  )}
                  onClick={() => navigate("/user-profile")}
                  style={{ position: "relative", top: "-5px" }}
                >
                  <div className={styles["avatar"]}>
                    <img
                      src={`${SERVER_URL}/profiles/${userAvatar}`}
                      alt="avatar"
                    />
                  </div>
                </button>
              </>
            )}
            <button
              type="button"
              className={classNames(
                styles["burger"],
                menuOpen && styles["active"]
              )}
              onClick={() => setMenuOpen((prev) => !prev)}
              style={{ display: "inline-block" }}
            >
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
