
export const Button = ({ type = "button", text, className, onClick = () => {} }) => {
    return (
        <button type={type} class={className} onClick={onClick}>{text}</button>
    )
}
