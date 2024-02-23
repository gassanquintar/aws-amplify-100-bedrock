'use client';
import AssistantIcon from '@mui/icons-material/Assistant';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Avatar, Box } from '@mui/material';
import { deepOrange, green } from '@mui/material/colors';
interface ChatMessageProps {
  message: { text: string; isUser: boolean };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => (
  <Box className='flex flex-row justify-start my-4'>
    {message.isUser ? (
      <Avatar sx={{ bgcolor: green[500] }} className='mr-2'>
        <PersonIcon />
      </Avatar>
    ) : (
      <Avatar sx={{ bgcolor: deepOrange[500] }} className='mr-2'>
        <AutoAwesomeIcon />
      </Avatar>
    )}

    <Box className={`p-2 rounded-md text-white`}>
      <Box className='font-bold pb-1'>
        {message.isUser ? 'You' : 'Assistant'}
      </Box>
      <Box>{message.text}</Box>
    </Box>
  </Box>
);

export default ChatMessage;
