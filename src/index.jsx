import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./styles/base.css";
import "./styles/app.css";

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
