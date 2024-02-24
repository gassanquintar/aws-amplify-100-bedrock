'use client';
import { useEffect, useState } from 'react';
import ChatMessage from './ChatMessage';
import {
  Alert,
  AlertTitle,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  styled,
} from '@mui/material';

import { Amplify } from 'aws-amplify';
import amplifyconfig from '../../amplifyconfiguration.json';
import { post } from 'aws-amplify/api';
import ChatAppBar from './AppBar';
Amplify.configure(amplifyconfig);

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#6b7280',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: '#6b7280',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#6b7280',
    },
    '&:hover fieldset': {
      borderColor: '#B2BAC2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6F7E8C',
    },
  },
});

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>(
    []
  );
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const sendMessage = (text: string) => {
    setLoading(true);
    setMessages([...messages, { text, isUser: true }]);
    receiveMessage(text);
  };

  const receiveMessage = async (text: string) => {
    try {
      const restOperation = post({
        apiName: 'chatApi',
        path: '/chat',
        options: {
          body: { prompt: text },
        },
      });

      const { body } = await restOperation.response;
      const json = (await body.json()) as {
        response: string;
      };
      setLoading(false);
      if (json) {
        setResponse(json.response);
      } else {
        setError(true);
      }
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    if (response) {
      setMessages([...messages, { text: response, isUser: false }]);
    }
  }, [response]);

  useEffect(() => {
    if (response) {
      setMessages([...messages, { text: response, isUser: false }]);
    }
  }, [response]);

  return (
    <>
      <ChatAppBar />
      <Backdrop
        sx={{ color: '#ff5722', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}>
        <CircularProgress color='inherit' size={50} />
      </Backdrop>
      <Backdrop
        sx={{ color: '#ff5722', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={error}>
        <Alert severity='error' onClose={() => setError(false)}>
          <AlertTitle>Error</AlertTitle>
          Something went wrong. Try again later!
        </Alert>
      </Backdrop>
      <Box className='flex flex-col justify-between h-screen'>
        <Box className='flex justify-center items-start mt-10'>
          <Box className='p-4 w-[90%] lg:w-[50%]'>
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
          </Box>
        </Box>
        <Box className='flex justify-center items-end mb-20'>
          <Box className='p-4 w-[90%] lg:w-[50%] shadow-lg border-gray-500 border rounded-lg'>
            <StyledTextField
              id='chat-input'
              placeholder={
                loading ? 'waiting for a response...' : 'Type a message...'
              }
              fullWidth
              disabled={loading}
              InputProps={{
                style: {
                  color: 'white',
                  borderBlockColor: 'white',
                },
                onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (
                    event.key === 'Enter' &&
                    (event.currentTarget as HTMLInputElement).value.trim() !==
                      ''
                  ) {
                    sendMessage(
                      (event.currentTarget as HTMLInputElement).value
                    );
                    (event.currentTarget as HTMLInputElement).value = '';
                  }
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChatApp;
