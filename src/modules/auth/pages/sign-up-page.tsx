import { AuthLayout } from "../components/auth-layout";
import { SignUpForm } from "../components/sign-up-form";

export default function SignUpPage() {
  return (
    <AuthLayout mode="sign-up">
      <SignUpForm />
    </AuthLayout>
  );
}
