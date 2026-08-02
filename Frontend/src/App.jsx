import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import './features/shared/styles/global.scss'
import { AuthProvider } from "./features/auth/auth.context";
// import FaceExpression from "./features/expression/components/FaceExpression";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    // <div style={{ textAlign: "center", marginTop: "40px" }}>
    //   <h1>Moodify 🎧</h1>
    //   <FaceExpression />
    // </div>
  );
};

export default App;