'use client';

import { Mail, HelpCircle, ExternalLink, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-prive-white border-t border-prive-border pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-prive-border">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-prive rounded flex items-center justify-center text-white">
                <Mail size={20} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-wider text-prive-text">
                Subscribe to the Newsletter
              </h3>
            </div>
            <p className="text-prive-text-muted text-sm leading-relaxed max-w-md">
              Sign up for our email newsletter to get the latest game announcements, updates on
              special events and offers, and more from Rockstar Games and our affiliates.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 mt-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="bg-prive-white border border-prive-border focus:border-prive rounded px-4 py-3 text-sm text-prive-text focus:outline-none flex-1"
              />
              <button type="submit" className="btn-prive font-black text-xs px-6 py-3 rounded transition-all">
                Subscribe Now
              </button>
            </form>
          </div>

          <div
            id="support"
            className="flex flex-col gap-4 bg-prive-white border border-prive-border p-6 sm:p-8 rounded-xl justify-between shadow-prive-card"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-prive-surface rounded-xl flex items-center justify-center text-prive flex-shrink-0">
                <HelpCircle size={28} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase tracking-wider mb-1 text-prive-text">
                  Rockstar Support
                </h4>
                <p className="text-prive-text-muted text-xs leading-relaxed">
                  Get help with issues, browse common solutions, view service status updates, and
                  submit support requests.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-prive-border">
              <span className="text-xs text-prive-text-muted font-bold">
                Need assistance? We are here 24/7.
              </span>
              <a
                href="https://support.rockstargames.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center bg-transparent hover:bg-prive text-prive hover:text-white border border-prive-border hover:border-prive font-bold uppercase text-xs px-6 py-3 rounded transition-all"
              >
                Get Support
              </a>
            </div>
          </div>
        </div>

        <div className="py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-widest text-prive-text-muted">
            <a href="https://www.rockstargames.com/games" className="hover:text-prive transition-colors">
              Games
            </a>
            <a
              href="https://store.rockstargames.com"
              className="hover:text-prive transition-colors flex items-center gap-1"
            >
              Store <ExternalLink size={12} />
            </a>
            <a href="https://support.rockstargames.com" className="hover:text-prive transition-colors">
              Support
            </a>
            <a href="https://www.rockstargames.com/careers" className="hover:text-prive transition-colors">
              Careers
            </a>
            <a
              href="https://circolocorecords.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-prive transition-colors text-prive"
            >
              CircoLoco Records
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-prive-text-muted cursor-pointer hover:text-prive">
            <Globe size={16} />
            <span>English</span>
          </div>
        </div>

        <div className="border-t border-prive-border pt-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase font-bold tracking-widest text-prive-text-muted">
            <a href="#" className="hover:text-prive transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-prive transition-colors">
              Careers
            </a>
            <a href="#" className="hover:text-prive transition-colors">
              Community Guidelines
            </a>
            <a href="#" className="hover:text-prive transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-prive transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-prive transition-colors">
              Legal
            </a>
          </div>

          <p className="text-[10px] text-prive-text-muted font-bold uppercase tracking-wider">
            Rockstar Games 2026. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
