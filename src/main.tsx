import ReactDOM from "react-dom/client";
// @ts-ignore
import { BrowserRouter as Router, Route, Routes, RouterProvider, createBrowserRouter } from "react-router-dom";
import Gallery from "./Pages/Galery/gallery.tsx";
import Home from "./Pages/Home/home.tsx";
import Users from "./Pages/Users/users.tsx";

// Get base path from environment (set in vite.config.ts via VITE_BASE_PATH)
// For Vercel: "/" (default), for GitHub Pages: "/Monopoly/"
const basePath = import.meta.env.BASE_URL || "/";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/gallery",
        element: <Gallery />,
    },
    {
        path: "/users",
        element: <Users />,
    },
], {
    basename: basePath.endsWith("/") ? basePath.slice(0, -1) : basePath
});

function App() {
    return <RouterProvider router={router} />;
}

document.title = "Monopoly";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);

