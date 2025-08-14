import { toast } from "react-toastify";

export const showToastSuccess = (message?: string) => {
    toast.success(message || 'Success', {
        style: {
            backgroundColor: '#008000',
            color: '#fff',
        }
    })         
}

export const showToastError = (message?: string) => {
    toast.error(message || 'An error occurred', {
        style: {
            backgroundColor: '#9d0208',
            color: '#fff',
        }
    })         
}

export default { showToastError }