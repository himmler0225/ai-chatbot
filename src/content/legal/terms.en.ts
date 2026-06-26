import type { LegalDocument } from './types'

export const termsEn: LegalDocument = {
  title: 'Terms of Service',
  lastUpdated: 'June 26, 2026',
  intro:
    'By accessing or using ReviewMine AI, you agree to these terms between you and {{operator}}.',
  sections: [
    {
      id: 'service',
      title: '1. The service',
      paragraphs: [
        'ReviewMine AI is an AI chat tool that aggregates and analyzes product reviews from public sources (YouTube, TikTok) and helps find products via partner links. The service is currently free; we may change features or usage limits without prior notice.',
      ],
    },
    {
      id: 'account',
      title: '2. Accounts',
      bullets: [
        'You may try the service with limits while signed out.',
        'Sign in with Google or email/password to save chat history.',
        'You are responsible for securing your credentials and activity under your account.',
        'Information you provide must be accurate and lawful.',
      ],
    },
    {
      id: 'acceptable',
      title: '3. Acceptable use',
      paragraphs: ['You agree not to:'],
      bullets: [
        'Use the service for unlawful, fraudulent, harassing, or malware-related purposes.',
        'Attempt unauthorized access to systems, APIs, or other users’ data.',
        'Submit content that infringes copyright, is abusive, or violates Vietnamese law.',
        'Abuse, spam, or automate access beyond reasonable limits.',
      ],
    },
    {
      id: 'ai-disclaimer',
      title: '4. AI disclaimer',
      paragraphs: [
        'AI-generated answers may be wrong, incomplete, or outdated. ReviewMine AI is not professional, technical, legal, or financial advice.',
        'Purchase decisions are your responsibility. Verify important information from official sources before deciding.',
      ],
    },
    {
      id: 'third-party',
      title: '5. Third-party content',
      paragraphs: [
        'Reviews, videos, and product data belong to their respective owners (YouTube, TikTok, retailers, users). We display or summarize under each platform’s terms.',
        'Links to third-party sites do not mean we endorse their content or transactions.',
      ],
    },
    {
      id: 'ip',
      title: '6. Intellectual property',
      paragraphs: [
        'ReviewMine AI branding, interface, and code are owned by {{operator}}, except third-party content. You may not copy, reverse-engineer, or commercially exploit the service without written permission.',
      ],
    },
    {
      id: 'availability',
      title: '7. Availability',
      paragraphs: [
        'The service is provided “as is”. We do not guarantee uninterrupted, error-free, or fit-for-purpose operation. Maintenance, upgrades, or incidents may cause temporary downtime.',
      ],
    },
    {
      id: 'liability',
      title: '8. Limitation of liability',
      paragraphs: [
        'To the extent permitted by Vietnamese law, {{operator}} is not liable for indirect damages, lost profits, data loss, or purchase decisions based on AI content. Total liability (if any) shall not exceed fees paid in the prior 12 months — currently 0 as the service is free.',
      ],
    },
    {
      id: 'termination',
      title: '9. Termination',
      paragraphs: [
        'You may stop using the service at any time. We may suspend or terminate access if you breach these terms or for operational or security reasons.',
      ],
    },
    {
      id: 'law',
      title: '10. Governing law',
      paragraphs: [
        'These terms are governed by the laws of Vietnam. Disputes should first be resolved amicably; otherwise, competent Vietnamese courts shall have jurisdiction as provided by law.',
      ],
    },
    {
      id: 'changes',
      title: '11. Changes',
      paragraphs: [
        'We may update these terms and post the new version on this page with an updated date. Continued use after changes take effect means you accept them.',
      ],
    },
    {
      id: 'contact',
      title: '12. Contact',
      paragraphs: ['Questions about these terms: {{email}}.'],
    },
  ],
}
