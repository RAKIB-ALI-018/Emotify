import React from "react";
import FaceExpression from "./features/expression/components/FaceExpression";

const App = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>Moodify 🎧</h1>
      <FaceExpression />
    </div>
  );
};

export default App;