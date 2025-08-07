// import React, { useRef } from 'react';
// import { Toast, type ToastMessage } from 'primereact/toast';

// type Props = {
//   showToast: (message: string, severity: ToastMessage['severity']) => void;
// };

// export default function ToastSuccess(props: Props) {
//   const toastBottomCenter = useRef<Toast>(null);

//   const showMessage = (message: string, severity: ToastMessage['severity']) => {
//     toastBottomCenter.current?.show({ severity: severity, summary: message, detail: '', life: 3000 });
//   };

//   props.showToast(showMessage);

//   return (
//     <div className="card flex justify-content-center">
//       <Toast ref={toastBottomCenter} position="bottom-center" />
//     </div>
//   )
// }