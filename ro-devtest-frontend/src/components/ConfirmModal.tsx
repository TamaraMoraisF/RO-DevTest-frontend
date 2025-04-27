import { ReactNode } from 'react';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '8px',
        textAlign: 'center',
        width: '300px',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.3)'
      }}>
        <p style={{ marginBottom: '20px' }}>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: '#ccc',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: '#dc3545',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
