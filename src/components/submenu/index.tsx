import styled from 'styled-components';

const StyledSubmenu = styled.div`
  width: 60px;
  border: 2px solid #000;
  position: absolute;
  top: -2px;
  left: 110%;
  background: #fff;
`;

interface SubmenuProps {
  type: string;
  治理: () => void;
  收税: () => void;
  开垦: () => void;
  征兵: () => void;
  出征: () => void;
}

const Submenu = (props: SubmenuProps) => {
  const { type, 治理, 收税, 开垦, 征兵, 出征 } = props;

  if (type === '内政') {
    return (
      <StyledSubmenu>
        <div
          onClick={() => {
            开垦();
          }}
        >
          开垦
        </div>
        <div
          onClick={() => {
            收税();
          }}
        >
          收税
        </div>
        <div
          onClick={() => {
            治理();
          }}
        >
          治理
        </div>
      </StyledSubmenu>
    );
  } else if (type === '军事') {
    return (
      <StyledSubmenu>
        <div
          onClick={() => {
            征兵();
          }}
        >
          征兵
        </div>
        <div
          onClick={() => {
            出征();
          }}
        >
          出征
        </div>
      </StyledSubmenu>
    );
  }

  return null;
};

export default Submenu;
