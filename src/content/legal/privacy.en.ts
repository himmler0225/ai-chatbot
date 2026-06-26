import type { LegalDocument } from './types'

export const privacyEn: LegalDocument = {
  title: 'Privacy Policy',
  lastUpdated: 'June 26, 2026',
  intro:
    'This policy describes how {{operator}} (“we”) collects, uses, and protects information when you use ReviewMine AI at reviewmine.ai and related subdomains.',
  sections: [
    {
      id: 'controller',
      title: '1. Data controller',
      paragraphs: [
        'ReviewMine AI is operated by {{operator}}, an individual based in Vietnam.',
        'Privacy requests: {{email}}.',
      ],
    },
    {
      id: 'collect',
      title: '2. Information we collect',
      paragraphs: ['We collect only what is needed to run the free service:'],
      bullets: [
        'Account data (when signed in): email, name, profile photo from Google, or details you provide via Supabase Auth.',
        'Chat content: questions, answers, and session metadata — stored on our servers only when you are signed in.',
        'Guests: limited trial use; content is not stored on our servers.',
        'Local preferences: language and light/dark theme in your browser’s localStorage.',
        'Technical logs: IP address, browser type, access time — automatically recorded by hosting infrastructure for security and operations.',
      ],
    },
    {
      id: 'use',
      title: '3. How we use information',
      bullets: [
        'Provide and improve AI chat that analyzes product reviews.',
        'Save and sync conversation history for signed-in accounts.',
        'Authenticate users and protect accounts.',
        'Respond to support or privacy requests.',
        'Comply with lawful requests from authorities.',
      ],
    },
    {
      id: 'ai',
      title: '4. AI processing and third parties',
      paragraphs: [
        'Your questions may be sent to language-model providers (e.g. OpenAI, DeepSeek) to generate answers. We do not send passwords or payment data (the service is currently free).',
        'Account and chat data is stored via Supabase. Google Sign-In is subject to Google’s policies.',
        'ReviewMine AI aggregates public content from YouTube and TikTok; we do not access your personal social accounts.',
        'Product search may link to partner stores (Tiki, FPT Shop). Their policies apply when you leave ReviewMine AI.',
      ],
    },
    {
      id: 'retention',
      title: '5. Retention',
      paragraphs: [
        'Chat history is kept until you delete a session or account, unless law requires longer retention.',
        'Technical logs are typically kept for a short period per infrastructure settings.',
      ],
    },
    {
      id: 'rights',
      title: '6. Your rights',
      bullets: [
        'Request access, correction, or deletion of personal data.',
        'Delete chat history in the app or request account deletion via contact email.',
        'Withdraw consent by stopping use and requesting deletion.',
        'Lodge a complaint with competent authorities in Vietnam if you believe your privacy was violated.',
      ],
    },
    {
      id: 'security',
      title: '7. Security',
      paragraphs: [
        'We use reasonable safeguards (HTTPS, token auth, access controls). No system is perfectly secure — please protect your login credentials.',
      ],
    },
    {
      id: 'children',
      title: '8. Children',
      paragraphs: [
        'The service is not directed at users under 16. If we learn we collected a child’s data without parental consent, we will delete it when notified.',
      ],
    },
    {
      id: 'changes',
      title: '9. Policy changes',
      paragraphs: [
        'We may update this policy. The latest version will be posted here with an updated date. Continued use after changes means you accept the updated policy.',
      ],
    },
    {
      id: 'contact',
      title: '10. Contact',
      paragraphs: ['Privacy questions: {{email}}.'],
    },
  ],
}
