import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f5f1ec] text-[#7b7b78] py-16 px-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Link href="/" className="text-lg font-medium text-[#111111]">
                Shiksha
              </Link>
            </div>
            <p className="text-[#7b7b78] mb-4 max-w-md text-sm">
              Your trusted partner for medical university admissions. Simplifying the complex journey from application to acceptance.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.618 1.292l-1.14 2.854a1 1 0 01-.297.343l-2.854 1.14a1 1 0 01-1.292-.618l-1.14-2.854a1 1 0 01.297-.343l2.854-1.14a1 1 0 011.292-.618l1.14 2.854zm-5.274 4.839a1 1 0 011.833-.888l2.17 1.833a1 1 0 01.888 1.833l-2.17 1.833a1 1 0 01-1.833-.888l-2.17-1.833a1 1 0 01.888-1.833l2.17-1.833zm-1.341 3.219a1 1 0 011.333-1.499l2.17 1.833a1 1 0 01.527 1.25l-2.17 1.833a1 1 0 01-1.333-.499l-2.17-1.833a1 1 0 01.499-1.333z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="text-sm font-medium text-[#111111] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">Home</Link></li>
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">How It Works</Link></li>
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">Universities</Link></li>
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">Documents</Link></li>
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">Pricing</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h3 className="text-sm font-medium text-[#111111] mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">Cookie Policy</Link></li>
              <li><Link href="#" className="text-[#7b7b78] hover:text-[#111111] transition-colors text-sm">GDPR Compliance</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#ebe7e1] mt-12 pt-8 text-center">
          <p className="text-[#7b7b78] text-xs">
            © {new Date().getFullYear()} Shiksha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
