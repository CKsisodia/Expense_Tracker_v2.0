import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AddExpense from "./components/Expenses/AddExpense";
import DownloadHistory from "./components/Expenses/DownloadHistory";
import LeaderBoard from "./components/Expenses/LeaderBoard";
import PremiumLayout from "./components/Expenses/PremiumLayout";
import NavBarLayout from "./components/Home/NavBarLayout";
import AccessLayout from "./components/auth/AccessLayout";
import ForgotPassword from "./components/auth/ForgotPassword";
import Login from "./components/auth/Login";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import RequireAuth from "./components/auth/RequireAuth";
import ResetPassword from "./components/auth/ResetPassword";
import Signup from "./components/auth/Signup";
import { getUserInfoAction } from "./redux/actions/asyncAuthAction";
import HomePage from "./components/Home/HomePage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserInfoAction());
  }, [dispatch]);

  return (
    <div>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<NavBarLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/expense-list" element={<PremiumLayout />} />
            <Route path="/leader-board" element={<LeaderBoard />} />
            <Route path="/download-history" element={<DownloadHistory />} />
          </Route>
        </Route>
        <Route element={<RedirectIfAuthenticated />}>
          <Route element={<AccessLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
