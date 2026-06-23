import React from 'react';
import styled from 'styled-components';

const Wrap = styled.div`max-width:780px;margin:0 auto;padding:100px 24px 60px;`;
const Title = styled.h1`font-size:2rem;font-weight:900;color:#fef3c7;margin-bottom:10px;`;
const Sub = styled.p`color:#b8a07a;font-size:1.05rem;margin-bottom:40px;border-bottom:1px solid rgba(245,158,11,0.12);padding-bottom:28px;`;
const Section = styled.div`margin-bottom:36px;`;
const STitle = styled.h2`font-size:1.15rem;font-weight:700;color:#f59e0b;margin-bottom:10px;`;
const Body = styled.p`color:#b8a07a;line-height:1.8;font-size:0.97rem;`;
const List = styled.ul`color:#b8a07a;line-height:1.9;font-size:0.97rem;padding-left:20px;list-style:disc;`;

const PAGES = {
  'how-it-works': {
    title: '🔨 How It Works',
    sub: 'DIY Network connects makers, builders and hobbyists around the world. Here\'s how to get the most out of the platform.',
    sections: [
      { title: '1. Create an Account', body: 'Sign up with a username and password. You\'ll receive a 6-digit OTP to verify your email. Once verified, your profile is live and you can start contributing immediately.' },
      { title: '2. Browse & Discover', body: 'Explore thousands of DIY projects across 5 categories: Building, Construction, IT & Dev, Hobbies, and Home Improvement. Use the category filters and sort by newest, most popular, or highest-rated.' },
      { title: '3. Share Your Projects', body: 'Click "New Post" to share your own project. Add a title, rich-text description, category, difficulty level, and photos or video. Your post goes live instantly.' },
      { title: '4. Rate & Discuss', body: 'Rate any project on a 0–100 scale (Poor → Perfect). Leave comments and start discussions. The community curates the best content through ratings.' },
      { title: '5. Level Up', body: 'The more you contribute, the more you become known in your niche. Admins can promote trusted members to help moderate the community.' },
    ],
  },
  guidelines: {
    title: '📋 Community Guidelines',
    sub: 'DIY Network is a positive, hands-on community. These guidelines keep it safe and useful for everyone.',
    sections: [
      { title: 'Be Helpful & Constructive', body: 'Share real knowledge from your own experience. If you\'re commenting, add value — encouragement, tips, corrections done kindly.' },
      { title: 'No Spam or Self-Promotion', body: 'Posts must be genuine DIY content. Links to external sites are allowed only when they directly support the project being described.' },
      { title: 'Safety First', body: 'Always include safety warnings for hazardous projects (electrical, structural, chemical, power tools). Projects that omit critical safety information may be removed.' },
      { title: 'Respect Intellectual Property', body: 'Only share content you created or have explicit permission to share. Credit your sources and inspirations.' },
      { title: 'Zero Tolerance', body: 'Harassment, hate speech, or content that demeans any group will result in immediate removal and permanent ban.' },
    ],
  },
  privacy: {
    title: '🔒 Privacy Policy',
    sub: 'Your privacy matters. Here\'s what we collect and how we use it.',
    sections: [
      { title: 'What We Collect', body: 'Username, hashed password, email address (optional), posts, comments, and ratings you create on the platform. We do not collect payment information.' },
      { title: 'How We Use It', body: 'Your data is used exclusively to operate the platform — displaying your posts, connecting you with the community, and sending account-related notifications.' },
      { title: 'Data Storage', body: 'Data is stored on MongoDB Atlas servers hosted in the EU. Passwords are bcrypt-hashed and never stored in plain text. OTP codes expire after 10 minutes.' },
      { title: 'Third Parties', body: 'We do not sell or share your personal data with third parties. Google Sign-In (when enabled) is governed by Google\'s privacy policy.' },
      { title: 'Your Rights', body: 'You can request deletion of your account and all associated content at any time by contacting leonidfedorets30@gmail.com.' },
    ],
  },
  terms: {
    title: '📜 Terms of Service',
    sub: 'By using DIY Network you agree to the following terms.',
    sections: [
      { title: 'Eligibility', body: 'You must be 16 years or older to create an account. By registering you confirm you meet this requirement.' },
      { title: 'Your Content', body: 'You retain ownership of everything you post. By posting, you grant DIY Network a non-exclusive, worldwide, royalty-free license to display your content on the platform.' },
      { title: 'Acceptable Use', body: 'You agree not to use the platform for illegal activities, to spread misinformation, to impersonate others, or to attempt to compromise platform security.' },
      { title: 'Content Removal', body: 'DIY Network reserves the right to remove any content that violates these terms or the Community Guidelines, with or without notice.' },
      { title: 'Limitation of Liability', body: 'DIY Network provides the platform "as is." We are not responsible for the accuracy of user-submitted content. Always apply professional judgment and safety practices when undertaking DIY projects.' },
    ],
  },
};

const InfoPage = ({ page }) => {
  const data = PAGES[page];
  if (!data) return null;
  return (
    <Wrap>
      <Title>{data.title}</Title>
      <Sub>{data.sub}</Sub>
      {data.sections.map(s => (
        <Section key={s.title}>
          <STitle>{s.title}</STitle>
          <Body>{s.body}</Body>
        </Section>
      ))}
    </Wrap>
  );
};

export default InfoPage;
