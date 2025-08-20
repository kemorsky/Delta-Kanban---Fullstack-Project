import { ToastContainer, Slide } from "react-toastify";

export default function Toast() {
    return (
        <ToastContainer position="bottom-center"
                    autoClose={2500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable={false}
                    pauseOnHover
                    theme="colored"
                    transition={Slide}
                />
    )
}