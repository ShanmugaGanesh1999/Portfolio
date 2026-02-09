import { useState, useCallback } from "react";
import { Prompt, ActionCard } from "../ui";
import { PERSONAL } from "../../data/portfolioData";

/**
 * Contact — Footer section with CTA, resume download, social links
 */
export default function Contact() {
  const [downloading, setDownloading] = useState(false);

  /**
   * Handle resume download from Google Drive
   * Update PERSONAL.resumeUrl in portfolioData.js with your actual link
   */
  const handleResumeDownload = useCallback(() => {
    setDownloading(true);

    // Open the Google Drive download link
    const link = document.createElement("a");
    link.href = PERSONAL.resumeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    // If it's a direct download link (uc?export=download), trigger download
    if (PERSONAL.resumeUrl.includes("export=download")) {
      link.download = "Shanmuga_Ganesh_Resume.pdf";
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloading(false), 2000);
  }, []);

  const handleCalendly = useCallback(() => {
    window.open(PERSONAL.calendlyUrl, "_blank", "noopener,noreferrer");
  }, []);

  return (
    <footer
      className="space-y-4 border-t border-border pt-8 sm:pt-12 pb-16 sm:pb-24"
      id="contact"
    >
      <Prompt command="sudo shutdown -h now" className="text-keyword" />

      <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
        {/* Left — CTA + Contact Info */}
        <div>
          <h2 className="text-2xl sm:text-4xl font-black mb-4 sm:mb-6 leading-tight">
            LET'S <span className="text-accent italic">BUILD_</span>
            <br />
            <span className="text-success">NEXT_GEN_SYS</span>
          </h2>

          <div className="space-y-4 text-sm">
            <p className="flex items-center gap-3">
              <span className="text-comment">EMAIL:</span>
              <a
                className="text-variable hover:underline"
                href={`mailto:${PERSONAL.email}`}
              >
                {PERSONAL.email}
              </a>
            </p>
            {PERSONAL.phone && (
              <p className="flex items-center gap-3">
                <span className="text-comment">TEL:</span>
                <a
                  className="text-variable hover:underline"
                  href={`tel:${PERSONAL.phone}`}
                >
                  {PERSONAL.phone}
                </a>
              </p>
            )}
            <p className="flex items-center gap-3">
              <span className="text-comment">LOC:</span>
              <span>{PERSONAL.location}</span>
            </p>
            <p className="text-comment text-xs italic mt-4">
              [!] SYSTEM_STATUS: {PERSONAL.status}
            </p>
          </div>
        </div>

        {/* Right — Action Cards */}
        <div className="flex flex-col gap-3">
          <ActionCard
            title={downloading ? "DOWNLOADING..." : PERSONAL.resumeLabel}
            subtitle={PERSONAL.resumeVersion}
            icon="download"
            color="accent"
            onClick={handleResumeDownload}
          />
          <ActionCard
            title="SCHEDULE_SYNC.EXE"
            subtitle="AUTO_CALENDLY_TRIGGER"
            icon="event"
            color="success"
            onClick={handleCalendly}
          />
        </div>
      </div>

      {/* Bottom bar — Copyright + Social */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-12 text-[10px] text-comment gap-4">
        <div>© {new Date().getFullYear()} SHANMUGA GANESH // KERNEL_VER: 5.15.0-GENERIC</div>
        <div className="flex gap-4">
          <a
            href={PERSONAL.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            GH
          </a>
          <a
            href={PERSONAL.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            LI
          </a>
          <a
            href={PERSONAL.socialLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent transition-colors"
          >
            TW
          </a>
        </div>
      </div>
    </footer>
  );
}
