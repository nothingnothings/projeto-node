import ErrorAlertStyle from './ErrorAlert.module.css';





const ErrorAlert = (props) => {
    return (
        <div className={ErrorAlertStyle.Alert}>{props.children}</div>
    )
}



export default ErrorAlert;