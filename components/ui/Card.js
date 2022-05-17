import React, { useContext, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import VideoContext from "../../store/video-context";

const sizeMap = {
  small: { width: 200, height: 350, titleLength: 13, descriptionLength: 30 },
  medium: { width: 400, height: 220, titleLength: 30, descriptionLength: 80 },
  large: { width: 600, height: 330, titleLength: 45, descriptionLength: 100 },
};

const CardComponent = ({ id, size, imageUrl, title, description, showSummary = true }) => {
  const videoCtx = useContext(VideoContext);

  // Set image to default if missing
  const [image, setImage] = useState(imageUrl);
  const handleImageError = () => {
    setImage("/static/404.webp");
  };

  // Prettify title and description
  let readableTitle;
  if (!title) {
    readableTitle = "Missing Title";
  } else {
    readableTitle = title.slice(0, sizeMap[size].titleLength);
    if (title.length > readableTitle.length) {
      readableTitle += "...";
    }
  }

  let readableDescription;

  if (!description) {
    readableDescription = "Missing Description";
  } else {
    readableDescription = description
      .split(" ")
      .filter((word) => !word.includes("http"))
      .join(" ")
      .toLowerCase()
      .slice(0, sizeMap[size].descriptionLength);
    if (description.length > readableDescription.length) {
      readableDescription += "...";
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        "&:hover": { zIndex: 1299 }, //  z-index of modal is 1300
      }}>
      <Card
        component={motion.div}
        whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
        sx={{
          width: sizeMap[size].width,
          height: sizeMap[size].height,
          "&.MuiCard-root": { backgroundColor: "primary.dark" },
        }}>
        <CardActionArea onClick={() => videoCtx.showVideo({ id, title, description })}>
          <Box
            sx={{ position: "relative", width: sizeMap[size].width, height: sizeMap[size].height }}>
            <Image
              onError={handleImageError}
              src={image}
              objectFit='cover'
              layout='fill'
              alt={`image of ${title}`}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -90,
                minHeight: 136,
                backgroundColor: "rgba(0,0,0,0.8)",
                border: "2px solid #fff",
                opacity: showSummary ? 1 : 0,
              }}
              width='100%'
              component={motion.div}
              whileHover={{
                translateY: -90,
                transition: { duration: 0.5 },
              }}>
              <CardContent>
                <Typography gutterBottom variant='h5' component='div'>
                  {readableTitle}
                </Typography>
                <Typography variant='body2' paragraph>
                  {readableDescription}
                </Typography>
              </CardContent>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default CardComponent;
