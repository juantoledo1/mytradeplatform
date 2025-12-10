import { useEffect, useState } from "react";
import { energyIcon, vaultIcon } from "../../../base/SVG";
import classNames from "classnames";
import { filterIcon, searchIcon, starIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import styles from "../browse.module.scss";
import { Link } from "react-router-dom";
import CustomSelect from "@/components/custom-select/custom-select";

// third party
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// project import
import { SERVER_URL } from "../../../config";

export default function BrowseItems() {
  const [categoryList, setCategoryList] = useState([
    {
      id: "0",
      value: "All Interests",
    },
  ]);

  const orderByList = [
    {
      id: "0",
      value: "Order By Relevance",
    },
    {
      id: "price:desc",
      value: "Order By Price (High to Low)",
    },
    {
      id: "price:asc",
      value: "Order By Price (Low to High)",
    },
    {
      id: "createdAt:desc",
      value: "Order By Newest",
    },
    {
      id: "createdAt:asc",
      value: "Order By Oldest",
    },
  ];

  const tradeTypeList = [
    {
      id: "0",
      value: "All Trade Types",
    },
    {
      id: "1",
      value: "Only Quick Trades",
    },
    {
      id: "2",
      value: "Only Vault Trades",
    },
  ];

  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [itemsPerPage] = useState(50);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryList[0]);
  const [selectedTradeType, setSelectedTradeType] = useState(tradeTypeList[0]);
  const [selectedOrderBy, setSelectedOrderBy] = useState(orderByList[0]);
  const [isMounted, setIsMounted] = useState(false);

  const [loadingItems, setLoadingItems] = useState(false);

  const getItems = async (page) => {
    setLoadingItems(true);

    try {
      const response = await fetch(
        `${SERVER_URL}/api/trade/items/?page=${page}&limit=${itemsPerPage}&search=${searchQuery}&category=${selectedCategory.id}&trade_type=${selectedTradeType.id}&order_by=${selectedOrderBy.id}`
      );
      const data = await response.json();
      const { results } = data;
      
      setItems((prevItems) => [...prevItems, ...results]);
      if (results.length < itemsPerPage) {
        setAllItemsLoaded(true);
      }

      setLoaded(true);
      setLoadingItems(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error("Error loading items", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setLoadingItems(false);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/trade/interests/`);
      const data = await response.json();
      const categories = data.map((category) => ({
        id: category.id,
        value: `${category.icon || ""} ${category.name}`,
      }));

      setCategoryList((prev) => [...prev, ...categories]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error("Error loading categories", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (categoryList.length > 1) {
      // If categories are already loaded, no need to fetch again
      return;
    }

    getCategories();
  }, []);

  useEffect(() => {
    getItems(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (categoryList.length < 2) {
      // If categories are not loaded yet, do not fetch items
      return;
    } // Reset items and pagination when search query or filters change

    const delayDebounceFn = setTimeout(() => {
      setLoaded(false);
      setItems([]);
      setAllItemsLoaded(false); // Wait for the user to finish typing before fetching items

      if (currentPage > 1) {
        setCurrentPage(1); // Reset to first page and trigger new fetch
      } else {
        if (!isMounted) return; // Prevent fetching on initial mount;
        getItems(1); // Fetch items for the first page
      }
    }, 1000); // Adjust the delay as needed
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory, selectedTradeType, selectedOrderBy]);

  // Handle scroll event to load more items
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight * 0.6 &&
        !allItemsLoaded
      ) {
        // Load more items when scrolled to the bottom
        if (loadingItems) return; // Prevent multiple requests
        if (items.length === 0) return; // Don't load more if no items are loaded

        // Wait for the next page to load before incrementing
        const delayDebounceFn = setTimeout(() => {
          setCurrentPage((prevPage) => prevPage + 1);
        }, 1000); // Adjust the delay as needed
        return () => clearTimeout(delayDebounceFn);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [allItemsLoaded]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section className={styles["browse"]}>
      <div className="auto__container">
        <div className={styles["browse__inner"]}>
          <div className={styles["browse__inner-title"]}>
            <h3>Browse Items</h3>
            <p>Discover items worth trading from trusted traders</p>
          </div>
          <div className={styles["filter"]}>
            <div className={styles["filter__row"]}>
              <div className={styles["filter__search"]}>
                <span>{searchIcon}</span>
                <input
                  type="search"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className={styles["filter__select"]}>
                <CustomSelect
                  list={categoryList}
                  selected={selectedCategory}
                  onChange={setSelectedCategory as any}
                />
              </div>
              <div className={styles["filter__select"]}>
                <CustomSelect
                  list={tradeTypeList}
                  selected={selectedTradeType}
                  onChange={setSelectedTradeType as any}
                />
              </div>
              <div className={styles["filter__select"]}>
                <CustomSelect
                  list={orderByList}
                  selected={selectedOrderBy}
                  onChange={setSelectedOrderBy as any}
                />
              </div>
            </div>
          </div>
          <div className={styles["browse__inner-info"]}>
            <p>Showing {items.length} items</p>
            <button type="button" className={styles["filterBtn"]} onClick={() => alert("Advanced filters functionality coming soon...")}>
              <span>{filterIcon}</span>
              More Filters
            </button>
          </div>
          <div className={styles["browse__inner-row"]}>
            {!loaded && (
              <BarLoader
                color="#209999"
                cssOverride={{
                  display: "block",
                  margin: "10vh auto",
                  borderColor: "red",
                }}
              />
            )}
            {items.length === 0 && loaded && (
              <div className={styles["browse__no-items"]}>
                <h4>No items found</h4>
                <p>Try changing your search criteria or filters.</p>
              </div>
            )}

            {items.map((item, index) => {
              return <BrowseItem {...item} key={index} />;
            })}
          </div>
          <div className={styles["browse__inner-foot"]}>
            {/* attention */}
            {allItemsLoaded && items.length > 0 ? (
              <div className={styles["browse__inner-foot-warning"]}>
                <p>All items loaded. No more items to load.</p>
              </div>
            ) : (
              <CustomButton
                title="Load More Items"
                styleType="secondary"
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const BrowseItem = (props) => {
  return (
    <Link
      to={"/browse/single-item?id=" + props.id}
      className={styles["browseItem"]}
    >
      <div className={styles["browseItem__image"]}>
        <img src={props.images?.[0]?.url || "/placeholder.png"} alt="item" />
      </div>
      <div className={styles["browseItem__content"]}>
        <div className={styles["browseItem__top"]}>
          <h5>{props.name}</h5>
          {props.trade_type !== undefined && (
            <div
              className={classNames(styles["browseItem__status"], {
                [styles.quick]: props.trade_type === "Quick",
              })}
            >
              {props.trade_type === "Quick" ? (
                <span>{energyIcon}</span>
              ) : (
                <span>{vaultIcon}</span>
              )}
              {props.trade_type}
            </div>
          )}
        </div>
        <div className={styles["browseItem__text"]}>
          <p>{props.description}</p>
        </div>
        <div className={styles["browseItem__row"]}>
          <div className={styles["browseItem__price"]}>${props.price}</div>
          {Array.isArray(props.interests) &&
            props.interests.map((tag) => (
              <div key={tag.id} className={styles["browseItem__field"]}>
                <span key={tag.id}>{tag.name.trim()}</span>
              </div>
            ))}
        </div>
        <div className={styles["browseItem__row"]}>
          <div className={styles["browseItem__profile"]}>
            <span>
            <img
              src={
                props.owner?.profile?.avatar || 
                `${SERVER_URL}/profiles/default.png`
              }
              alt="avatar"
            />
          </span>
          <p>{props.owner?.username || 'Unknown'}</p>
          </div>
          <div className={styles["browseItem__rate"]}>
            <span>{starIcon}</span>
            <b>{props.owner?.profile?.tradingRating || 0}</b>
            <p>({props.owner?.profile?.totalTrades || 0} Trades)</p>
          </div>
        </div>
      </div>
    </Link>
  );
};
