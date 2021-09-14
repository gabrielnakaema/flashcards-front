import { createContext, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert, Color } from '@material-ui/lab';

interface IAlertContext {
  alert: {
    message: string;
    type: AlertType;
    duration: number;
  };
  setAlert: (message: string, type: AlertType, duration: number) => void;
}

type AlertType = 'success' | 'warning' | 'info' | 'error';

const initialAlert: IAlertContext['alert'] = {
  message: '',
  type: 'success',
  duration: 0,
};

export const AlertContext = createContext({} as IAlertContext);

export const AlertProvider = (props: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState(initialAlert);

  const handleAlertChange = (
    message: string,
    type: AlertType,
    duration: number
  ) => {
    setAlert({ message, type, duration });
  };

  const handleClose = () => {
    setAlert(initialAlert);
  };

  return (
    <AlertContext.Provider value={{ alert, setAlert: handleAlertChange }}>
      <Snackbar
        open={Boolean(alert.message)}
        autoHideDuration={alert.duration}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={alert.type as Color}>
          {alert.message}
        </Alert>
      </Snackbar>
      {props.children}
    </AlertContext.Provider>
  );
};
