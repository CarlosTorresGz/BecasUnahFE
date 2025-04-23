
export const Button = ({ type = "button", text, className, onClick = () => {} }) => {
    return (
        <button type={type} className={className} onClick={onClick}>{text}</button>
    )
}
