import React from "react";
import { Player } from "video-react";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useGetAllPostsQuery } from "../postFeature";
import ReactReadMoreReadLess from "react-read-more-read-less";
import "../../node_modules/video-react/dist/video-react.css"; // import css
import poster from "../image/play-button.png";

function Home() {
  const { data: post, isLoading } = useGetAllPostsQuery({ user: "" });

  let index;
  if (!isLoading) {
    index = Math.floor(Math.random() * post.length);
  }

  function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="container">
      <div className="leftContainer">
        <h1 className="title">APP</h1>
        <Card sx={{ maxWidth: 345, margin: "20px 0 0 40px" }}>
          <CardHeader
            avatar={
              <Avatar sx={{ backgroundColor: "red" }} aria-label="recipe">
                {post[index].rootUser.slice(0, 1).toUpperCase()}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={post[index].name}
            subheader={post[index].date || "September 14, 2016"}
          />
          {isImage(post[index].image) ? (
            <CardMedia
              component="img"
              height="140"
              image={post[index].image}
              alt="Not Found"
            />
          ) : (
            <Player playsInline poster={poster} src={post[index].image} />
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {post[index].name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <ReactReadMoreReadLess
                charLimit={80}
                readMoreText={"Read more ▼"}
                readLessText={"Read less ▲"}
                readMoreClassName="read-more-less--more"
                readLessClassName="read-more-less--less"
              >
                {post[index].post}
              </ReactReadMoreReadLess>
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <IconButton aria-label="add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="share">
              <ShareIcon />
            </IconButton>
          </CardActions>
        </Card>
      </div>
      <div className="rightContainer">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo iste soluta
        quae libero possimus sapiente quidem optio ad nisi ullam veritatis
        officia ab nostrum, sunt esse voluptatem magni vel illo! Voluptas
        mollitia officia facere quia quis sed expedita illo iure, saepe
        voluptatibus vero nulla illum dolorum dicta fugit corrupti laborum quo
        odit voluptates. Quaerat error cumque rem optio necessitatibus
        consequatur eum. Distinctio perferendis quibusdam quidem assumenda qui
        iure enim vero id! Porro consequatur nulla provident exercitationem
        neque vitae natus vel? Voluptates consequuntur, dolorem dolores
        similique vitae dicta quaerat adipisci perferendis. Nobis omnis,
        corporis quo quisquam quos expedita pariatur quis dignissimos?
      </div>
    </div>
  );
}
export default Home;