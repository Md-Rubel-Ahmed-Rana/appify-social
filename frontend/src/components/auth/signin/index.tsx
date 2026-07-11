import AuthBranding from "../auth-branding";
import LoginForm from "./signin-form";

const Login = () => {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <div className="grid w-full max-w-7xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">
          <AuthBranding />
          <section className="flex items-center justify-center p-6 sm:p-10 lg:border-l lg:border-slate-200 lg:p-16">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
