import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import './features/shared/styles/global.scss'
import { AuthProvider } from "./features/auth/auth.context";
import { SongContextProvider } from "./features/home/song.context";
// import FaceExpression from "./features/expression/components/FaceExpression";

const App = () => {
  return (
    <AuthProvider>
      <SongContextProvider>
        <RouterProvider router={router} />
      </SongContextProvider>
    </AuthProvider>
    // <div style={{ textAlign: "center", marginTop: "40px" }}>
    //   <h1>Moodify 🎧</h1>
    //   <FaceExpression />
    // </div>
  );
};

export default App;