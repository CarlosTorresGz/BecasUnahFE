import { useState } from "react";
import ListaDeBecarios from "../components/Chat/ListaDeBecarios";
import ChatPrivado from "../components/Chat/Chat";
import { useAuth } from "../context/AuthContext";
import PropTypes from "prop-types";

const PantallaDeChat = () => {
    const [targetUserId, setTargetUserId] = useState(null);
    const { getUser } = useAuth();
    const user = getUser();

    return (
        <div className="p-4">
            {!targetUserId ? (
                <ListaDeBecarios onSelect={(id) => setTargetUserId(id)} />
            ) : (
                <ChatPrivado
                    userId={user.no_cuenta}
                    targetUserId={targetUserId}
                />
            )}
        </div>
    );
};

PantallaDeChat.propTypes = {
    userId: PropTypes.string.isRequired,
};
export default PantallaDeChat;
