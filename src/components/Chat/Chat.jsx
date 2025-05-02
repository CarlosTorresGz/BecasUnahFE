import { useEffect, useState, useRef } from "react";
import { ChatPropTypes } from "../../util/propTypes";
import { handleTokenRefresh } from "../../services/Auth/handleTokenRefresh";

const ChatPrivado = ({ userId, targetUserId }) => {
    console.log("userId", userId);
    console.log("targetUserId", targetUserId);

    const token = localStorage.getItem("jwtToken");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const ws = useRef(null);

    const groupName = `private:${[userId, targetUserId].sort().join(":")}`;
    console.log("groupName", groupName);

    useEffect(() => {
        const connectToChat = async () => {
            const res = await fetch('http://localhost:7071/api/getPubSubToken', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ targetUserId })
            });

            if (res.status === 401) {
                return await handleTokenRefresh(connectToChat);
            }

            const data = await res.json();
            console.log("Conectando a:", data);
            ws.current = new WebSocket(data.url);

            ws.current.onopen = () => {
                ws.current.send(JSON.stringify({
                    type: "joinGroup",
                    group: groupName
                }));
            };

            ws.current.onmessage = (event) => {
                const msg = JSON.parse(event.data);
                if (msg?.data?.text) {
                    setMessages((prev) => [...prev, {
                        from: msg.from || "otro",
                        text: msg.data.text
                    }]);
                }
            };

            ws.current.onclose = () => {
                console.warn("Conexión cerrada");
            };
        };

        connectToChat();

        return () => ws.current?.close();
    }, [userId, targetUserId]);

    const sendMessage = () => {
        if (input.trim()) {
            ws.current?.send(JSON.stringify({
                type: "sendToGroup",
                group: groupName,
                data: { text: input }
            }));

            setMessages((prev) => [...prev, { from: userId, text: input }]);
            setInput("");
        }
    };

    return (
        <div>
            <h3>Chat con {targetUserId}</h3>
            <div style={{ height: 200, overflowY: "scroll", border: "1px solid #ccc", marginBottom: 10, padding: "0.5rem" }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{ textAlign: msg.from === userId ? "right" : "left" }}>
                        <strong>{msg.from === userId ? "Tú" : msg.from}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje"
                style={{ width: "70%", padding: "0.4rem" }}
            />
            <button onClick={sendMessage} style={{ marginLeft: "0.5rem", padding: "0.4rem 1rem" }}>Enviar</button>
        </div>
    );
};

ChatPrivado.propTypes = ChatPropTypes;
export default ChatPrivado;
