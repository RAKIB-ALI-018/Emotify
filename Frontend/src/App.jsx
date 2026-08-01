import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import './features/shared/styles/global.scss'
// import FaceExpression from "./features/expression/components/FaceExpression";

const App = () => {
  return (
    <RouterProvider router={router} />
    // <div style={{ textAlign: "center", marginTop: "40px" }}>
    //   <h1>Moodify 🎧</h1>
    //   <FaceExpression />
    // </div>
  );
};

export default App;