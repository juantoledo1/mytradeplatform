import { Navigate, Route, Routes } from "react-router-dom";
import styles from "./auth.module.scss";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";

export default function Auth() {
  return (
    <>
      <section className={styles["auth"]}>
        <div className={styles["auth__inner"]}>
          <Routes>
            <Route path="" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="*" element={<Navigate to="" replace={true} />} />
          </Routes>
        </div>
      </section>
    </>
  );
}
