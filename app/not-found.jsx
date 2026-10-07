import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="section flex min-h-[70svh] items-center">
      <div className="container-page text-center">
        <p className="eyebrow">404 / Not found</p>
        <h1 className="mt-6">Page not found.</h1>
        <p className="mx-auto mt-5 max-w-md text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <div className="mt-9 flex justify-center">
          <ButtonLink href="/">Back to home</ButtonLink>
        </div>
      </div>
    </div>
  );
}
