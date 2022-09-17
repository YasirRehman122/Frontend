import '../css/SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button';

const SearchBar = () => {
    return (
        <section className='searchBarSection d-flex'>
            <input type="text" placeholder="Search for restaurants or foods" className='search-bar glowing-border'/>
            <Button className="searchButton">
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </Button>
        </section>
    );
}

export default SearchBar