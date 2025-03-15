import '../styles/InformacionItem.css';
import { profilePropTypes } from "../util/propTypes";

export const InfoItem = ({ label, value }) => {
    return (
        <div className="profile-becario-info-item">
            <span className="profile-becario-info-item-label">{label} </span>
            <span className="profile-becario-info-item-value">{value}</span>
        </div>
    )
}

InfoItem.propTypes = profilePropTypes;
export default InfoItem;