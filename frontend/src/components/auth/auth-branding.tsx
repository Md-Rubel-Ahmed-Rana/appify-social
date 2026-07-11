import { CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Share your moments instantly",
  "Connect with friends worldwide",
  "Create public & private posts",
  "Join meaningful conversations",
];

const AuthBranding = () => {
  return (
    <aside className="hidden bg-slate-50 lg:flex">
      <div className="flex w-full flex-col justify-center px-14 py-16">
        <div className="mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            AppifyLab Task
          </span>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            Appify Social
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Connect, share and build meaningful relationships.
          </p>
        </div>

        <div className="space-y-5">
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-foreground">
            Connect.
            <br />
            Share.
            <br />
            Discover.
          </h2>

          <p className="max-w-md text-base leading-7 text-muted-foreground">
            Join communities, share your ideas, discover interesting people and
            create meaningful conversations with friends around the world.
          </p>
        </div>

        <div className="my-12 flex justify-center">
          <img
            src="/images/auth-illustration.png"
            alt="Social Platform Illustration"
            className="w-full max-w-xs object-contain"
            draggable={false}
          />
        </div>

        <div className="space-y-4">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />

              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AuthBranding;
