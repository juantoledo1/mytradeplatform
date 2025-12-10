import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../browse.module.scss";
import {
  arrowLeft,
  calendarIcon,
  chatIcon,
  eyeIcon,
  flagIcon,
  heartIcon,
  locationIcon,
  shareIcon,
  starIcon,
  vaultIcon,
  energyIcon,
  viewIcon,
} from "@/base/SVG";
import placeholder from "@/assets/images/placeholder.png";
import avatar from "@/assets/images/avatars/1.png";
import Slider from "react-slick";
import { CustomButton } from "@/components/custom-button/custom-button";
import StartChat from "./start-chat";
import { AnimatePresence } from "framer-motion";

// third party
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// project import
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function SingleItem() {
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    accessibility: true,
  };
  const settings2 = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    focusOnSelect: true,
    draggable: false,
  };

  const urlParams = new URLSearchParams(window.location.search);
  const item_id = urlParams.get("id");

  const [loaded, setLoaded] = useState(false);
  const [itemData, setItemData] = useState(null);

  const getItem = (id) => {
    apiClient
      .get(`/api/trade/items/${id}`)
      .then((response) => {
        setItemData(response.data);

        setLoaded(true);
      })
      .catch((error) => {
        toast.error(error.response.data.detail, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  useEffect(() => {
    if (!loaded && item_id) {
      getItem(item_id);
    }
  }, [item_id]);

  const favoriteItem = () => {
    apiClient
      .post(`/api/trade/items/${item_id}/favorite`, {})
      .then((response) => {
        if (response.data.message == "Item unfavorited") {
          itemData.favorite_count -= 1;
          itemData.is_favorite = false;
        } else {
          itemData.favorite_count += 1;
          itemData.is_favorite = true;
        }
        setItemData({ ...itemData });
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const calculateDateDifference = (date1, date2) => {
    const diffTime = date2 - date1;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    } else {
      return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
    }
  };

  if (!loaded) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: "100vh", backgroundColor: "#fff" }}
      >
        <div style={{ top: "20vh", position: "relative" }}>
          <BarLoader
            color="#209999"
            cssOverride={{
              display: "block",
              margin: "10vh auto",
              borderColor: "red",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <section className={styles["single"]}>
        <div className="auto__container">
          <div className={styles["single__inner"]}>
            <Link to="/browse" className={styles["single__back"]}>
              {arrowLeft}
              Back to Browse
            </Link>
            <div className={styles["single__inner-row"]}>
              <div className={styles["single__inner-wrapper"]}>
                <Slider
                  {...settings}
                  asNavFor={nav2}
                  ref={(slider1) => setNav1(slider1)}
                  className={styles["single__slider"]}
                >
                  {Array.isArray(itemData.images) &&
                    itemData.images.map((item, index) => {
                      return <SingleSlide image={item.url} key={index} />;
                    })}
                </Slider>

                <Slider
                  {...settings2}
                  asNavFor={nav1}
                  ref={(slider2) => setNav2(slider2)}
                  className={styles["single__swiper"]}
                ></Slider>
              </div>
              <div className={styles["single__inner-content"]}>
                <div className={styles["singleInfo"]}>
                  <div className={styles["singleInfo__title"]}>
                    <h1>{itemData.name}</h1>
                    <div className={styles["singleInfo__tools"]}>
                      <button
                        type="button"
                        onClick={favoriteItem}
                        aria-label={
                          itemData.is_favorite ? "Unfavorite" : "Favorite"
                        }
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill={itemData.is_favorite ? "#e53935" : "none"}
                        >
                          <path
                            d="M12.6673 9.33333C13.6607 8.36 14.6673 7.19333 14.6673 5.66667C14.6673 4.69421 14.281 3.76158 13.5934 3.07394C12.9057 2.38631 11.9731 2 11.0007 2C9.82732 2 9.00065 2.33333 8.00065 3.33333C7.00065 2.33333 6.17398 2 5.00065 2C4.02819 2 3.09556 2.38631 2.40793 3.07394C1.72029 3.76158 1.33398 4.69421 1.33398 5.66667C1.33398 7.2 2.33398 8.36667 3.33398 9.33333L8.00065 14L12.6673 9.33333Z"
                            stroke={
                              itemData.is_favorite ? "#e53935" : "currentColor"
                            }
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button type="button" onClick={() => alert("Share functionality coming soon...")}>{shareIcon}</button>
                      <button type="button" onClick={() => alert("Report item functionality coming soon...")}>{flagIcon}</button>
                    </div>
                  </div>
                  <div className={styles["singleInfo__field"]}>
                    <div className={styles["singleInfo__status"]}>
                      {itemData.trade_type == "Quick" ? (
                        <>{energyIcon} Quick Trade</>
                      ) : (
                        <>{vaultIcon} Vault Trade</>
                      )}
                    </div>
                    <span>Drivers</span>
                    <span>Good</span>
                  </div>
                  <div className={styles["singleInfo__price"]}>$225</div>
                  <div className={styles["singleInfo__row"]}>
                    <p>
                      {eyeIcon}
                      {itemData.view_count || 0} views
                    </p>
                    <p>
                      {heartIcon && typeof heartIcon === "function"
                        ? heartIcon({
                            fill: itemData.is_favorite ? "#e53935" : "none",
                            color: itemData.is_favorite
                              ? "#e53935"
                              : "currentColor",
                            style: {
                              transition: "fill 0.2s, color 0.2s",
                              verticalAlign: "middle",
                            },
                          })
                        : heartIcon}
                      {itemData.favorite_count || 0} favorites
                    </p>
                    <p>
                      {calendarIcon}
                      Listed{" "}
                      {calculateDateDifference(
                        new Date(itemData.createdAt),
                        new Date(new Date().toUTCString())
                      )}
                    </p>
                  </div>
                  <div className={styles["singleInfo__price"]}></div>
                  <div className={styles["singleInfo__buttons"]}>
                    <CustomButton
                      title="Trade with Me"
                      styleType="primary"
                      onClick={() => setShowChat(!showChat)}
                    />
                    <CustomButton
                      iconPos="left"
                      title="Message Seller"
                      styleType="solid"
                      icon={chatIcon}
                      onClick={() => navigate("/messages")}
                    />
                  </div>
                </div>
                <div className={styles["singleAbout"]}>
                  <h5>About the Seller</h5>
                  <div className={styles["singleAbout__profile"]}>
                    <div className={styles["singleAbout__avatar"]}>
                      {itemData.owner_profile_pic ? (
                        <img
                          src={SERVER_URL + "/profiles/default.png"}
                          alt="avatar"
                        />
                      ) : (
                        <UserCircleIcon className="h-12 w-12 text-gray-200" />
                      )}
                    </div>
                    <div className={styles["singleAbout__content"]}>
                      <div className={styles["singleAbout__name"]}>
                        <h6>{itemData.ownerUsername}</h6>
                        {itemData.isActive ? (
                          <div className={styles["singleAbout__status"]}>
                            Verified Email
                          </div>
                        ) : (
                          <div className={styles["singleAbout__status"]}>
                            Unverified Email
                          </div>
                        )}
                      </div>
                      <div className={styles["singleAbout__info"]}>
                        <div className={styles["singleAbout__rate"]}>
                          {starIcon}
                          {itemData.average_rating || 0} (
                          {itemData.review_count} trades)
                        </div>
                        <div className={styles["singleAbout__location"]}>
                          {locationIcon}
                          {itemData.location || "Unknown Location"}
                        </div>
                      </div>
                      <p>{itemData.owner_description}</p>
                    </div>
                  </div>
                  <div className={styles["singleAbout__buttons"]}>
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/user-profile?id=" + itemData.ownerId)
                      }
                    >
                      View Profile
                      {viewIcon}
                    </button>
                    <button type="button" onClick={() => navigate(`/browse?owner=${itemData.ownerId}`)}>View Other Items</button>
                  </div>
                </div>
                <div className={styles["singleTags"]}>
                  <h6>Tags</h6>
                  <div className={styles["singleTags__row"]}>
                    {Array.isArray(itemData.interests) &&
                      itemData.interests
                        .filter((tag) => !!tag.name)
                        .map((tag) => (
                          <span key={tag.id}>{tag.name.trim()}</span>
                        ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className={styles["singleRow"]}
              style={{ width: "100% !important" }}
            >
              <div
                className={styles["singleCol"]}
                style={{ width: "100%", maxWidth: "None" }}
              >
                <h4>Description</h4>
                <p>{itemData.description || "No description provided."}</p>
              </div>
            </div>
            {/*<div className={styles["singleRow"]}>
              <div className={styles["singleCol"]}>
                <h4>Description</h4>
                <p>
                  {itemData.description || "No description provided."}
                </p>
              </div>
              <div className={styles["singleCol"]}>
                <h4>Specifications</h4>
                <div className={styles["singleCol__row"]}>
                  <p>Loft:</p>
                  <p>10.5°</p>
                </div>
                <div className={styles["singleCol__row"]}>
                  <p>Shaft:</p>
                  <p>Ventus Blue Stiff</p>
                </div>
                <div className={styles["singleCol__row"]}>
                  <p>Grip:</p>
                  <p>Golf Pride Tour Velvet</p>
                </div>
                <div className={styles["singleCol__row"]}>
                  <p>Hand:</p>
                  <p>Right</p>
                </div>
                <div className={styles["singleCol__row"]}>
                  <p>Length:</p>
                  <p>45.5"</p>
                </div>
              </div>
            </div>*/}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {showChat && (
          <StartChat showChat={showChat} setShowChat={setShowChat} />
        )}
      </AnimatePresence>
    </>
  );
}
const SingleSlide = (props) => {
  return (
    <div className={styles["singleSlide"]}>
      <div className={styles["singleSlide__inner"]}>
        <img src={props.image} alt="slideImage" />
      </div>
    </div>
  );
};
const SingleSwipe = (props) => {
  return (
    <div className={styles["singleSwipe"]}>
      <div className={styles["singleSwipe__inner"]}>
        <img src={props.image} alt="slideImage" />
      </div>
    </div>
  );
};
