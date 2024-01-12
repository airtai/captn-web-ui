import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LoginForm } from "@wasp/auth/forms/Login";
import { AuthWrapper } from "./authWrapper";
import useAuth from "@wasp/auth/useAuth";
import { appearance } from "../appearance";

export default function Login() {
  const history = useHistory();

  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
      history.push("/");
    }
  }, [user, history]);

  return (
    <AuthWrapper>
      <div className="login-form-wrapper">
        <LoginForm appearance={appearance} />
        <br />
        <span className="text-sm font-medium text-gray-900">
          Don't have an account yet?{" "}
          <Link to="/signup" className="underline">
            go to signup
          </Link>
          .
        </span>
        <br />
        <span className="text-sm font-medium text-gray-900">
          Forgot your password?{" "}
          <Link to="/request-password-reset" className="underline">
            reset it
          </Link>
          .
        </span>
      </div>
    </AuthWrapper>
  );
}
