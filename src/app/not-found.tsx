import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 mt-6">
      <main className="text-center space-y-6 animate-fadeIn">
        <h1 className="text-4xl font-bold font-fancy mb-4">
          404: Page Not Found
        </h1>
        <p className="text-xl font-primary mb-6">
          Oops! The password to this page got lost in the void! 🚀
        </p>
        <div className="relative mx-auto mb-6" style={{ width: '256px', height: '256px' }}>
          <Image
            src="/404.gif"
            alt="Funny 404 illustration"
            width={256}
            height={256}
            className="object-contain"
          />
        </div>
        <p className="font-mono text-lg">
          Error Code: <span className="text-golden">P4SSW0RD_M1SS1NG</span> 🔐
        </p>
        <Link href="/" passHref>
          <Button
            variant="default"
            size="lg"
            className="font-primary transition-all duration-300 ease-in-out
                       hover:scale-105 hover:bg-synthwavePink hover:text-black
                       hover:shadow-golden/50
                       focus:outline-none focus:ring-2 focus:ring-golden focus:ring-offset-2 focus:ring-offset-background mt-8"
          >
            Return to Safety 🏠
          </Button>
        </Link>
      </main>
    </div>
  );
}
