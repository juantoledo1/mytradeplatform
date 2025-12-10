import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { apiClient } from "@/services/api/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomButton } from "@/components/custom-button/custom-button";
import { FormField } from "@/components/form-field/form-field";
import { TextField } from "@/components/text-field/text-field";
import styles from "./edit.module.scss";
import type { UserProfile } from "@/types";
import { SERVER_URL } from "../../config";

interface ApiErrorResponse {
  message?: string;
}

export default function EditProfile() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Campos editables
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [specialties, setSpecialties] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("United States");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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

  const loadProfile = async () => {
    try {
      const response = await apiClient.get<UserProfile>("/api/auth/user/");
      setUserData(response.data);
      
      // Inicializar campos con los valores existentes
      setBio(response.data.bio || "");
      setLocation(response.data.location || "");
      setEmailNotifications(response.data.emailNotifications ?? true);
      setMarketingEmails(response.data.marketingEmails ?? false);
      setSpecialties(response.data.specialties || "");
      setCity(response.data.city || "");
      setState(response.data.state || "");
      setCountry(response.data.country || "United States");
      
      setLoading(false);
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
      setLoading(false);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        return;
      }

      setAvatar(file);

      // Crear previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    try {
      const response = await apiClient.post("/api/auth/upload-avatar", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        toast.success("Avatar updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      // Primero actualizar el perfil
      const response = await apiClient.put("/api/auth/profile", {
        bio,
        location,
        emailNotifications,
        marketingEmails,
        specialties,
        city,
        state,
        country
      });

      if (response.status === 200) {
        // Luego subir el avatar si hay uno nuevo
        if (avatar) {
          await uploadAvatar();
        }

        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading || !userData) {
    return (
      <div className={styles["editProfile"]}>
        <div className="auto__container">
          <h2>Loading Profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles["editProfile"]}>
      <div className="auto__container">
        <div className={styles["editProfile__inner"]}>
          <div className={styles["editProfile__title"]}>
            <h1 className="sm">Edit Profile</h1>
            <p>Update your profile information</p>
          </div>
          
          <form onSubmit={handleSubmit} className={styles["editProfile__form"]}>
            <div className={styles["editProfile__row"]}>
              <div className={styles["editProfile__col"]}>
                <h3>Profile Picture</h3>
                <div className={styles["editProfile__avatar"]}>
                  <div className={styles["editProfile__avatarPreview"]}>
                    <img 
                      src={avatarPreview || `${SERVER_URL}${userData.profile_pic || '/profiles/default.png'}`} 
                      alt="Avatar preview" 
                    />
                  </div>
                  <div className={styles["editProfile__avatarUpload"]}>
                    <input
                      type="file"
                      id="avatar-upload"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                    <CustomButton
                      type="button"
                      title="Choose Image"
                      styleType="solid"
                      onClick={() => document.getElementById('avatar-upload')?.click()}
                    />
                    {avatar && (
                      <CustomButton
                        type="button"
                        title="Remove"
                        styleType="delete"
                        onClick={() => {
                          setAvatar(null);
                          setAvatarPreview(null);
                        }}
                      />
                    )}
                  </div>
                </div>
                
                <label className={styles["input__outer"]}>
                  <p>Bio</p>
                  <TextField
                    rows={4}
                    placeholder="Tell us about yourself"
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </label>
                
                <label className={styles["input__outer"]}>
                  <p>Location</p>
                  <FormField
                    placeholder="Your location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </label>
                
                <label className={styles["input__outer"]}>
                  <p>Specialties</p>
                  <FormField
                    placeholder="Your trading specialties"
                    type="text"
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                  />
                </label>
                
                <label className={styles["input__outer"]}>
                  <p>City</p>
                  <FormField
                    placeholder="City"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </label>
                
                <label className={styles["input__outer"]}>
                  <p>State</p>
                  <FormField
                    placeholder="State"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </label>
                
                <label className={styles["input__outer"]}>
                  <p>Country</p>
                  <FormField
                    placeholder="Country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </label>
              </div>
              
              <div className={styles["editProfile__col"]}>
                <div className={styles["editProfile__settings"]}>
                  <h3>Notifications</h3>
                  
                  <label className={styles["check"]}>
                    <div className={styles["check__box"]}>
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                      />
                      <span></span>
                    </div>
                    <p>Email Notifications</p>
                  </label>
                  
                  <label className={styles["check"]}>
                    <div className={styles["check__box"]}>
                      <input
                        type="checkbox"
                        checked={marketingEmails}
                        onChange={(e) => setMarketingEmails(e.target.checked)}
                      />
                      <span></span>
                    </div>
                    <p>Marketing Emails</p>
                  </label>
                  
                  <div className={styles["editProfile__info"]}>
                    <h3>About {userData.username}</h3>
                    <p>Member since: {new Date(userData.create_ts!).toLocaleDateString()}</p>
                    <p>Email: {userData.email}</p>
                    <p>Username: {userData.username}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles["editProfile__foot"]}>
              <CustomButton
                type="submit"
                title={updating ? "Updating..." : "Save Changes"}
                styleType="primary"
                disabled={updating}
              />
              <CustomButton
                title="Cancel"
                styleType="solid"
                onClick={() => window.history.back()}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}