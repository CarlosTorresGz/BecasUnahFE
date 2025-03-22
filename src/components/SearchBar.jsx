import '../styles/SearchBar.css';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { searchBarPropTypes } from "../util/propTypes";

export const SearchBar = ({ text = 'Buscar', searchTerm, setSearchTerm, onSearch  }) => {
    return (
        <InputGroup className="mb-3 mt-3">
            <Form.Control
                placeholder="Buscar"
                type='text'
                aria-label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
                variant="outline-secondary"
                onClick={() => onSearch(searchTerm)}
            >
                {text}
            </Button>
        </InputGroup>
    );
}

SearchBar.propTypes = searchBarPropTypes;
export default SearchBar;