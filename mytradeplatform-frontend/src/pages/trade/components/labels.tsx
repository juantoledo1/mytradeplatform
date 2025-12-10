import { checkTick, cubeIcon, infoIcon, uploadIcon, vaultIcon } from "@/base/SVG";
import { CustomButton } from "@/components/custom-button/custom-button";
import { apiClient } from "@/services/api/client";
import styles from "../trade.module.scss";

export default function Labels() {
  return (
    <section className={styles["labels"]}>
      <div className="auto__container">
        <div className={styles["labels__inner"]}>
          <div className={styles["labels__inner-title"]}>
            <h1>Shipping Labels</h1>
            <p>Choose how you'd like to handle shipping for this trade</p>
          </div>
          <div className={styles["labelsInfo"]}>
            {infoIcon}
            <p>Enjoy discounted USPS/UPS rates through MyTradePlatform.</p>
          </div>
          <div className={styles["labels__row"]}>
            <div className={styles["labelsCol"]}>
              <div className={styles["labelsCol__top"]}>
                <div className={styles["labelsCol__icon"]}>{cubeIcon}</div>
                <div className={styles["labelsCol__title"]}>
                  <h3>Buy Label via MyTradePlatform</h3>
                  <p>Get discounted shipping rates</p>
                </div>
              </div>
              <ul>
                <li>Discounted USPS & UPS rates</li>
                <li>Automatic tracking integration</li>
                <li>Print-ready labels</li>
                <li>Package protection available</li>
              </ul>
              <div className={styles["labelsCol__foot"]}>
                <CustomButton
                  title="Buy Label via MyTradePlatform"
                  styleType="primary"
                  onClick={async () => {
                    // Lógica para comprar etiqueta usando la API de shipping
                    try {
                      const response = await apiClient.post('/api/shipping/rates', {
                        fromAddress: {
                          name: 'User Name',
                          street1: '123 Main St',
                          city: 'City',
                          state: 'ST',
                          zip: '12345',
                          country: 'US'
                        },
                        toAddress: {
                          name: 'Recipient Name',
                          street1: '456 Trade St',
                          city: 'Trade City',
                          state: 'ST',
                          zip: '67890',
                          country: 'US'
                        },
                        dimensions: {
                          length: 10,
                          width: 8,
                          height: 6,
                          weight: 2
                        }
                      });
                      
                      if (response.status === 200) {
                        const rates = response.data;
                        console.log('Shipping rates:', rates);
                        // Aquí iría la lógica para seleccionar y comprar la etiqueta
                        alert('Shipping rates retrieved successfully. Select a rate to purchase label.');
                      } else {
                        console.error('Error getting shipping rates');
                      }
                    } catch (error) {
                      console.error('Error in shipping rates request:', error);
                      alert('Error getting shipping rates. Please try again.');
                    }
                  }}
                />
              </div>
            </div>
            <div className={styles["labelsCol"]}>
              <div className={styles["labelsCol__top"]}>
                <div className={styles["labelsCol__icon"]}>{uploadIcon}</div>
                <div className={styles["labelsCol__title"]}>
                  <h3>Upload My Own Label</h3>
                  <p>Use your own shipping service</p>
                </div>
              </div>
              <ul>
                <li>Use your preferred carrier</li>
                <li>Enter tracking manually</li>
                <li>Manage your own shipping costs</li>
                <li>Full control over service level</li>
              </ul>
              <div className={styles["labelsCol__foot"]}>
                <CustomButton 
                  title="Upload My Own Label" 
                  styleType="secondary" 
                  onClick={async () => {
                    // Mostrar diálogo para subir archivo de etiqueta
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.pdf,.png,.jpg,.jpeg';
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        console.log('File selected:', file.name);
                        // Lógica para subir la etiqueta personalizada usando la API
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          // Aquí se haría la llamada a la API para subir la etiqueta
                          // const response = await apiClient.post('/api/shipping/upload-label', formData, {
                          //   headers: {
                          //     'Content-Type': 'multipart/form-data'
                          //   }
                          // });
                          alert(`File ${file.name} uploaded successfully.`);
                        } catch (error) {
                          console.error('Error uploading file:', error);
                          alert(`Error uploading file ${file.name}. Please try again.`);
                        }
                      }
                    };
                    input.click();
                  }} 
                />
              </div>
            </div>
          </div>
          <div className={styles["labelsContent"]}>
            <div className={styles["labelsContent__title"]}>
              <h3> {vaultIcon} Package Protection (Vault Trades Only)</h3>
              <p>Protect your shipment against loss or damage</p>
            </div>
            <label className={styles["check"]}>
              <div className={styles["check__box"]}>
                <input type="checkbox" />
                <span>{checkTick}</span>
              </div>
              <p>Add package protection for $2.99</p>
            </label>
            <p>
              Covers up to $500 in case of loss, theft, or damage during
              shipping. Only available for Vault trades with escrow protection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
