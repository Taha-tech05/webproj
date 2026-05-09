export default function Footer() {
    return (
        <footer style={{
            background: '#060b1f',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            padding: '40px 20px',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '14px',
            marginTop: 'auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '30px'
            }}>
                {/* Brand Section */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '16px'
                    }}>
                        <div style={{
                            width: '32px', height: '32px',
                            background: 'linear-gradient(135deg, #2952d9, #7b4cf0)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: '800', fontSize: '18px'
                        }}>F</div>
                        <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>Financial Tracking System</h3>
                    </div>
                    <p style={{ lineHeight: '1.6', fontSize: '13px' }}>
                        Empowering transparent financial operations. Manage projects, track donations, and record expenses with full accountability.
                    </p>
                </div>

                {/* Contact Section */}
                <div>
                    <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact Us</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}><span>📍</span><span>123 University Campus, Block B</span></div>
                        <div style={{ display: 'flex', gap: '8px' }}><span>📞</span><span>+92 300 0000000</span></div>
                        <div style={{ display: 'flex', gap: '8px' }}><span>✉️</span><span>support@tracking.uni.edu</span></div>
                    </div>
                </div>

                {/* Links & Socials Section */}
                <div>
                    <h4 style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Links</h4>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</a>
                        <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Service</a>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                            <a key={social} href="#" style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                color: '#fff',
                                fontSize: '12px',
                                textDecoration: 'none',
                                transition: 'background 0.2s'
                            }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                                {social}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div style={{
                textAlign: 'center',
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                fontSize: '12px'
            }}>
                © {new Date().getFullYear()} Financial Tracking System. All rights reserved.
            </div>
        </footer>
    );
}
