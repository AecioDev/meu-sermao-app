import { Moon, Sun } from "lucide-react";
import { useState } from "react";

const SwitchButton = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleSwitch = () => {
    setIsOn((prevState) => !prevState);
  };

  return (
    <button
      onClick={toggleSwitch}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "60px",
        height: "30px",
        borderRadius: "15px",
        border: "none",
        backgroundColor: isOn ? "#FFD700" : "#333",
        color: "#fff",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}
    >
      {isOn ? (
        <Moon className="h-5 w-5 text-card-foreground" />
      ) : (
        <Sun className="h-5 w-5 text-primary-foreground" />
      )}
    </button>
  );
};

export default SwitchButton;
