import { useContext, useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { styled } from '@wasp/stitches.config';
import config from '@wasp/config';

import { AuthContext } from './Auth';
import {
  Form,
  FormInput,
  FormItemGroup,
  FormLabel,
  FormError,
  FormTextarea,
  SubmitButton,
} from './Form';
import type {
  AdditionalSignupFields,
  AdditionalSignupField,
  AdditionalSignupFieldRenderFn,
  FormState,
} from '@wasp/auth/forms/types';
import * as SocialIcons from '@wasp/auth/forms/internal/social/SocialIcons';
import { SocialButton } from '@wasp/auth/forms/internal/social/SocialButton';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import {
//   MessageError,
//   MessageSuccess,
// } from '@wasp/auth/forms/internal/Message';
// import { useUsernameAndPassword } from '../usernameAndPassword/useUsernameAndPassword'

export const Message = styled('div', {
  padding: '0.5rem 0.75rem',
  borderRadius: '0.375rem',
  marginTop: '1rem',
  background: '$gray400',
});

export const MessageError = styled(Message, {
  background: '#eae4d9',
  color: '#003851',
});

const OrContinueWith = styled('div', {
  position: 'relative',
  marginTop: '1.5rem',
});

const OrContinueWithLineContainer = styled('div', {
  position: 'absolute',
  inset: '0px',
  display: 'flex',
  alignItems: 'center',
});

const OrContinueWithLine = styled('div', {
  width: '100%',
  borderTopWidth: '1px',
  borderColor: '$gray500',
});

const OrContinueWithTextContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  fontSize: '$sm',
});

const OrContinueWithText = styled('span', {
  backgroundColor: 'white',
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
});
const SocialAuth = styled('div', {
  marginTop: '1.5rem',
  marginBottom: '1.5rem',
});

const SocialAuthLabel = styled('div', {
  fontWeight: '500',
  fontSize: '$sm',
});

const SocialAuthButtons = styled('div', {
  marginTop: '0.5rem',
  display: 'flex',

  variants: {
    direction: {
      horizontal: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(48px, 1fr))',
      },
      vertical: {
        flexDirection: 'column',
        margin: '8px 0',
      },
    },
    gap: {
      small: {
        gap: '4px',
      },
      medium: {
        gap: '8px',
      },
      large: {
        gap: '16px',
      },
    },
  },
});
const googleSignInUrl = `${config.apiUrl}/auth/google/login`;

export type LoginSignupFormFields = {
  [key: string]: string;
};

