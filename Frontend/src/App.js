import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AddExpense from "./components/Expenses/AddExpense";
import ExpenseList from "./components/Expenses/ExpenseList";
import NavBarLayout from "./components/Home/NavBarLayout";
import AccessLayout from "./components/auth/AccessLayout";
import ForgotPassword from "./components/auth/ForgotPassword";
import Login from "./components/auth/Login";
import RedirectIfAuthenticated from "./components/auth/RedirectIfAuthenticated";
import RequireAuth from "./components/auth/RequireAuth";
import Signup from "./components/auth/Signup";
import { getUserInfoAction } from "./redux/actions/asyncAuthAction";
import ResetPassword from "./components/auth/ResetPassword";
import LeaderBoard from "./components/Expenses/LeaderBoard";
import PremiumLayout from "./components/Expenses/PremiumLayout";
import DownloadHistory from "./components/Expenses/DownloadHistory";

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
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/expense-list" element={<PremiumLayout />} />
            <Route path="/leader-board" element={<LeaderBoard />} />
            <Route path="/download-history" element={<DownloadHistory />} />
          </Route>
        </Route>
        <Route element={<RedirectIfAuthenticated />}>
          <Route
            path="/login"
            element={
              <AccessLayout>
                <Login />
              </AccessLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AccessLayout>
                <Signup />
              </AccessLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AccessLayout>
                <ForgotPassword />
              </AccessLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <AccessLayout>
                <ResetPassword />
              </AccessLayout>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
