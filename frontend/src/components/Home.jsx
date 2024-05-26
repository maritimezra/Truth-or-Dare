import { Link } from 'react-router-dom';

const Home = () => {

    return (
        <div>
            <div className="menubar">
                <div className="menubar-left">
                    Truth or Dare
                </div>
                <div className="menubar-right">
                    <Link to="/login">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
