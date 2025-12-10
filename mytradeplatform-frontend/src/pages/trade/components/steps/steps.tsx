import { useEffect, useState } from "react";
import { CustomButton } from "@/components/custom-button/custom-button";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import Step3 from "./components/step3";
import Step4 from "./components/step4";
import Step5 from "./components/step5";
import Step6 from "./components/step6";
import styles from "./steps.module.scss";
import { arrowLeft, chevronRight } from "@/base/SVG";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// third party
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// project import


export default function Steps() {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  
  const [categoryList, setCategoryList] = useState([]);

  const [title, setTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [description, setDescription] = useState("");
  const [estimatedValue, setEstimatedValue] = useState("");
  
  const [shippingWeight, setShippingWeight] = useState("");
  const [shippingDimensions, setShippingDimensions] = useState({
    length: "",
    width: "",
    height: "",
  });

  const [images, setImages] = useState([]);

  const stepConfig = [
    {
      title: "Choose Trade Type",
      buttonText: "Continue",
      showStepNumber: true,
    },
    { title: "Item Details", buttonText: "Continue", showStepNumber: true },
    {
      title: "Step 3 of 6 – Your Information",
      buttonText: "Continue",
      showStepNumber: false,
    },
    {
      title: "Match & Review Trade",
      buttonText: "Continue to Next Step",
      showStepNumber: true,
    },
    {
      title: "Step 5 of 6 – Payment & Shipping Setup",
      buttonText: "Continue to Final Review",
      showStepNumber: false,
    },
    {
      title: "Step 6 of 6 – Final Review & Submit",
      buttonText: "Submit Trade",
      buttonIcon: chevronRight,
      showStepNumber: false,
    },
  ];

  const baseBackgroundSteps = [2, 3];

  const progressPercentage = (currentStep / stepConfig.length) * 100;

  const handleNextStep = () => {
    if (currentStep < stepConfig.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 6) {
      navigate("/trade/summary");
    } else {
      console.log("All steps completed!");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepsClass = `${styles["steps"]} ${
    baseBackgroundSteps.includes(currentStep) ? styles["base"] : ""
  }`;

  const currentStepConfig = stepConfig[currentStep - 1];
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const getCategories = () => {
    apiClient.get('/api/trade/interests/')
      .then((response) => {
        const categories = response.data.results.map((category) => ({
          id: category.id,
          value: /*category.icon + " " + */category.name,
        }));
        setCategoryList((prevCategories) => [...prevCategories, ...categories]);

      })
      .catch((error) => {
        toast.error(error, {
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
  }

  useEffect(() => {

    if (categoryList.length > 1) {
      // If categories are already loaded, no need to fetch again
      return;
    }

    getCategories();

  }, []);

  return (
    <section className={stepsClass}>
      <div className="auto__container">
        <div className={styles["steps__inner"]}>
          <div className={styles["progress"]}>
            <div className={styles["progress__row"]}>
              <h1>{currentStepConfig.title}</h1>
              {currentStepConfig.showStepNumber && (
                <p>
                  Step {currentStep} of {stepConfig.length}
                </p>
              )}
            </div>
            <div className={styles["progress__bar"]}>
              <span style={{ width: `${progressPercentage}%` }}></span>
            </div>
          </div>

          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Step1 />
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Step2
                categoryList={categoryList}
                
                title={title}
                setTitle={setTitle}

                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                
                description={description}
                setDescription={setDescription}
                
                estimatedValue={estimatedValue}
                setEstimatedValue={setEstimatedValue}
                
                shippingWeight={shippingWeight}
                setShippingWeight={setShippingWeight}
                
                shippingDimensions={shippingDimensions}
                setShippingDimensions={setShippingDimensions}
                
                images={images}
                setImages={setImages}
              />
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Step3 />
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Step4 />
            </motion.div>
          )}
          {currentStep === 5 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Step5 />
            </motion.div>
          )}
          {currentStep === 6 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <Step6 />
            </motion.div>
          )}

          <div className={styles["steps__inner-foot"]}>
            <div className={styles["steps__back"]}>
              {currentStep > 1 && (
                <CustomButton
                  iconPos="left"
                  icon={arrowLeft}
                  title="Back"
                  styleType="solid"
                  onClick={handlePreviousStep}
                />
              )}
            </div>

            <CustomButton
              iconPos="right"
              icon={currentStepConfig.buttonIcon}
              title={currentStepConfig.buttonText}
              styleType="primary"
              onClick={handleNextStep}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
