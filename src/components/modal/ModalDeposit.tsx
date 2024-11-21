import React from 'react';
import { Modal, Button, Typography } from '@mui/material';

interface ModalDepositProps {
  open: boolean;
  onClose: () => void;
  depositAmount: number;
}

const ModalDeposit: React.FC<ModalDepositProps> = ({ 
  open, 
  onClose, 
  depositAmount 
}) => {
  const handleConfirm = () => {
    console.log('Deposit confirmed');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="deposit-modal-title"
      aria-describedby="deposit-modal-description"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(1px)',
      }}
    >
      <div 
        style={{
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '20px', 
          textAlign: 'center',
          maxWidth: '600px',
          width: '100%',
          border: '4px solid black',
          boxShadow: '5px 5px 0 black',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography 
          id="deposit-modal-title" 
          variant="h5" 
          component="h2" 
          style={{ 
            marginBottom: '25px', 
            fontFamily: 'REM', 
            fontWeight: 'bold',
            color: 'black',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Xác Nhận Đặt Cọc
        </Typography>

        <Typography 
          id="deposit-modal-description" 
          style={{ 
            marginBottom: '25px', 
            fontFamily: 'REM',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'black'
          }}
        >
          Bạn có muốn đặt cọc <span style={{color: 'red'}}>{depositAmount.toLocaleString('vi-VN')}đ</span> cho cuộc đấu giá này?
        </Typography>

        <Typography 
          variant="body2" 
          style={{ 
            marginBottom: '25px', 
            fontFamily: 'REM', 
            fontStyle: 'italic',
            color: '#333',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px'
          }}
        >
          Lưu ý: Số tiền cọc sẽ được hoàn lại khi kết thúc đấu giá
        </Typography>

        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px' 
          }}
        >
          <Button 
            variant="contained" 
            onClick={handleConfirm}
            style={{
              backgroundColor: 'black', 
              color: 'white', 
              fontFamily: 'REM',
              padding: '10px 30px',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              boxShadow: '5px 5px 0 white'
            }}
          >
            Xác Nhận
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={onClose}
            style={{
              borderColor: 'black', 
              borderWidth: '3px',
              color: 'black', 
              fontFamily: 'REM',
              padding: '10px 30px',
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            //   boxShadow: '5px 5px 0 black'
            }}
          >
            Hủy
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeposit;