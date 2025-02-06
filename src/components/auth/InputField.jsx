
export const InputField = ({ type, value, placeholder, onChange, className }) => {
    return (
        <>
            <input type={type} value={value} placeholder={placeholder} onChange={onChange} className={className} required />
        </>
    )
}
