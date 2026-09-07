import { SignIn } from "@clerk/clerk-react";

export function SignInForm() {
  return (
    <SignIn 
      routing="path" 
      path="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "bg-white shadow-md border border-gray-200 rounded-xl w-full max-w-md",
          headerTitle: "text-gray-900 font-bold text-2xl tracking-tight",
          headerSubtitle: "text-gray-500 text-sm",
          socialButtonsBlockButton: "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm",
          socialButtonsBlockButtonText: "font-medium",
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-400 text-xs font-medium",
          formFieldLabel: "text-gray-700 font-medium text-sm",
          formFieldInput: "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-lg shadow-sm h-10",
          formButtonPrimary: "bg-gray-900 hover:bg-gray-800 text-white font-medium h-10 rounded-lg shadow-sm transition-colors",
          footerActionLink: "text-gray-900 hover:text-gray-700 font-medium transition-colors",
          identityPreviewText: "text-gray-700 font-medium",
          identityPreviewEditButton: "text-gray-500 hover:text-gray-900",
        }
      }}
    />
  );
}
