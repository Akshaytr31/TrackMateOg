import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6"; // Fixed import

const Input = ({ value, onChange, label, placeholder, type }) => {
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <label className="text-[13px] text-slate-800">{label}</label>

            <div className="input-box">
                <input
                    type={type === "password" ? (showPassword ? "text" : "password") : type}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none"
                    value={value}
                    onChange={onChange} 
                />
                {type === "password" && (
                   <>
                    {showPassword ? (
                        <FaRegEye
                            size={22}
                            className="text-primary cursor-pointer"
                            onClick={toggleShowPassword} // Fixed syntax
                        />
                    ) : (
                        <FaRegEyeSlash
                            size={22}
                            className="text-state-400 cursor-pointer"
                            onClick={toggleShowPassword} // Fixed syntax
                        />
                    )}
                   </>
                )}
            </div>
        </div>
    );
};

export default Input;
