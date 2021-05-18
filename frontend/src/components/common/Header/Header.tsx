import { Button, styled, Link } from '@material-ui/core';
import { MenuOutlined, Close, Person } from '@material-ui/icons';
import { useEffect, useState } from 'react';

// Common Style
const menuBtnCommonStyle = {
    margin: 10,
    padding: 0,
    minWidth: 40,
    minHeight: 30,
};
const menuIconColor = { color: 'white' };
const mouseHoverCommonStyle = {
    color: 'gray',
    textDecoration: 'none',
};

// Root
const HeaderRoot = styled('div')({
    background: 'black',
    maxWidth: '100vw',
});

// MenuOpenBtn
const MenuOpenBtn = styled(Button)({
    ...menuBtnCommonStyle,
});

const menuOpenBtnIconStyle = {
    ...menuIconColor,
    fontSize: 40,
    // transition: 'all 0.5s ease-in-out',

    '&:hover': {
        ...mouseHoverCommonStyle,
    },
};
const MenuBtnIcon = styled(MenuOutlined)({
    ...menuOpenBtnIconStyle,
});
const MenuCloseBtnIcon = styled(Close)({
    ...menuOpenBtnIconStyle,
});

const RightMenuContent = styled('div')({
    margin: 5,
    float: 'right',
});

const LoginBtn = styled(Link)({
    ...menuIconColor,

    '&:hover': {
        ...mouseHoverCommonStyle,
    },
});
const LogoutBtn = styled(LoginBtn)({});

const MyPageBtn = styled(Button)({
    ...menuBtnCommonStyle,
});
const MyPageBtnIcon = styled(Person)({
    ...menuIconColor,
    fontSize: 30,

    '&:hover': {
        ...mouseHoverCommonStyle,
    },
});

const WrapperRoot = styled('div')({
    background: 'black',
    maxWidth: '100vw',
    height: 120,
});

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    // 로그인 체크
    // useEffect(() => {

    // }, []);

    function toggleMenu(e: React.MouseEvent<HTMLButtonElement>) {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <HeaderRoot>
            <MenuOpenBtn onClick={toggleMenu}>
                {isMenuOpen ? <MenuCloseBtnIcon /> : <MenuBtnIcon />}
            </MenuOpenBtn>
            <RightMenuContent>
                {!isLogin && <LoginBtn href="/">Login</LoginBtn>}
                {isLogin && <LogoutBtn href="/">Logout</LogoutBtn>}
                <MyPageBtn>
                    <MyPageBtnIcon />
                </MyPageBtn>
            </RightMenuContent>
            {isMenuOpen && (
                <WrapperRoot>
                    <div></div>
                </WrapperRoot>
            )}
        </HeaderRoot>
    );
};

export default Header;
