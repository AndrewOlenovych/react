import axios from 'axios';
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'

export function axiosInterceptor() {
    const errorHandler = (error: any) => {
        toastr.options = {
            positionClass: 'toast-top-right',
            toastClass: 'toast-error',
            hideDuration: 300,
            timeOut: 60000,
            iconClass: 'toast-error'
        }
        toastr.clear()
        toastr.error(`Bad response`);

        return Promise.reject({ ...error })
    }

    const successHandler = (response: any) => {
        return response
    }

    axios.interceptors.response.use(
        response => successHandler(response),
        error => errorHandler(error)
    )

}