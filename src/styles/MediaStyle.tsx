import { generateMedia } from "styled-media-query";

const mediaSize = {
  huge: "1280px",
  large: "1024px",
  medium: "756px",
  small: "600px",
  minimum: "400px",
};

const media = generateMedia(mediaSize);

export default media;
