import classNames from "classnames";
import { useEffect, useState } from "react";
import {
  checkIcon,
  clockIcon,
  cubeIcon,
  deliveredIcon,
  flagIcon,
  shieldIcon,
  totalIcon,
} from "@/base/SVG";
import styles from "../my-trades.module.scss";

import { CustomButton } from "@/components/custom-button/custom-button";
import { mainList } from "@/constants/modul";
import { apiClient } from "@/services/api/client";
import { SERVER_URL } from "../../../config";

export default function Main() {
  const [userItems, setUserItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserItems = async () => {
    try {
      const response = await apiClient.get(`${SERVER_URL}/api/trade/items/my`);
      const items = response.data.results || [];
      
      // Transformar los datos del backend al formato esperado por el frontend
      const transformedItems = items.map((item: any) => ({
        id: item.id.toString(),
        title: item.name,
        type: "quick",
        status: "pending",
        date: new Date(item.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        avatar: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMwMDdiZmYiLz4KPHN2ZyB4PSIxMiIgeT0iMTIiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIgMTJDMTQuMjA5MSAxMiAxNiAxMC4yMDkxIDE2IDhDMTYgNS43OTA5IDE0LjIwOTEgNCAxMiA0QzkuNzkwODYgNCA4IDUuNzkwOSA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTIgMTRDOC42ODYyOSAxNCA2IDE2LjY4NjMgNiAyMFYyMkgxOFYyMEMxOCAxNi42ODYzIDE1LjMxMzcgMTQgMTIgMTRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+",
        partner: "Trading Partner",
        card: [
          {
            id: "1",
            image: item.images && item.images.length > 0 ? item.images[0].url : null,
            title: "Your Item",
            name: item.name,
            price: `$${item.price}`,
          },
        ],
      }));
      
      setUserItems(transformedItems);
    } catch (error) {
      console.error('Error fetching user items:', error);
      setUserItems(Array.isArray(mainList) ? mainList : []);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, []);

  // Actualizar cuando la página se enfoque (usuario regresa de subir item)
  useEffect(() => {
    const handleFocus = () => {
      fetchUserItems();
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (isLoading) {
    return (
      <div className={styles["main"]}>
        <p>Loading your items...</p>
      </div>
    );
  }

  // Asegurar que userItems sea siempre un array
  const itemsArray = Array.isArray(userItems) ? userItems : [];

  return (
    <div className={styles["main"]}>
      {itemsArray.length === 0 ? (
        <div className={styles["emptyState"]}>
          <h3>No items yet</h3>
          <p>Start by posting your first item for trade!</p>
          <CustomButton
            title="Post New Item"
            styleType="primary"
            onClick={() => window.location.href = "/trade/post-item"}
          />
        </div>
      ) : (
        <>
          <div className={styles["refreshButton"]}>
            <CustomButton
              title="Refresh Items"
              styleType="outline"
              size="sm"
              onClick={() => {
                setIsLoading(true);
                fetchUserItems();
              }}
            />
          </div>
          {itemsArray.map((item, index) => {
            return <Item {...item} key={index} />;
          })}
        </>
      )}
    </div>
  );
}
const Item = (props) => {
  return (
    <div className={styles["item"]}>
      <div className={styles["itemHead"]}>
        <div className={styles["itemHead__row"]}>
          <div className={styles["itemHead__title"]}>
            <h3>{props.title}</h3>
            {props.type === "quick" && (
              <div
                className={classNames(
                  styles["itemHead__type"],
                  styles["quick"]
                )}
              >
                {cubeIcon}
                Quick
              </div>
            )}
            {props.type === "vault" && (
              <div
                className={classNames(
                  styles["itemHead__type"],
                  styles["vault"]
                )}
              >
                {shieldIcon}
                Vault
              </div>
            )}
          </div>
          <>
            {props.status === "pending" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {clockIcon}
                Pending Acceptance
              </div>
            )}
            {props.status === "transit" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {totalIcon}
                In Transit
              </div>
            )}
            {props.status === "completed" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {checkIcon}
                Completed
              </div>
            )}
            {props.status === "delivered" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {deliveredIcon}
                Delivered
              </div>
            )}
            {props.status === "dispute" && (
              <div
                className={classNames(
                  styles["itemHead__status"],
                  styles[props.status]
                )}
              >
                {flagIcon}
                Dispute Open
              </div>
            )}
          </>
        </div>
        <div className={styles["itemHead__row"]}>
          <div className={styles["itemHead__date"]}>
            <p>Started: {props.date}</p>
          </div>
          <div className={styles["itemHead__partner"]}>
            <p>With:</p>
            <span>
              <img src={props.avatar} alt="avatar" />
            </span>
            <p>{props.partner}</p>
          </div>
        </div>
      </div>
      <div className={styles["itemMain"]}>
        {props.card && Array.isArray(props.card) ? props.card.map((item, index) => {
          return (
            <div className={styles["itemCard"]} {...item} key={index}>
              <div className={styles["itemCard__title"]}>
                <p>{item.title}</p>
              </div>
              <div className={styles["itemCard__row"]}>
                <div className={styles["itemCard__image"]}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt="item" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className={styles["itemCard__placeholder"]}>
                      <span>📦</span>
                      <p>No image available</p>
                    </div>
                  )}
                  <div className={styles["itemCard__placeholder"]} style={{display: 'none'}}>
                    <span>📦</span>
                    <p>Image not found</p>
                  </div>
                </div>
                <div className={styles["itemCard__name"]}>
                  <h6>{item.name || item.title}</h6>
                  <p>${item.price}</p>
                  {item.add && (
                    <div className={styles["itemCard__add"]}>{item.add}</div>
                  )}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className={styles["itemCard"]}>
            <div className={styles["itemCard__title"]}>
              <p>Your Item</p>
            </div>
            <div className={styles["itemCard__row"]}>
              <div className={styles["itemCard__image"]}>
                <div className={styles["itemCard__placeholder"]}>
                  <span>📦</span>
                  <p>No image available</p>
                </div>
              </div>
              <div className={styles["itemCard__name"]}>
                <h6>Upload your item photo</h6>
                <p>$0</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles["itemFoot"]}>
        <div className={styles["itemFoot__details"]}>
          <CustomButton
            size="sm"
            title="View Details"
            styleType="primary"
            onClick={() => window.location.href = "/trade/trade-summary"}
          />
        </div>
        <div className={styles["itemFoot__buttons"]}>
          {props.status === "pending" && (
            <CustomButton size="sm" title="View Offer" styleType="solid" />
          )}
          {props.status === "transit" && (
            <CustomButton
              size="sm"
              title="Track Delivery"
              styleType="solid"
              onClick={() => window.location.href = "/trade/delivery-tracking"}
            />
          )}
          {props.status === "completed" && (
            <CustomButton
              size="sm"
              iconPos="left"
              title="Something Went Wrong?"
              styleType="solid"
              icon={flagIcon}
              onClick={() => alert("Reporting issue functionality coming soon...")}
            />
          )}
          {props.status === "delivered" && (
            <>
              <CustomButton
                size="sm"
                title="Confirm Delivery"
                styleType="solid"
                onClick={() => window.location.href = "/trade/labels"}
              />
              <CustomButton
                size="sm"
                iconPos="left"
                title="Something Went Wrong?"
                styleType="solid"
                icon={flagIcon}
                onClick={() => alert("Reporting issue functionality coming soon...")}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
