import { createBrowserRouter } from "react-router";
import TodoModal from "../components/blocks/Todo-Modal/todo-modal";
import LoginPage from "../pages/login-page";
import ProtectedRoute from "./protected-route";
import App from "../App";

const router = createBrowserRouter([
    // {
    //     path: "/signup",
    //     element: <SignUpPage />
    // },
    {
        path: "/",
        element: <LoginPage />
    },
    {
        path: "/kanban",
        element: (
            <ProtectedRoute>
                <App />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "todo/:id",
                element: (
                    <ProtectedRoute>
                        <TodoModal />
                    </ProtectedRoute>
                ),
            },
        ],
  },
])

export default router