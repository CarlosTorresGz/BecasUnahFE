import Spinner from 'react-bootstrap/Spinner';

export const SpinnerLoading = () => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Spinner animation="border" role="status" style={{ color: "#20527E" }}>
                <span className="visually-hidden" style={{ color: "#20527E" }}>Loading...</span>
            </Spinner>
        </div>
    );
}

export default SpinnerLoading;