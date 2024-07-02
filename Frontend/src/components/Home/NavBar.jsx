import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  buyPremiumAction,
  getUserInfoAction,
} from "../../redux/actions/asyncAuthAction";
import { selectUserData, userActions } from "../../redux/reducers/authReducers";
import ApiHelper from "../../utils/apiHelperFunction";

// const pages = ["Add Expense", "Expense List", "Analytics"];
const pages = [
  { id: "addExpense", value: "Add Expense" },
  { id: "expenseList", value: "Expense List" },
  { id: "analytics", value: "Analytics" },
];
const settings = [
  { id: "profile", value: "Profile" },
  { id: "logout", value: "Logout" },
];

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const user = useSelector(selectUserData);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navBarMenuHandler = (id) => {
    const idToPath = {
      addExpense: "/add-expense",
      expenseList: "/expense-list",
      analytics: "/",
    };

    const path = idToPath[id];
    if (path) {
      navigate(path);
    }
  };

  const settingsHandler = (id) => {
    if (id === "profile") {
      return navigate("/profile");
    } else if (id === "logout") {
      dispatch(userActions.logoutUser());
      toast.success("You have logged out");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const premiumHandler = async () => {
    const loadScript = await loadRazorpayScript();

    if (!loadScript) {
      toast.error("Please try again !");
      return;
    }

    const response = await dispatch(buyPremiumAction());

    const { userOrder, key_id } = response.payload.data;
    const options = {
      key: key_id,
      name: "Expense Tracker",
      description: "Test Transaction",
      order_id: userOrder.orderId,
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id;
        await ApiHelper.post("/user/update-premium-status", {
          orderId: userOrder.orderId,
          paymentId,
        });
        dispatch(getUserInfoAction());
        toast.success("Payment successful");
      },
      notes: {
        address: "Expense Tracker ",
      },
    };
    const razorPay = new window.Razorpay(options);
    razorPay.open();
  };

  const avtarNameHandler = (username) => {
    if (!username) return "";
    const parts = username.toUpperCase().split(" ");
    if (parts.length === 1) {
      return `${parts[0][0]}${parts[0][1] ? parts[0][1] : ""}`;
    } else if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#38d39f" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AccountBalanceIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              color: "#023364",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#023364",
              textDecoration: "none",
            }}
          >
            Expense Tracker
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="#023364"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.id}
                  onClick={() => {
                    handleCloseNavMenu();
                    navBarMenuHandler(page.id);
                  }}
                >
                  <Typography textAlign="center">{page.value}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AccountBalanceIcon
            sx={{
              display: { xs: "flex", md: "none" },
              mr: 1,
              color: "#023364",
            }}
          />
          <Typography
            variant="h5"
            noWrap
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "#023364",
              textDecoration: "none",
            }}
          >
            Expense Tracker
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.id}
                onClick={() => {
                  handleCloseNavMenu();
                  navBarMenuHandler(page.id);
                }}
                sx={{ my: 2, color: "#023364", display: "block" }}
              >
                {page.value}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {!user?.data?.premiumUser ? (
              <Button
                sx={{
                  fontSize: "16px",
                  color: "#023364",
                  fontWeight: 700,
                  mr: 2,
                }}
                onClick={premiumHandler}
              >
                Buy Premium
              </Button>
            ) : (
              <>
                <Button
                  sx={{
                    fontSize: "16px",
                    color: "#023364",
                    fontWeight: 700,
                  }}
                  onClick={() => {
                    navigate("/download-history");
                  }}
                >
                  Download History
                </Button>
                <Button
                  sx={{
                    fontSize: "16px",
                    color: "#023364",
                    fontWeight: 700,
                    mr: 2,
                  }}
                  onClick={() => {
                    navigate("/leader-board");
                  }}
                >
                  Leaderboard
                </Button>
              </>
            )}
            {!user?.status && (
              <Link to="/login">
                <Button
                  sx={{
                    fontSize: "16px",
                    color: "#023364",
                    fontWeight: 700,
                    mr: 2,
                  }}
                >
                  Login
                </Button>
              </Link>
            )}

            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar>{avtarNameHandler(user?.data?.username)}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting.id}
                  onClick={() => {
                    handleCloseUserMenu();
                    settingsHandler(setting.id);
                  }}
                >
                  <Typography textAlign="center">{setting.value}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavBar;
