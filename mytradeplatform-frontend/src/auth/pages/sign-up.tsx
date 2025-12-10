import type { ChangeEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError, type AxiosError } from "axios";
import { apiClient } from "@/services/api/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  accountIcon,
  checkTick,
  mailIcon,
  padlockIcon,
  userIcon,
} from "@/base/SVG";
import styles from "../auth.module.scss";
import { CustomButton } from "@/components/custom-button/custom-button";
import { FormField } from "@/components/form-field/form-field";
import { PassField } from "@/components/pass-field/pass-field";


export interface RegisterResponse {
    user:    User;
    tokens:  Tokens;
    message: string;
}

export interface Tokens {
    accessToken:  string;
    refreshToken: string;
}

export interface User {
    id:               string;
    email:            string;
    username:         string;
    firstName:        string;
    lastName:         string;
    password:         string;
    isActive:         boolean;
    agreesToTerms:    boolean;
    termsAgreedAt:    Date;
    termsVersion:     string;
    profileCompleted: boolean;
    dateJoined:       Date;
    lastLogin:        null;
    createdAt:        Date;
    updatedAt:        Date;
    profile:          Profile;
    fullName:         string;
}

export interface Profile {
    id:                 string;
    userId:             string;
    phoneNumber:        null;
    dateOfBirth:        null;
    bio:                null;
    avatar:             null;
    emailNotifications: boolean;
    marketingEmails:    boolean;
    city:               null;
    state:              null;
    country:            string;
    traderSince:        Date;
    tradingRating:      string;
    totalTrades:        number;
    successfulTrades:   number;
    isVerifiedTrader:   boolean;
    traderTier:         string;
    specialties:        null;
    createdAt:          Date;
    updatedAt:          Date;
    interests:          any[];
}


interface ApiErrorResponse {
  message?: string;
}

interface SignUpProps {}

export default function SignUp({}: SignUpProps) {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password validation functions
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password); // Match backend requirements
  const isMinLength = password.length >= 8;


  const handleError = (error: AxiosError<ApiErrorResponse> | Error) => {
    const message =
      isAxiosError(error)
        ? error.response?.data?.message ?? "Error occurred. Please try again later."
        : "Error occurred. Please try again later.";

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

  const extractUsernameFromEmail = (emailValue: string): string => {
    if (emailValue && emailValue.includes("@")) {
      return emailValue.split("@")[0];
    }
    return emailValue;
  };

  const register = async () => {
    // Validar términos y requisitos de contraseña
    if (!agreesToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Validar requisitos de contraseña
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar || !isMinLength) {
      toast.error("Password does not meet requirements. Please check the password requirements.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    // Validar que coincidan las contraseñas
    if (password !== passwordConfirm) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    setIsSubmitting(true);

    const username = extractUsernameFromEmail(email);
    document.cookie = `emailForSignUp=${email};max-age=2592000;path=/`;

    try {
      const response = await apiClient.post<RegisterResponse>(
        "/api/auth/register/",
        {
          username,
          firstName,
          lastName,
          email,
          password,
          passwordConfirm,
          agreesToTerms: agreesToTerms ? 1 : 0,
        }
      );

      if (response.status === 201 && response.data.tokens) {
        // Guardar token
        localStorage.setItem('accessToken', response.data.tokens.accessToken);

        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Mostrar mensaje de éxito y evitar mostrar el formulario
        setIsSuccess(true);

        // Esperar un momento antes de redirigir
        setTimeout(() => {
          // Forzar recarga de la página para que se actualice el estado de usuario
          if (window.location && typeof window !== 'undefined') {
            window.location.href = "/browse";
          } else {
            navigate("/browse");
          }
        }, 5000);

        return;
      }

      toast.error(response.data.message ?? "Unable to create account", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      handleError(error as AxiosError<ApiErrorResponse>);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAgreesToTerms(event.target.checked);
  };

  if (isSuccess) {
    return (
      <div className={styles.form}>
        <div className={styles.form__title}>
          <div className={styles.form__icon}>{accountIcon}</div>
          <h4>Account Created Successfully! 🎉</h4>
          <p>Your account has been created successfully.</p>
        </div>
        <div className={styles.success__message}>
          <div className={styles.success__icon}>✅</div>
          <h3>Welcome to MyTradePlatform!</h3>
          <p>Please check your email to verify your account.</p>
          <p>You will be redirected to the login page in a few seconds...</p>
        </div>
        <div className={styles.form__foot}>
          <div className={styles.form__line}>
            <p>Already have an account?</p>
          </div>
          <Link to="/auth/">Sign in here</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.form}>
      <div className={styles.form__title}>
        <div className={styles.form__icon}>{accountIcon}</div>
        <h4>Create Account</h4>
        <p>Join MyTradePlatform and start trading today</p>
      </div>
      <div className={styles.form__col}>
        <label className={styles.input__outer}>
          <p>First Name</p>
          <FormField
            placeholder="John"
            type="text"
            icon={userIcon}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
          />
        </label>
        <label className={styles.input__outer}>
          <p>Last Name</p>
          <FormField
            placeholder="Doe"
            type="text"
            icon={userIcon}
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
          />
        </label>
        <label className={styles.input__outer}>
          <p>Email Address</p>
          <FormField
            placeholder="name@example.com"
            type="email"
            icon={mailIcon}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <div className={styles.input__outer}>
          <p>Password</p>
          <PassField
            placeholder="Create a strong password"
            icon={padlockIcon}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <div className={styles.passwordRequirements}>
            <p className={`${password && hasUpperCase ? styles.valid : ''}`}>
              {password && hasUpperCase ? '✓' : '•'} At least one uppercase letter (A-Z)
            </p>
            <p className={`${password && hasLowerCase ? styles.valid : ''}`}>
              {password && hasLowerCase ? '✓' : '•'} At least one lowercase letter (a-z)
            </p>
            <p className={`${password && hasNumber ? styles.valid : ''}`}>
              {password && hasNumber ? '✓' : '•'} At least one number (0-9)
            </p>
            <p className={`${password && hasSpecialChar ? styles.valid : ''}`}>
              {password && hasSpecialChar ? '✓' : '•'} At least one special character (@$!%*?&)
            </p>
            <p className={`${password && password.length >= 8 ? styles.valid : ''}`}>
              {password && password.length >= 8 ? '✓' : '•'} At least 8 characters long
            </p>
          </div>
        </div>
        <div className={styles.input__outer}>
          <p>Confirm Password</p>
          <PassField
            placeholder="Confirm your password"
            icon={padlockIcon}
            value={passwordConfirm}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            required
          />
        </div>
        <label className={styles.check}>
          <div className={styles.check__box}>
            <input type="checkbox" checked={agreesToTerms} onChange={handleCheckboxChange} />
            <span>{checkTick}</span>
          </div>
          <p>
            I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
        </label>
      </div>
      <div className={styles.form__button}>
        <CustomButton
          title="Create Account"
          styleType="primary"
          iconPos="left"
          icon={accountIcon}
          onClick={register}
          disabled={isSubmitting}
        />
      </div>
      <div className={styles.form__foot}>
        <div className={styles.form__line}>
          <p>Already have an account?</p>
        </div>
        <Link to="/auth/">Sign in here</Link>
      </div>
    </div>
  );
}

