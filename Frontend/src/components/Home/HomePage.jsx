import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import React from "react";
import {
  FcConferenceCall,
  FcOvertime,
  FcPrivacy,
  FcStatistics,
} from "react-icons/fc";
import { GiReceiveMoney } from "react-icons/gi";
import { MdWorkspacePremium } from "react-icons/md";
import { DNA } from "react-loader-spinner";

const HomePage = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Box sx={{ m: "20px auto auto auto", p: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
          <Typography
            textAlign="center"
            sx={{
              color: "#bfa181",
              fontSize: isSmallScreen ? "32px" : "64px",
              fontWeight: 700,
            }}
          >
            Welcome
          </Typography>

          <DNA
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </Box>
        <Typography
          component="div"
          textAlign="center"
          sx={{
            color: "#bfa181",
            fontSize: isSmallScreen ? "24px" : "32px",
            fontWeight: 700,
          }}
        >
          <div style={{ color: "#178582" }}>Simple way</div> to manage
          <span style={{ color: "#178582" }}> personal finances</span>
        </Typography>
        <Grid
          container
          rowSpacing={3}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ mt: 4 }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <FcPrivacy size="4rem" />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#deb992" }}
              >
                Fully secured
              </Typography>
              <Typography textAlign="center" color="#869ba9">
                Ensuring data security is our top priority with robust
                encryption.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <FcOvertime size="4rem" />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#deb992" }}
              >
                Real-time updates
              </Typography>
              <Typography textAlign="center" color="#869ba9">
                Stay updated instantly with live information on your expenses.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <MdWorkspacePremium color="green" size="4rem" />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#deb992" }}
              >
                Premium benefits
              </Typography>
              <Typography textAlign="center" color="#869ba9">
                Enjoy exclusive features designed for enhanced financial
                management.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <GiReceiveMoney size="4rem" color="#178582" />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#deb992" }}
              >
                Easy management
              </Typography>
              <Typography textAlign="center" color="#869ba9">
                Manage your expenses effortlessly with user-friendly tools and
                interfaces.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <FcConferenceCall size="4rem" />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#deb992" }}
              >
                User specific
              </Typography>
              <Typography textAlign="center" color="#869ba9">
                Customize your expense tracking to suit your individual needs
                and preferences.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box>
                <FcStatistics size="4rem" />
              </Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: "24px", color: "#deb992" }}
              >
                Advanced analytics
              </Typography>
              <Typography textAlign="center" color="#869ba9">
                Gain valuable insights into your spending habits with analytical
                reports.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HomePage;
