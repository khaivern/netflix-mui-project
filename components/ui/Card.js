import React, { useContext, useState } from "react";
import { motion } from "framer-motion";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Image from "next/image";
import VideoContext from "../../store/video-context";

const sizeMap = {
  small: { width: 250, height: 510, minHeight: 300 },
  medium: { width: 400, height: 400, minHeight: 200 },
  large: { width: 550, height: 450, minHeight: 300 },
};

const CardComponent = ({ id, size, imageUrl, title, description }) => {
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
    readableTitle = title.split(" ").slice(0, 8).join(" ");
    if (title.length > readableTitle.length) {
      readableTitle += "...";
    }
  }

  let readableDescription;

  if (!description) {
    readableDescription = "Missing Description";
  } else {
    readableDescription = description.split(" ").slice(0, 15).join(" ");
    if (description.length > readableDescription.length) {
      readableDescription += "...";
    }
  }
  return (
    <Box
      sx={{
        position: "relative",
        "&:hover": { zIndex: 1299 }, //  z-index of modal is 1300
        minHeight: sizeMap[size].minHeight,
        height: sizeMap[size].height,
      }}>
      <Card
        component={motion.div}
        whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
        sx={{
          maxWidth: sizeMap[size].width,
          minWidth: sizeMap[size].width,
          height: "100%",
          "&.MuiCard-root": { backgroundColor: "primary.dark" },
        }}>
        <CardActionArea onClick={() => videoCtx.showVideo({id, title, description})}>
          <Image
            onError={handleImageError}
            src={image}
            height={sizeMap[size].minHeight}
            width={sizeMap[size].width}
            objectFit='cover'
            alt={`image of ${title}`}
          />
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {readableTitle}
            </Typography>
            <Typography variant='body2' paragraph>
              {readableDescription}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default CardComponent;
