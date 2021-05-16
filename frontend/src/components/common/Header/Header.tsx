import { Button, styled } from '@material-ui/core';
import { MenuOutlined, Close } from '@material-ui/icons';
import { useState } from 'react';

const HeaderRoot = styled('div')({
    background: 'black',
});

const MenuBtn = styled(Button)({
    margin: 10,
    padding: 0,
    minWidth: 40,
    minHeight: 30,
});
const MenuBtnIcon = styled(MenuOutlined)({
    color: 'white',
    fontSize: 40,
    transition: 'all 0.5s ease-in-out',

    '& .on': {
        // transform: 'trans',
    },
});
const MenuCloseBtnIcon = styled(Close)({
    color: 'white',
    fontSize: 40,

    transition: 'all 0.5s ease-in-out',
});

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function toggleMenu(e: React.MouseEvent<HTMLButtonElement>) {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <HeaderRoot>
            <MenuBtn onClick={toggleMenu}>
                {isMenuOpen ? <MenuCloseBtnIcon /> : <MenuBtnIcon />}
            </MenuBtn>
        </HeaderRoot>
    );
};

export default Header;
