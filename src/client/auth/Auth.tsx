import { useState, createContext, useEffect } from "react";
import { createTheme } from "@stitches/react";
import { styled } from "@wasp/stitches.config";
import { Link } from "react-router-dom";

import {
  type State,
  type CustomizationOptions,
  type ErrorMessage,
  type AdditionalSignupFields,
} from "@wasp/auth/forms/types";
import * as SocialIcons from "@wasp/auth/forms/internal/social/SocialIcons";
import { SocialButton } from "@wasp/auth/forms/internal/social/SocialButton";
import config from "@wasp/config";
import {
  MessageError,
  MessageSuccess,
} from "@wasp/auth/forms/internal/Message";

const logoStyle = {
  height: "6rem",
};

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const HeaderText = styled("h2", {
  fontSize: "1.875rem",
  fontWeight: "700",
  marginTop: "1.5rem",
});

const SocialAuth = styled("div", {
  marginTop: "1.5rem",
});

const SocialAuthLabel = styled("div", {
  fontWeight: "500",
  fontSize: "$sm",
});

const SocialAuthButtons = styled("div", {
  marginTop: "0.5rem",
  display: "flex",

  variants: {
    direction: {
      horizontal: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(48px, 1fr))",
      },
      vertical: {
        flexDirection: "column",
        margin: "8px 0",
      },
    },
    gap: {
      small: {
        gap: "4px",
      },
      medium: {
        gap: "8px",
      },
      large: {
        gap: "16px",
      },
    },
  },
});
const googleSignInUrl = `${config.apiUrl}/auth/google/login`;

export const AuthContext = createContext({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => {},
  setErrorMessage: (errorMessage: ErrorMessage | null) => {},
  setSuccessMessage: (successMessage: string | null) => {},
});

function Auth({
  state,
  appearance,
  logo,
  socialLayout = "horizontal",
  additionalSignupFields,
}: {
  state: State;
} & CustomizationOptions & {
    additionalSignupFields?: AdditionalSignupFields;
  }) {
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [tocChecked, setTocChecked] = useState(false);
  const [marketingEmailsChecked, setMarketingEmailsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const customTheme = createTheme(appearance ?? {});
  const isLogin = state === "login";
  const cta = isLogin ? "Log in" : "Sign up";

  const titles: Record<State, string> = {
    login: "Log in to your account",
    signup: "Create a new account",
    "forgot-password": "Forgot your password?",
    "reset-password": "Reset your password",
    "verify-email": "Email verification",
  };
  const title = titles[state];

  const socialButtonsDirection =
    socialLayout === "vertical" ? "vertical" : "horizontal";

  useEffect(() => {
    if (tocChecked && marketingEmailsChecked) {
      setErrorMessage(null);
    }
  }, [tocChecked, marketingEmailsChecked]);

  const handleTocChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTocChecked(event.target.checked);
  };

  const handleMarketingEmailsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarketingEmailsChecked(event.target.checked);
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (tocChecked && marketingEmailsChecked) {
      window.location.href = googleSignInUrl;
    } else {
      const err = {
        title:
          "To proceed, please ensure you have accepted the Terms & Conditions, Privacy Policy, and opted to receive marketing emails.",
        description: "",
      };
      setErrorMessage(err);
    }
  };

  return (
    <Container className={customTheme}>
      <div>
        {logo && (
          <img
            className="mt-10 mx-auto"
            style={logoStyle}
            src={logo}
            alt="Your Company"
          />
        )}
        {/* <HeaderText>{title}</HeaderText> */}
        <p className="mt-7 text-2xl">{title}</p>
        <div className="mt-3">
          <input
            type="checkbox"
            id="toc"
            checked={tocChecked}
            onChange={handleTocChange}
          />
          <label className="text-sm ml-2" htmlFor="toc">
            I agree to the{" "}
            <Link to="/toc" className="underline" target="_blank">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline" target="_blank">
              Privacy Policy
            </Link>
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            id="marketingEmails"
            checked={marketingEmailsChecked}
            onChange={handleMarketingEmailsChange}
          />
          <label className="text-sm ml-2" htmlFor="marketingEmails">
            I agree to receiving marketing emails
          </label>
        </div>
      </div>

      {errorMessage && (
        <MessageError className="text-sm">
          {errorMessage.title}
          {errorMessage.description && ": "}
          {errorMessage.description}
        </MessageError>
      )}
      <AuthContext.Provider
        value={{ isLoading, setIsLoading, setErrorMessage, setSuccessMessage }}
      >
        {(state === "login" || state === "signup") && (
          // <LoginSignupForm
          //   state={state}
          //   socialButtonsDirection={socialButtonsDirection}
          //   additionalSignupFields={additionalSignupFields}
          // />
          <SocialAuth>
            {/* <SocialAuthLabel>{cta} with</SocialAuthLabel> */}
            <SocialAuthButtons gap="large" direction={socialButtonsDirection}>
              <SocialButton href={googleSignInUrl} onClick={handleClick}>
                <SocialIcons.Google />{" "}
                {/* <p className="ml-1">Sign up with Google</p> */}
              </SocialButton>
            </SocialAuthButtons>
          </SocialAuth>
        )}
      </AuthContext.Provider>
    </Container>
  );
}

export default Auth;
