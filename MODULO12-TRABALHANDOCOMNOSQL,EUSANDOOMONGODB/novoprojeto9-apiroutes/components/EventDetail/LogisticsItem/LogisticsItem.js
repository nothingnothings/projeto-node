import LogisticsItemStyle from './LogisticsItem.module.css';






const LogisticsItem = (props) => {
    const {icon: Icon } = props;






    return (
        <li className={LogisticsItemStyle.Item}>
            <span className={LogisticsItemStyle.Icon}>
                <Icon />
            </span>
            <span className={LogisticsItemStyle.Content}>{props.children}</span>
        </li>
    )
}


export default LogisticsItem;