import { createBrowserRouter } from "react-router";
import Board from "../components/blocks/Board";
import TodoModal from "../components/blocks/todo-modal";
import LoginPage from "../pages/login-page";
import ProtectedRoute from "./protected-route";

const router = createBrowserRouter([
    // {
    //     path: "/signup",
    //     element: <SignUpPage />
    // },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/kanban",
        element: (
            <ProtectedRoute>
                <Board />
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