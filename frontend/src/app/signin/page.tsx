import Login from "@/components/auth/signin";
import { generateSeoMetadata } from "@/lib/SEO";

export const metadata = generateSeoMetadata({
  title: "Login | Appify Social",
  description:
    "Appify Social is a modern social networking application built with Next.js, Node.js, MongoDB, Redux Toolkit, and TypeScript. Users can create posts, upload images, like, comment, reply, and manage private or public content securely.",

  schemaTypes: ["WebSite", "WebApplication", "SoftwareApplication"],
});

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
