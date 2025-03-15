import { useState } from "react";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { inputFieldPropTypes } from "../../util/propTypes";

export const InputField = ({ type, value, placeholder, onChange, className, isPassword = false }) => {
    const [passwordType, setPasswordType] = useState("password");
    const [passwordIcon, setPasswordIcon] = useState(<LuEyeClosed size={20} />);

    const handleTogglePass = () => {
        if (passwordType === "password") {
            setPasswordType("text");
            setPasswordIcon(<LuEye size={20} />);
        } else {
            setPasswordType("password");
            setPasswordIcon(<LuEyeClosed size={20} />);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <input
                type={isPassword ? passwordType : type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={className}
                required
            />
            {isPassword && (
                <span
                    style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: '#003b74'
                    }}
                    onClick={handleTogglePass}
                >
                    {passwordIcon}
                </span>
            )}
        </div>
    );
};

InputField.propTypes = inputFieldPropTypes;