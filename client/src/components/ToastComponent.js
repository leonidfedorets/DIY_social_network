import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ToastComponent = () => {
  const [showToast, setShowToast] = useState(true);

  const notify = (message) => {
    toast(message, {
      position: 'top-right',
      onClose: () => setShowToast(false),
    });
  };

  return (
    <div>
      <Toaster />
    </div>
  );
};

export default ToastComponent;
