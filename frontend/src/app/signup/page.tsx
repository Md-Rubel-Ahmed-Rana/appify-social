import Register from "@/components/auth/signup";
import { generateSeoMetadata } from "@/lib/SEO";

export const metadata = generateSeoMetadata({
  title: "Register | Appify Social",
  description:
    "Appify Social is a modern social networking application built with Next.js, Node.js, MongoDB, Redux Toolkit, and TypeScript. Users can create posts, upload images, like, comment, reply, and manage private or public content securely.",

  schemaTypes: ["WebSite", "WebApplication", "SoftwareApplication"],
});

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
