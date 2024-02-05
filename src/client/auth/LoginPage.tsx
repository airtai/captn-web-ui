import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";

import useAuth from "@wasp/auth/useAuth";
import Auth from "./Auth";
import { type CustomizationOptions, State } from "@wasp/auth/forms/types";
import imgUrl from "../static/captn-logo-large.png";

import { AuthWrapper } from "./authWrapper";
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
        <LoginForm appearance={appearance} logo={imgUrl} />
      </div>
    </AuthWrapper>
  );
}

export function LoginForm({
  appearance,
  logo,
  socialLayout,
}: CustomizationOptions) {
  return (
    <Auth
      appearance={appearance}
      logo={logo}
      socialLayout={socialLayout}
      state={State.Login}
    />
  );
}
