import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { DashBoard } from "./pages/Dashboard";
import { Accounts } from "./pages/Accounts";
import { AiComposer } from "./pages/AiComposer";
import { Layout } from "./components/layout";
import { Scheduler } from "./pages/Scheduler";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route element={<Layout/>}>
                    <Route path="/dashboard" element={<DashBoard/>}/>
                    <Route path="/accounts" element={<Accounts/>}/>
                    <Route path="/scheduler" element={<Scheduler/>}/>
                    <Route path="/ai-composer" element={<AiComposer/>}/>
                </Route>
            </Routes>
        </>
    );
}
