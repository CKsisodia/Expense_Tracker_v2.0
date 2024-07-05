import { Box } from "@mui/material";
import React from "react";
import { RotatingTriangles } from "react-loader-spinner";

const Loading = () => {
  const colorTriangle = ['#178582', '#bfa181', '#fceddc']
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", justifyContent: "center", margin: "280px" }}>
        <RotatingTriangles
          visible={true}
          height="180"
          width="180"
          colors = {colorTriangle}
          ariaLabel="rotating-triangles-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </Box>
    </React.Fragment>
  );
};

export default Loading;
