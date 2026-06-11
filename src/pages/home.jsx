import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="home-container">
      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background-color: #f8fafc;
          background-image: 
            radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.05) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(139, 92, 246, 0.04) 0px, transparent 50%);
          color: #334155;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          flex-direction: column;
        }

        /* Navbar Styling */
        nav {
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .logo {
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #0f172a;
          text-decoration: none;
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #64748b;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.9rem;
          transition: color 0.15s ease;
        }

        .nav-link:hover {
          color: #0f172a;
        }

        /* FIXED: Using :global wrapper to guarantee Next.js Link picks up hover states */
        :global(.btn-nav-signin) {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          color: #334155 !important;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
          text-decoration: none;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          display: inline-block;
          transition: all 0.15s ease-in-out !important;
        }

        :global(.btn-nav-signin:hover) {
          background: #f8fafc !important;
          border-color: #94a3b8 !important;
          color: #0f172a !important;
        }

        /* Hero Layout */
        .hero {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 6rem 2rem;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
        }

        .hero-content {
          text-align: center;
          max-width: 800px;
        }

        /* Badge */
        .badge {
          display: inline-flex;
          align-items: center;
          background: #e0e7ff;
          color: #4338ca;
          padding: 0.35rem 0.85rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        /* Typography */
        h1 {
          font-size: 3.5rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.15;
          color: #0f172a;
          margin: 0 0 1.25rem 0;
        }

        .subtitle {
          font-size: 1.25rem;
          color: #475569;
          max-width: 620px;
          margin: 0 auto 3rem auto;
          line-height: 1.6;
          font-weight: 400;
        }

        /* Modernized CTA Buttons */
        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 6rem;
        }

        /* FIXED: Using :global wrapper for CTA Buttons */
        :global(.btn-primary) {
          background: #4f46e5 !important;
          color: #ffffff !important;
          border: 1px solid #4338ca !important;
          padding: 0.85rem 2.25rem;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: background 0.15s ease-in-out !important;
        }

        :global(.btn-primary:hover) {
          background: #4338ca !important;
        }

        :global(.btn-secondary) {
          background: #ffffff !important;
          border: 1px solid #cbd5e1 !important;
          color: #334155 !important;
          padding: 0.85rem 2.25rem;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          transition: all 0.15s ease-in-out !important;
        }

        :global(.btn-secondary:hover) {
          background: #f8fafc !important;
          border-color: #94a3b8 !important;
          color: #0f172a !important;
        }

        /* Features Grid */
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          text-align: left;
          border-top: 1px solid #e2e8f0;
          padding-top: 4rem;
        }

        .feature-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.02);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .feature-card:hover {
          border-color: #cbd5e1;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .feature-icon-wrapper {
          color: #4f46e5;
          margin-bottom: 1.25rem;
          display: inline-flex;
        }

        .feature-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .feature-text {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.6;
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .features {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          nav {
            padding: 1rem;
          }

          .hero {
            padding: 4rem 1rem;
          }

          h1 {
            font-size: 2.5rem;
          }

          .subtitle {
            font-size: 1.15rem;
            margin-bottom: 2.5rem;
          }

          .cta-buttons {
            flex-direction: column;
            gap: 0.75rem;
            margin-bottom: 4rem;
          }

          :global(.btn-primary), :global(.btn-secondary) {
            width: 100% !important;
            text-align: center;
            box-sizing: border-box;
            padding: 0.8rem !important;
          }

          .features {
            grid-template-columns: 1fr;
            padding-top: 3rem;
            gap: 1.25rem;
          }
          
          .feature-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <nav>
        <Link href="/" style={{ fontWeight: '700', fontSize: '1.15rem', color: '#0f172a', textDecoration: 'none' }}>
          Financial Tracker
        </Link>
        <div className="nav-links">
          <Link href="/login" className="btn-nav-signin">Sign In</Link>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-content">
          <div className="badge">Platform Release</div>

          <h1>Manage donations and finances with ironclad precision.</h1>

          <p className="subtitle">
            A minimalist, high-performance financial tracking system engineered specifically for modern non-profit organizations.
          </p>

          <div className="cta-buttons">
            <Link href="/signup" className="btn-primary">
              Get Started Free
            </Link>
          </div>

          <div className="features">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <div className="feature-title">Real-time Analytics</div>
              <div className="feature-text">Granular dashboards monitoring key fiscal metrics, continuous trends, and automated capital pipelines.</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="feature-title">Donor Management</div>
              <div className="feature-text">Seamlessly ledger active commitments, recurring donor histories, and dynamic pledge contributions.</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
              </div>
              <div className="feature-title">Project Tracking</div>
              <div className="feature-text">Isolate and audit capital allocations against specific target parameters and execution milestones.</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div className="feature-title">Secure Framework</div>
              <div className="feature-text">Protected by enterprise-tier JWT authentication tokens and strict role-based data access controls.</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <div className="feature-title">Expense Auditing</div>
              <div className="feature-text">Categorize outflow streams instantly to maintain complete ledger transparency for compliance.</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div className="feature-title">Automated Reports</div>
              <div className="feature-text">Compile structured financial summaries and downloadable PDF portfolios ready for stakeholder review.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}