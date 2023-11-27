import { createGlobalStyle } from "styled-components";
import "./fonts/font.css"
const GlobalStyle = createGlobalStyle`
* {
	font-family: "HakgyoansimWoojuR";
  font-weight: 300;
  font-display: swap;
}

article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
* {
  box-sizing: border-box ;
}
html, body {
  display: flex;
  flex-direction: column;
  max-width: 415px;
  height: 100vh;
  border: 0;
  overflow-x: hidden;
	scroll-behavior: smooth;
	/* margin: 0 0.5rem; 마진 nav바에도 영향 미쳐서 다른 방법 물색해야 함 */
}
body {
  padding-top: 3rem;
  padding-bottom: 3rem;
}
a {
  text-decoration: none;
	color:inherit;
}
*::-webkit-scrollbar {
  display: none;
}


`;
export default GlobalStyle;
