import type React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Cột trái - Hero/Branding (Chỉ hiện trên desktop) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gray-900 text-white p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <span className="text-gray-900 font-bold text-xl leading-none">E</span>
          </div>
          <span className="text-xl font-bold tracking-tight">E-Commerce Admin</span>
        </div>
        
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">
            Manage your store with ease
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            The all-in-one dashboard to track sales, manage inventory, and understand your customers perfectly.
          </p>
        </div>
        
        <div className="text-sm text-gray-500 font-medium">
          &copy; {new Date().getFullYear()} E-Commerce System. All rights reserved.
        </div>
      </div>

      {/* Cột phải - Auth Form */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-6 sm:p-12 bg-gray-50 dark:bg-gray-950">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Logo cho mobile (ẩn trên desktop) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl leading-none">E</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              E-Commerce Admin
            </span>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
