import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { CertificateViewer } from "@/components/ui/certificate-viewer";
import { certifications } from "@/content/certifications";

export function Certifications() {
  return (
    <section id="certifications" className="section border-t border-line">
      <div className="container-page">
        <SectionHeader
          eyebrow="05 / CERTIFICATIONS"
          title="Certifications"
          description="Credentials that back up my coursework and hands-on practice."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <Reveal key={cert.title} delay={index * 0.07}>
              <Card interactive className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex size-10 items-center justify-center rounded-[var(--radius-sm)] border border-accent/30 bg-accent/10 text-accent">
                    <Award aria-hidden="true" size={18} />
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-4 text-lg">{cert.title}</h3>
                <p className="mt-1 text-sm text-muted">{cert.issuer}</p>

                {cert.images?.length > 0 && (
                  <div className="mt-4">
                    <CertificateViewer images={cert.images} />
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  {cert.url ? (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:text-ink"
                    >
                      Verify
                      <ExternalLink aria-hidden="true" size={12} />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted">
                      <ShieldCheck aria-hidden="true" size={12} />
                      Credential on file
                    </span>
                  )}
                  {cert.credentialId && (
                    <span className="font-mono text-[0.65rem] text-muted">
                      {cert.credentialId}
                    </span>
                  )}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
