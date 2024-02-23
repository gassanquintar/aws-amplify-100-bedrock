'use client';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import awsconfig from '../aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import ChatApp from './components/ChatApp';

Amplify.configure({
  ...awsconfig,
});

const Home: React.FC = () => {
  return (
    <Authenticator>
      <ChatApp />
    </Authenticator>
  );
};

export default Home;
