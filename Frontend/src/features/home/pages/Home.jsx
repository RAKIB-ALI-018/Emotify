// import React from 'react';
// import FaceExpression from "../../expression/components/FaceExpression" //name import
// import Player from '../components/player';

// const Home = () => {
//   return (
//     <>
//     <FaceExpression />
//     <Player/>
//     </>
    
//   );
// }

// export default Home;

import React from 'react';
import FaceExpression from "../../expression/components/FaceExpression";
import Player from '../components/player';
import "../styles/home.scss";

const Home = () => {
    return (
        <main className="home-page">
            <div className="home-page__content">
                <FaceExpression />
            </div>

            <div className="home-page__player-bar">
                <Player />
            </div>
        </main>
    );
}

export default Home;
