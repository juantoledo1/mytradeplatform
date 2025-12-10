import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError, type AxiosError } from "axios";
import { apiClient } from "@/services/api/client";
import BarLoader from "react-spinners/BarLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { logIcon, padlockIcon, userIcon } from "../../base/SVG";
import styles from "../auth.module.scss";
import { CustomButton } from "../../components/custom-button/custom-button";
import { FormField } from "../../components/form-field/form-field";
import { PassField } from "../../components/pass-field/pass-field";

import { AuthResponseDto, UserProfile } from "@/types";

interface ApiErrorResponse {
  message?: string;
}

interface SignInProps {}

export default function SignIn({}: SignInProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (showErrors && event.target.value.trim()) {
      setShowErrors(false);
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (showErrors && event.target.value.trim()) {
      setShowErrors(false);
    }
  };

  const handleError = (error: AxiosError<ApiErrorResponse> | Error) => {
    let message = "Error occurred. Please try again later.";
    
    if (isAxiosError(error)) {
      // Si es un error 401 es un problema de credenciales
      if (error.response?.status === 401) {
        message = "Invalid email or password. Please try again.";
      } else if (error.response?.status === 400) {
        // Para errores 400, puede haber más detalles
        message = error.response?.data?.message || "Invalid credentials format.";
      } else {
        message = error.response?.data?.message || message;
      }
    } else {
      message = (error as Error).message || message;
    }

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

  const login = async (userEmail: string, userPassword: string) => {
    // Validar si hay datos
    if (!userEmail.trim() || !userPassword.trim()) {
      setShowErrors(true);
      // Mostrar toast de error
      toast.error("Please enter your credentials", {
        position: "top-right",
        autoClose: 2000,
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
    setShowErrors(false);

    try {
      const response = await apiClient.post<AuthResponseDto>(
        "/api/auth/login/",
        {
          email: userEmail,
          password: userPassword,
        }
      );

      const isLoginSuccessful =
        response.status === 200 && response.data.tokens?.accessToken;

      if (isLoginSuccessful) {
        // Guardar token
        localStorage.setItem('accessToken', response.data.tokens.accessToken);

        // Guardar datos del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Forzar recarga de la página para que se actualice el estado de usuario
        if (window.location && typeof window !== 'undefined') {
          window.location.href = "/browse";
        } else {
          navigate("/browse");
        }
        return;
      }

      toast.error(response.data?.message ?? "Unable to sign in", {
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

  return (
    <div className={styles.form}>
      <div className={styles.form__title}>
        <div className={styles.form__icon}>{logIcon}</div>
        <h4>Welcome Back</h4>
        <p>Sign in to your MyTradePlatform account</p>
      </div>
      <div className={styles.form__col}>
        <label className={styles.input__outer}>
          <p>Email Address</p>
          <FormField
            placeholder="name@example.com"
            type="email"
            icon={userIcon}
            onChange={handleEmailChange}
            value={email}
            required
            error={showErrors && !email.trim()}
          />
        </label>
        <div className={styles.input__outer}>
          <p>Password</p>
          <PassField
            placeholder="Enter your password"
            icon={padlockIcon}
            onChange={handlePasswordChange}
            value={password}
            required
            error={showErrors && !password.trim()}
          />
        </div>
      </div>
      <div className={styles.form__forgot}>
        <Link to="#">Forgot your password?</Link>
      </div>
      <div className={styles.form__button}>
        <CustomButton
          onClick={() => login(email, password)}
          title="Sign In"
          styleType="primary"
          disabled={isSubmitting}
          icon={isSubmitting ? <BarLoader color="#fff" width={50} /> : null}
        />
      </div>
      <div className={styles.form__foot}>
        <div className={styles.form__line}>
          <p>Don't have an account?</p>
        </div>
        <Link to="/auth/sign-up">Create your account</Link>
      </div>
    </div>
  );
}