export const LoginSignupForm = ({
  state,
  socialButtonsDirection = 'horizontal',
  additionalSignupFields,
  errorMessage,
}: {
  state: 'login' | 'signup';
  socialButtonsDirection?: 'horizontal' | 'vertical';
  additionalSignupFields?: AdditionalSignupFields;
  errorMessage?: any;
}) => {
  const { isLoading, setErrorMessage, setSuccessMessage, setIsLoading } =
    useContext(AuthContext);
  const isLogin = state === 'login';
  const cta = isLogin ? 'Log in' : 'Sign up';
  const history = useHistory();
  const [tocChecked, setTocChecked] = useState(false);
  const [marketingEmailsChecked, setMarketingEmailsChecked] = useState(false);
  //   const onErrorHandler = (error) => {
  //     setErrorMessage({
  //       title: error.message,
  //       description: error.data?.data?.message,
  //     });
  //   };
  const hookForm = useForm<LoginSignupFormFields>();
  const {
    register,
    formState: { errors },
    handleSubmit: hookFormHandleSubmit,
  } = hookForm;
  //   const { handleSubmit } = useUsernameAndPassword({
  //     isLogin,
  //     onError: onErrorHandler,
  //     onSuccess() {
  //       history.push('/chat');
  //     },
  //   });
  //   async function onSubmit(data) {
  //     setIsLoading(true);
  //     setErrorMessage(null);
  //     setSuccessMessage(null);
  //     try {
  //       await handleSubmit(data);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }

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
          'To proceed, please ensure you have accepted the Terms & Conditions, Privacy Policy, and opted to receive marketing emails.',
        description: '',
      };
      setErrorMessage(err);
    }
  };

  return (
    <>
      <div className='mt-3'>
        <input
          type='checkbox'
          id='toc'
          checked={tocChecked}
          onChange={handleTocChange}
        />
        <label className='text-sm ml-2' htmlFor='toc'>
          I agree to the{' '}
          <Link
            to='/toc'
            className='no-underline hover:underline'
            target='_blank'
          >
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link
            to='/privacy'
            className='no-underline hover:underline'
            target='_blank'
          >
            Privacy Policy
          </Link>
        </label>
      </div>
      <div>
        <input
          type='checkbox'
          id='marketingEmails'
          checked={marketingEmailsChecked}
          onChange={handleMarketingEmailsChange}
        />
        <label className='text-sm ml-2' htmlFor='marketingEmails'>
          I agree to receiving marketing emails
        </label>
      </div>
      {errorMessage && (
        <div className='text-sm'>
          <MessageError>
            {errorMessage.title}
            {errorMessage.description && ': '}
            {errorMessage.description}
          </MessageError>
        </div>
      )}
      <SocialAuth>
        <SocialAuthLabel>{cta} with</SocialAuthLabel>
        <SocialAuthButtons gap='large' direction={socialButtonsDirection}>
          <SocialButton href={googleSignInUrl} onClick={handleClick}>
            <SocialIcons.Google />
          </SocialButton>
        </SocialAuthButtons>
      </SocialAuth>
      {/* <OrContinueWith>
        <OrContinueWithLineContainer>
          <OrContinueWithLine />
        </OrContinueWithLineContainer>
        <OrContinueWithTextContainer>
          <OrContinueWithText>Or continue with</OrContinueWithText>
        </OrContinueWithTextContainer>
      </OrContinueWith> */}
      {/* <Form onSubmit={hookFormHandleSubmit(onSubmit)}>
        <FormItemGroup>
          <FormLabel>Username</FormLabel>
          <FormInput
            {...register('username', {
              required: 'Username is required',
            })}
            type='text'
            disabled={isLoading}
          />
          {errors.username && <FormError>{errors.username.message}</FormError>}
        </FormItemGroup>
        <FormItemGroup>
          <FormLabel>Password</FormLabel>
          <FormInput
            {...register('password', {
              required: 'Password is required',
            })}
            type='password'
            disabled={isLoading}
          />
          {errors.password && <FormError>{errors.password.message}</FormError>}
        </FormItemGroup>
        <AdditionalFormFields
          hookForm={hookForm}
          formState={{ isLoading }}
          additionalSignupFields={additionalSignupFields}
        />
        <FormItemGroup>
          <SubmitButton type='submit' disabled={isLoading}>
            {cta}
          </SubmitButton>
        </FormItemGroup>
      </Form> */}
    </>
  );
};

// function AdditionalFormFields({
//   hookForm,
//   formState: { isLoading },
//   additionalSignupFields,
// }: {
//   hookForm: UseFormReturn<LoginSignupFormFields>;
//   formState: FormState;
//   additionalSignupFields: AdditionalSignupFields;
// }) {
//   const {
//     register,
//     formState: { errors },
//   } = hookForm;

//   function renderField<ComponentType extends React.JSXElementConstructor<any>>(
//     field: AdditionalSignupField,
//     // Ideally we would use ComponentType here, but it doesn't work with react-hook-form
//     Component: any,
//     props?: React.ComponentProps<ComponentType>
//   ) {
//     return (
//       <FormItemGroup key={field.name}>
//         <FormLabel>{field.label}</FormLabel>
//         <Component
//           {...register(field.name, field.validations)}
//           {...props}
//           disabled={isLoading}
//         />
//         {errors[field.name] && (
//           <FormError>{errors[field.name].message}</FormError>
//         )}
//       </FormItemGroup>
//     );
//   }

//   if (areAdditionalFieldsRenderFn(additionalSignupFields)) {
//     return additionalSignupFields(hookForm, { isLoading });
//   }

//   return (
//     additionalSignupFields &&
//     additionalSignupFields.map((field) => {
//       if (isFieldRenderFn(field)) {
//         return field(hookForm, { isLoading });
//       }
//       switch (field.type) {
//         case 'input':
//           return renderField<typeof FormInput>(field, FormInput, {
//             type: 'text',
//           });
//         case 'textarea':
//           return renderField<typeof FormTextarea>(field, FormTextarea);
//         default:
//           throw new Error(
//             `Unsupported additional signup field type: ${field.type}`
//           );
//       }
//     })
//   );
// }

// function isFieldRenderFn(
//   additionalSignupField: AdditionalSignupField | AdditionalSignupFieldRenderFn
// ): additionalSignupField is AdditionalSignupFieldRenderFn {
//   return typeof additionalSignupField === 'function';
// }

// function areAdditionalFieldsRenderFn(
//   additionalSignupFields: AdditionalSignupFields
// ): additionalSignupFields is AdditionalSignupFieldRenderFn {
//   return typeof additionalSignupFields === 'function';
// }
