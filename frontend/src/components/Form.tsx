import React from 'react';
import Input from './Input';
import Button from './Button';
import ParagraphLink from './ParagraphLink';

function Form(props) {
    const { format } = props;

    return (
        <>
            {format.inputValue.map((input, idx) => (
                <Input
                    key={idx}
                    name={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    value={input.name}
                />
            ))}
            {format.buttonValue.map((button, idx) => (
                <Button key={idx} text={button.text} onClick={button.onClick} />
            ))}
            {format.linkValue.map((link, idx) => (
                <ParagraphLink key={idx} text={link.text} url={link.url} />
            ))}
        </>
    );
}
