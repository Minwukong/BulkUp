import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset'; // style-reset 패키지

const GlobalStyled = createGlobalStyle` 
    ${reset}
    @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap');
    a{
        text-decoration: none;
        color: inherit;
    }
    *{
        box-sizing: border-box;
    }
    body {
        font-family: Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
`;

export default GlobalStyled;
