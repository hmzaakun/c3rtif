import { Shield, LinkIcon, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    < main className="flex-1 w-full" >
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="w-full px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Secure the Future of Education
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Certify and verify the authenticity of diplomas using blockchain technology. An innovative solution
                for educational institutions of the future.
              </p>
            </div>
            <div className="space-x-4">
              <Button size="lg" className="font-medium">
                Get Started
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted" id="features">
        <div className="w-full px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Maximum Security</h3>
              <p className="text-muted-foreground">
                Your diplomas are immutably secured on the blockchain, guaranteeing their authenticity.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <LinkIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Complete Traceability</h3>
              <p className="text-muted-foreground">
                Track the complete history of each diploma from creation to verification.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Instant Verification</h3>
              <p className="text-muted-foreground">
                Validate the authenticity of a diploma in seconds with our verification system.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32" id="contact">
        <div className="w-full px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Ready to Revolutionize Diploma Certification?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join the institutions that trust C3rtif to secure their graduates' future.
              </p>
            </div>
            <Button size="lg" className="font-medium">
              Request a Demo
            </Button>
          </div>
        </div>
      </section>
    </main >
  );
}
