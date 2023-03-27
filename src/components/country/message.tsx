import styled from 'styled-components';

const StyledMessage = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  line-height: 50px;
`;

interface MessageProps {
  message: string;
}

const Message = (props: MessageProps) => {
  const { message } = props;

  return <StyledMessage>{message}</StyledMessage>;
};

export default Message;
