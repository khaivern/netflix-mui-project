import React, {useState} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";

const LoadingSpinner = ({ asOverlay }) => {
  let spinner = (
    <div className='centered' style={{ height: "100vh" }}>
      <CircularProgress size={70} thickness={6} />
    </div>
  );
  if (asOverlay) {
    spinner = (
      <Modal
        open={true}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'>
        {spinner}
      </Modal>
    );
  }
  return spinner;
};

export default LoadingSpinner;
