export const handleLoginRedirect = () => {
    const tenantId = import.meta.env.VITE_TENANT_ID_2;
    const clientId = import.meta.env.VITE_CLIENT_ID_2;
    const redirectUri = "http://localhost:5173/dashboard/administrador"; 
    const scope = "Mail.Send";
    const state = "random_state_value"; 

    const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?
    client_id=${clientId}
    &response_type=code
    &redirect_uri=${encodeURIComponent(redirectUri)}
    &scope=${encodeURIComponent(scope)}
    &state=${state}`;

    window.location.href = authUrl; // Redirigir al usuario
};