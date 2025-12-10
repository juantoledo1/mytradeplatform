import { useEffect, useState } from "react";
import classNames from "classnames";
import {
  cameraIcon,
  cubeIcon,
  infoIcon,
  truckIcon,
  uploadIcon,
} from "@/base/SVG";
import { FormField } from "@/components/form-field/form-field";
import { TextField } from "@/components/text-field/text-field";
import styles from "../steps.module.scss";
import CustomSelect from "@/components/custom-select/custom-select";

import { SERVER_URL } from "../../../../../config";

// third party
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// project import



export default function Step2({
  categoryList,

  title,
  setTitle,

  selectedTags,
  setSelectedTags,

  description,
  setDescription,

  estimatedValue,
  setEstimatedValue,

  shippingWeight,
  setShippingWeight,

  shippingDimensions,
  setShippingDimensions,

  images,
  setImages
}) {
  const [search, setSearch] = useState("");

  console.log("Category List:", categoryList);

  // Filter tags by search
  const filteredTags = categoryList.filter(tag =>
    tag.value.toLowerCase().includes(search.toLowerCase())
  );

  const handleTagSelect = (tag) => {
    if (
      selectedTags.find(t => t.id === tag.id) ||
      selectedTags.length >= 3
    ) return;
    setSelectedTags([...selectedTags, tag]);
  };

  const handleTagRemove = (tagId) => {
    setSelectedTags(selectedTags.filter(t => t.id !== tagId));
  };

  const [uploading, setUploading] = useState(false);
  const uploadImages = (event) => {
    setUploading(true);

    const files = Array.from(event.target.files);

    // Check if these images + the images that already exist will be more then 5
    if (files.length + images.length > 5) {
      toast.error("You can only upload a maximum of 5 images. Please select fewer images.");
      setUploading(false);
      return;
    }

    // Make a post to /api/items/images
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });

    apiClient.post("/api/trade/items/images", formData)
    .then(response => {
      setImages([...images, ...response.data.images]);

      setUploading(false);
    })
    .catch(error => {
      console.error("Error uploading images:", error);
      setUploading(false);
    });
  };

  // Helper for drag-and-drop
  const [draggedIndex, setDraggedIndex] = useState(null);

  const handleImageRemove = (indexToRemove) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedImages = [...images];
    const [draggedImage] = updatedImages.splice(draggedIndex, 1);
    updatedImages.splice(index, 0, draggedImage);
    setImages(updatedImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={styles["details"]}>
      <div className={styles["details__title"]}>
        <span>{cubeIcon}</span>
        <h5>Item Information</h5>
      </div>
      <div className={styles["details__row"]}>
        <label className={styles["input__outer"]}>
          <p>Item Title</p>
          <FormField
            placeholder="Name of the item you're trading"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </label>
        <label className={styles["input__outer"]}>
          <p>Select Tags (up to 3)</p>
          <FormField
            placeholder="Search tags..."
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            disabled={selectedTags.length >= 3}
          />
          <div
            style={{
              maxHeight: "120px",
              overflowY: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              background: "#fff",
              position: "relative",
              zIndex: 2,
              marginTop: "12px",
            }}
          >
            {filteredTags
              .filter(tag => !selectedTags.find(t => t.id === tag.id))
              .slice(0, 20) // show top 20 results
              .map(tag => (
                <div
                  key={tag.id}
                  style={{
                    padding: "6px 8px",
                    cursor: selectedTags.length < 3 ? "pointer" : "not-allowed",
                    color: selectedTags.length < 3 ? "#222" : "#aaa",
                  }}
                  onClick={() => selectedTags.length < 3 && handleTagSelect(tag)}
                >
                  {tag.value}
                </div>
              ))}
            {filteredTags.filter(tag => !selectedTags.find(t => t.id === tag.id)).length === 0 && (
              <div style={{ padding: "6px 8px", color: "#aaa" }}>
                No tags found
              </div>
            )}
          </div>
          
        </label>
        <div style={{ marginBottom: "8px" }}>
          {selectedTags.map(tag => (
            <span
              key={tag.id}
              style={{
                display: "inline-block",
                background: "#eee",
                borderRadius: "12px",
                padding: "2px 8px",
                marginRight: "4px",
                marginBottom: "4px",
              }}
            >
              {tag.value}
              <button
                type="button"
                style={{
                  marginLeft: "4px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#888",
                }}
                onClick={() => handleTagRemove(tag.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <label className={classNames(styles["input__outer"], styles["big"])}>
          <p>Item Description</p>
          <TextField
            row={4}
            placeholder="Describe the item you're trading. Be as detailed as possible!"
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </label>
        <label className={classNames(styles["input__outer"], styles["big"])}>
          <p>Estimated Value</p>
          <FormField
            placeholder="What's it worth?"
            type="text"
            value={estimatedValue}
            onChange={e => setEstimatedValue(e.target.value)}
          />
        </label>
      </div>
      <div className={styles["details__title"]}>
        <span>{truckIcon}</span>
        <h5>Shipping Details </h5>
        <p>(Optional)</p>
        <button type="button" onClick={(e) => {
          e.preventDefault();
          toast.info("Shipping details help: Please provide accurate dimensions and weight for your item to ensure proper shipping calculations.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        }}>
          {infoIcon}
        </button>
      </div>
      <div className={styles["details__row"]}>
        <label className={styles["input__outer"]}>
          <p>Shipping Weight (lbs)</p>
          <FormField
            placeholder="Weight of the package"
            type="text"
            value={shippingWeight}
            onChange={e => setShippingWeight(e.target.value)}
          />
        </label>
        <label className={styles["input__outer"]}>
          <p>Shipping Dimensions (in)</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <FormField
              placeholder="Length"
              type="text"
              style={{ width: "60px" }}
              value={shippingDimensions.length}
              onChange={e => setShippingDimensions({ ...shippingDimensions, length: e.target.value })}
            />{" "}
            <p
              style={{
                lineHeight: "20px",
                fontSize: "14px",
                margin: "11px 0 0 0",
                fontWeight: "400",
                color: "var(--gray)",
              }}
            >
              x
            </p>
            <FormField
              placeholder="Width"
              type="text"
              style={{ width: "60px" }}
              value={shippingDimensions.width}
              onChange={e => setShippingDimensions({ ...shippingDimensions, width: e.target.value })}
            />{" "}
            <p>x</p>
            <FormField
              placeholder="Height"
              type="text"
              style={{ width: "60px" }}
              value={shippingDimensions.height}
              onChange={e => setShippingDimensions({ ...shippingDimensions, height: e.target.value })}
            />
          </div>
        </label>
      </div>
      <p>
        Please input accurate package dimensions and weight. If the carrier makes a shipping adjustment, your MyTradePlatform wallet will be charged the additional fee.
        <br />
        <br />
        MyTradePlatform will file a dispute for any carrier adjustments that may be wrong or accidental.
      </p>
      <br />
      <br />
      <div className={styles["details__title"]}>
        <span>{cameraIcon}</span>
        <h5>Upload Images</h5>
      </div>
      {
        images.length > 0 && (
          <div className={styles["detailsUpload__preview"]}>
            {images.map((image, index) => (
              <div
                key={index}
                className={styles["detailsUpload__preview__image"]}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={e => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  opacity: draggedIndex === index ? 0.5 : 1,
                  cursor: "move",
                  position: "relative"
                }}
              >
                <img
                  src={SERVER_URL + "/item-image/" + image}
                  alt={`Uploaded preview ${index + 1}`}
                  className={styles["image"]}
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    background: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: 24,
                    height: 24,
                    cursor: "pointer",
                    boxShadow: "0 0 4px rgba(0,0,0,0.1)",
                    fontWeight: "bold",
                    color: "#888"
                  }}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )
      }
      {
        uploading ? (
          <div className={styles["detailsUpload__uploading"]}>
            <p>Uploading images...</p>
            <BarLoader />
          </div>
        ) : images.length < 5 && (
          <div className={styles["detailsUpload"]}>
            <div className={styles["detailsUpload__title"]}>
              <h6>
                <b>Upload Images</b> (Up to 5)
              </h6>
            </div>
            <div className={styles["detailsUpload__main"]}>
              <input
                type="file"
                onChange={uploadImages}
                multiple
                accept="image/*"
              />
              <span>{uploadIcon}</span>
              <h6>
                <b>Click to upload</b>
                  <b></b> or drag and drop
              </h6>
              <p>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
          </div>
        )
      }
    </div>
  );
}
