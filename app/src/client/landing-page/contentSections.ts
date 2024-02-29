import { DOCS_URL, BLOG_URL } from '@wasp/shared/constants';
import daBoiAvatar from '../static/da-boi.png';
import avatarPlaceholder from '../static/avatar-placeholder.png';

export const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Chat', href: '/chat' },
  // { name: 'Documentation', href: DOCS_URL },
  // { name: 'Blog', href: BLOG_URL },
];
export const features = [
  {
    name: 'AI-Powered Assistance',
    description:
      'Capt’n.ai understands your business and manages your digital marketing needs autonomously.',
    icon: '🤖', //'🤝',
    href: '',
  },
  {
    name: 'Daily Updates & Recommendations:',
    description:
      'Stay informed and ahead of the competition with actionable insights delivered straight to your inbox.',
    icon: '🤝', //'🔐',
    href: '',
  },
  {
    name: 'Seamless Integration',
    description:
      'Connect with ease to your Google Ads account and watch Capt’n.ai work its magic.',
    icon: '🤝',
    href: '',
  },
  {
    name: 'Secure Data Handling',
    description:
      'Your data is processed on-the-fly, ensuring privacy and security every step of the way.',
    icon: '🔐', //'💸',
    href: '',
  },
];
export const testimonials = [
  {
    name: 'Da Boi',
    role: 'Wasp Mascot',
    avatarSrc: daBoiAvatar,
    socialUrl: 'https://twitter.com/wasplang',
    quote: "I don't even know how to code. I'm just a plushie.",
  },
  {
    name: 'Mr. Foobar',
    role: 'Founder @ Cool Startup',
    avatarSrc: avatarPlaceholder,
    socialUrl: '',
    quote: 'This product makes me cooler than I already am.',
  },
  {
    name: 'Jamie',
    role: 'Happy Customer',
    avatarSrc: avatarPlaceholder,
    socialUrl: '#',
    quote: 'My cats love it!',
  },
];

export const faqs = [
  {
    id: 1,
    question: 'What is Capt’n.ai?',
    answer:
      'Capt’n.ai is a digital marketing platform that functions like a full-service agency, accessible directly from your device. It features Capt’n, an AI-powered agent who interacts with you to grasp the specifics of your business and advertising goals. Based on this understanding, Capt’n orchestrates a team of specialized AI agents responsible for various tasks, including the development of new marketing campaigns, optimization of ad content, selection of keywords, adjustment of budgets, and continuous monitoring of campaign performance. You receive daily updates and recommendations for enhancing your campaigns directly in your inbox, ensuring your advertising efforts are as effective as possible.',
    href: '',
  },
  {
    id: 2,
    question: 'What platforms does Capt’n.ai work with?',
    answer:
      'Capt’n.ai, in its beta version, initially supports only Google Ads. However, the platform is set to expand its capabilities regularly, adding new features and compatibility with additional advertising networks at a frequent pace, even every few days.',
    href: '',
  },
  {
    id: 3,
    question: 'How much does Capt’n.ai cost?',
    answer:
      'During its beta phase, Capt’n.ai is offered free for an entire month, allowing you to explore its features without any cost. This period is intended for gathering your feedback, so all associated costs are covered by us during this time. While creating an account requires a subscription to facilitate connection with your Google Ads account, providing credit card details is not necessary. The basic monthly subscription fee is currently set at $29, however, we are still evaluating the pricing model to determine if adjustments are needed, either to increase or even possibly decrease the fee. In any case, you will enjoy a 30-day free trial, after which we will have refined our pricing strategy and will inform you before the trial ends. This gives you the opportunity to assess the value of Capt’n.ai and decide if you wish to continue using the service.',
    href: '',
  },
  {
    id: 4,
    question: 'Is my data secure?',
    answer:
      'We process data on-the-fly and do not store any data in databases, except for chat history (if you chat directly on out website) to enhance your user experience. You can delete this chat history at any time. This ensures your data stays where it belongs—with you. When you use the chat directly on our website, your data is shared only with our privately deployed OpenAI models hosted on Microsoft Azure or our our in-house AI algorithms, meaning that we don’t share your data with OpenAI directly. You can find more information in our Privacy Policy section.',
    href: '',
  },
  {
    id: 5,
    question: 'I run an agency, is Capt’n.ai for me as well?',
    answer: 'Not quite yet, but it will be! Stay tuned for our updates.',
    href: '',
  },
  {
    id: 6,
    question:
      'I have more questions, and even some suggestions, How can I get in contact with you?',
    answer:
      'Yes, please, do let us know if you have any questions, comments, feedback, suggestions… just ping us at support@captain.ai.',
    href: '',
  },
];
export const footerNavigation = {
  app: [
    { name: 'Documentation', href: DOCS_URL },
    { name: 'Blog', href: BLOG_URL },
  ],
  company: [
    { name: 'About', href: 'https://airt.ai/' },
    { name: 'Privacy', href: 'https://captn.ai/privacy' },
    { name: 'Terms of Service', href: 'https://captn.ai/toc' },
  ],
};
