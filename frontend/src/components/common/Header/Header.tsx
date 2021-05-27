import { Button, styled, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { MenuOutlined, Close, Person } from '@material-ui/icons';
import { useEffect, useState } from 'react';

// Common Style
const menuBtnCommonStyle = {
    margin: 10,
    padding: 0,
    minWidth: 40,
    minHeight: 30,
};
const mainBGColor = { backgroundColor: 'black' };
const mainFontColor = { color: 'white' };
const mouseHoverCommonStyle = {
    color: 'gray',
    textDecoration: 'none',
};
const useStyles = makeStyles({
    root: {
        ...mainBGColor,
        maxWidth: '100vw',
    },

    // 맨 상단 좌측 메뉴
    leftMenuBtn: {
        ...mainFontColor,
        ...menuBtnCommonStyle,

        '&:hover': {
            ...mouseHoverCommonStyle,
        },
    },

    // 맨 상단 우측 메뉴
    rightMenuRoot: {
        margin: 5,
        float: 'right',
    },
    rightMenuBtn: {
        ...mainFontColor,
        ...menuBtnCommonStyle,

        '&:hover': {
            ...mouseHoverCommonStyle,
        },
    },

    // 메뉴 오픈시 보이는 wrapper
    wrapperRoot: {
        ...mainFontColor,
        ...mainBGColor,
        position: 'relative',
        display: 'flex',
        maxWidth: '100vw',
        height: 200,
        justifyContent: 'space-around',

        '&:before': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            content: `''`,
            borderTop: '1px solid #4d4d4d',
        },
        '& > .left-root': {},
        '& > .right-root': {},
    },
});

const MenuBtnIcon = styled(MenuOutlined)({
    fontSize: 40,
});
const MenuCloseBtnIcon = styled(Close)({
    fontSize: 40,
});
const MyPageBtnIcon = styled(Person)({
    fontSize: 30,
});

const Header = () => {
    const classes = useStyles();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);

    // 로그인 체크
    // useEffect(() => {

    // }, []);

    function toggleMenu(e: React.MouseEvent<HTMLButtonElement>) {
        setIsMenuOpen(!isMenuOpen);
    }

    return (
        <div className={classes.root}>
            <Button className={classes.leftMenuBtn} onClick={toggleMenu}>
                {isMenuOpen ? <MenuCloseBtnIcon /> : <MenuBtnIcon />}
            </Button>
            <div className={classes.rightMenuRoot}>
                {!isLogin && (
                    <Link href="/login" className={classes.rightMenuBtn}>
                        Login
                    </Link>
                )}
                {isLogin && (
                    <Link href="/" className={classes.rightMenuBtn}>
                        Logout
                    </Link>
                )}
                <Button className={classes.rightMenuBtn}>
                    <MyPageBtnIcon />
                </Button>
            </div>
            {isMenuOpen && (
                <div className={classes.wrapperRoot}>
                    <div className="left-root">
                        <ul>
                            <li>하하</li>
                            <li>하하</li>
                        </ul>
                    </div>
                    <div className="right-root">
                        <ul>
                            <li>하하</li>
                            <li>하하</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
