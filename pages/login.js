import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import EmailIcon from "@mui/icons-material/Email";
import { constructMagicSDKInstance } from "../lib/magic-util";

const Login = () => {
  const [email, setEmail] = useState("");
  const [emailHelperText, setEmailHelperText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const emailChangeHandler = (e) => {
    setEmail(e.target.value);
    const isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(e.target.value);
    if (!isValid) {
      setEmailHelperText("Email entered is not valid");
    } else {
      setEmailHelperText("");
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const signInHandler = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    const magic = constructMagicSDKInstance();
    try {
      const DIDToken = await magic.auth.loginWithMagicLink({ email });
      if (DIDToken && (await magic.user.isLoggedIn())) {
        const DIDTokenWithCustomLifeSpan = await magic.user.getIdToken({
          lifespan: 7 * 24 * 60 * 60,
        });
        
        const response = await axios.get("/api/login", {
          headers: {
            Authorization: `Bearer ${DIDTokenWithCustomLifeSpan}`,
            "Content-type": "application/json",
          },
        });

        const { success } = response.data;
        console.log({success})
        if (success) {
          router.push("/");
        } else {
          throw new Error("Failed to log in, please try again later.");
        }
      } else {
        throw new Error("No DIDToken or failed logged in check was returned");
      }
    } catch (err) {
      // console.log("Error Logging in magic", err.message);
      setErrorMessage(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setIsLoading(false);
    };
    // subscribe to event changes
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("routeChangeError", handleRouteChange);

    return () => {
      // Unsubscribe from event changes
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("routeChangeError", handleRouteChange);
    };
  }, [router]);

  return (
    <Grid
      container
      direction='column'
      sx={{ height: "100vh", position: "relative" }}
      justifyContent='center'>
      <Grid item sx={{ position: "absolute", height: "100%", width: "100%", zIndex: "-1" }}>
        <Image
          src='/static/netflix-background.jpg'
          layout='fill'
          objectFit='cover'
          alt='Netflix login background'
        />
      </Grid>
      <Grid item style={{ width: "30rem", margin: "auto" }}>
        <Grid
          item
          container
          direction='column'
          sx={{
            backgroundColor: "rgba(0,0,0,0.85)",
            borderRadius: "8px",
            paddingLeft: "4rem",
            paddingRight: "4rem",
            paddingBottom: "4rem",
            paddingTop: "1rem",
          }}>
          <Grid item>
            <Box component='form' autoComplete='off' noValidate onSubmit={signInHandler}>
              <Grid item sx={{ marginTop: "2rem", marginBottom: "1rem" }}>
                <Typography variant='h3' sx={{ color: "primary.main", fontSize: "3rem" }}>
                  Sign In
                </Typography>
              </Grid>
              <Grid item sx={{ marginBottom: "1.5rem" }}>
                <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                  <EmailIcon
                    fontSize='large'
                    sx={{ color: "#fff", mr: 1, my: !!emailHelperText ? 3 : 0.5 }}
                  />
                  <TextField
                    label='Email Address'
                    id='email'
                    variant='standard'
                    value={email}
                    onChange={emailChangeHandler}
                    fullWidth
                    color='secondary'
                    error={!!emailHelperText}
                    helperText={emailHelperText}
                  />
                </Box>
              </Grid>
              <Grid item>
                {isLoading ? (
                  <Box sx={{ display: "flex" }} justifyContent='center'>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Button
                    type='submit'
                    variant='contained'
                    fullWidth
                    sx={{
                      "&.Mui-disabled": {
                        color: "rgba(255,255,255,1)",
                        backgroundColor: "rgba(255,255,255,0.7)",
                      },
                    }}
                    disabled={!email || !!emailHelperText}>
                    Sign In
                  </Button>
                )}
              </Grid>
              {errorMessage && (
                <Grid item marginTop='1.5rem'>
                  <Typography variant='body2' color='primary.light' textAlign='right'>
                    {errorMessage}
                  </Typography>
                </Grid>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
