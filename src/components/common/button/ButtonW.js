import React from 'react';
import ButtonMUI from '@mui/material/Button';
import { styled } from '@mui/system';

const CustomButton = styled(ButtonMUI)({
  backgroundImage: 'linear-gradient(#f9f9f9, #eaeaea)',
  border: '1px solid lightgray',
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#000000',
  transition: 'border-color 0.3s',
  boxShadow: 'none',
  height: '26px',
  marginLeft: '10px',
  '&:hover': {
    borderColor: '#000000',
    boxShadow: 'none',
  },
});

const ButtonW = ({ data, onClickEvent }) => {
  const onClickEventFunction = () => {
    console.log('hiii');
    onClickEvent();
  };

  return (
    <CustomButton
      variant="contained"
      size="small"
      onClick={onClickEventFunction}
    >
      {data}
    </CustomButton>
  );
};

export default ButtonW;
