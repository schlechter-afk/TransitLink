import * as React from "react";
import NavbarFreight from "../navbars/navbarFreight";
import { Modal } from "@mui/material";
import { Backdrop } from "@mui/material";
import { Box, CircularProgress, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import "../App.css";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  truckBox: {
    backgroundColor: "lightyellow",
    height: "370px",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    marginBottom: "16px",
    overflow: "hidden",
    position: "relative",
    // backgroundColor: 'lightyellow',
    transition: "box-shadow .3s ease-in-out",
    "&:hover": {
      boxShadow: "0px 4px 20px -4px rgba(0,0,0,0.4)",
    },
  },
  truckBoxTitle: {
    fontWeight: "bold",
    fontSize: "35px",
    marginBottom: "5px",
  },
  truckBoxText: {
    color: "black",
    fontSize: "25px",
    marginBottom: "10px",
    lineHeight: "1.3",
  },
});

export default function SearchTruck(props) {
  const navigate = useNavigate();
  React.useEffect(() => {
    if (props.isJwt) {
      navigate("/search");
    }
  }, []);

  const classes = useStyles();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 800,
    width: 1050,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    overflow: "scroll",
    p: 4,
  };
  const [loadType, setLoadType] = React.useState("");
  const [loadWeight, setLoadWeight] = React.useState("");

  const [isButtonLoading, setButtonLoading] = React.useState(false);
  const [truckDetails, setTruckDetails] = React.useState([]);
  const [load, setLoad] = React.useState(0);
  const [displayDetails, setDisplayDetails] = React.useState([]);
  const [searchChange, handleSearchChange] = React.useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    setLoad(false);
    setDisplayDetails([]);
    handleSearchChange(!searchChange);
  };

  React.useEffect(() => {
    for (var i = 0; i < truckDetails.length; i++) {
      if (
        truckDetails[i].load_types_handled === loadType &&
        parseInt(truckDetails[i].max_volume) >= parseInt(loadWeight)
      ) {
        setDisplayDetails([...displayDetails, truckDetails[i]]);
      }
    }
    setLoad(true);
  }, [searchChange]);

  React.useEffect(() => {
    const token = localStorage["userToken"] + "123";
    console.log(token);
    axios
      .post(
        "http://localhost:4003/user/get_trucks",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer:${token}`,
          },
        }
      )
      .then((res) => {
        setButtonLoading(false);
        setLoad(1);
        setTruckDetails(res.data.subarray);
      })
      .catch((error, res) => {
        setButtonLoading(false);
        if (error.response.request.status == 401) {
          alert("Unauthorized User! Kindly Login!");
          props.JwtState(false);
        } else {
          alert(error.response.data.message);
        }
      });
  }, []);

  console.log(displayDetails);
  return load ? (
    <>
      <div style={{ backgroundColor: "lightcyan" }}>
        <NavbarFreight setIsJwt={props.setIsJwt} setJwt={props.setJwt} />
        <div style={{ paddingTop: "70px" }}>
          <form>
            <label>
              Load Type :
              <input
                type="text"
                value={loadType}
                onChange={(event) => setLoadType(event.target.value)}
              />
            </label>
            <br />
            <br />
            <label>
              Load Weight:
              <input
                type="text"
                value={loadWeight}
                onChange={(event) => setLoadWeight(event.target.value)}
              />
            </label>
            <br />
            <Button
              variant="contained"
              onClick={handleClick}
              class="my-button"
              style={{ display: "flex", textAlign: "center", margin: "auto" }}
            >
              Search
            </Button>
          </form>
        </div>
        {displayDetails.map((ticketD, ind) => {
          return (
            <div
              style={{
                paddingTop: "50px",
                marginLeft: "2%",
                paddingRight: "2%",
              }}
            >
              <Box className={classes.truckBox}>
                <div className={classes.truckBoxText}>
                  <span style={{ fontWeight: "bold" }}>Loads:</span>{" "}
                  {ticketD.load_types_handled}
                </div>
                {/* <div className={classes.truckBoxText}>
                  <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                  {ticketD.dateOfShippment}
                </div>
                <div className={classes.truckBoxText}>
                  <span style={{ fontWeight: "bold" }}>
                    Source Address Pincode:
                  </span>{" "}
                  {ticketD.source_address_pincode}
                </div> */}
                {/* <div className={classes.truckBoxText}>
                  <span style={{ fontWeight: "bold" }}>
                    Destination Address Pincode:
                  </span>{" "}
                  {ticketD.destination_address_pincode}
                </div> */}
                <div className={classes.truckBoxText}>
                  <span style={{ fontWeight: "bold" }}>Requested Quotes:</span>{" "}
                  {ticketD.requested_quotes}
                </div>
                <div className={classes.truckBoxText}>
                  <span style={{ fontWeight: "bold" }}>Received Quotes:</span>{" "}
                  {ticketD.recieved_quotes}
                </div>
              </Box>

              {/* </div> */}
            </div>
          );
        })}
      </div>
    </>
  ) : (
    <></>
  );
}
