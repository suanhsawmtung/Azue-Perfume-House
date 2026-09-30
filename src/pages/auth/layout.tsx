import AzuePerfume from "@/assets/images/azue-perfume.png";
import { Link, Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="relative flex h-screen w-full">
      <div className="relative z-50 h-full w-full lg:w-1/2">
        <div className="absolute top-0 left-0 my-auto flex h-16 w-full items-center pl-4 lg:max-w-5xl lg:pl-16 xl:max-w-7xl">
          <Link to="/">
            <div className="flex items-center gap-x-2">
              {/* <LogoIcon className="text-primary size-8" aria-hidden={true} /> */}
              <h1 className="lg:text-foreground text-xl font-semibold text-white">
                AZUE Perfume House
              </h1>
              <span className="sr-only">Home</span>
            </div>
          </Link>
        </div>
        <div className="flex h-full w-full items-center justify-center px-4 sm:px-0">
          <Outlet />
        </div>
      </div>

      <div className="absolute z-10 h-full w-full overflow-hidden lg:relative lg:w-1/2">
        <img
          src={AzuePerfume}
          alt="House"
          className="h-full w-full object-cover"
          aria-label="House Image In Sign in page"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
