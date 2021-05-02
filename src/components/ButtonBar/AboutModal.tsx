import { MouseEventHandler } from "react";

type ModalProps = {
    toggle: () => void,
    show: boolean,
}

const AboutModal:React.FC<ModalProps> = ({toggle, show}) => {
    const className = show ? "modal show" : "modal hide";
    const handleClick:MouseEventHandler<HTMLDivElement> = (event) => {
        event.stopPropagation();
        toggle();
    }
    return (
        <div className={className} onClick={handleClick}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>What is this?</h2>
                </div>
                <div className="modal-body">
                    <h3>Description</h3>
                    <p>This is chess with powerups. I made this as a side project to learn more about programming
                        on the web, namely using ReactJS and Redux.
                    </p>
                    <p>I haven't landed on a set of rules utilizing the powerups yet so feel free to make up your own.
                        
                    </p>
                    <h3>PowerUps</h3>
                    <h4>Guard</h4>
                    <p>Captures pieces that walk into it's available squares.</p>
                    <h4>Shield</h4>
                    <p>The piece cannot be captured.</p>
                    <h4>Sword</h4>
                    <p>Movement will capture pieces directly adjacent to it's landing spot.</p>
                    <h4>Flail</h4>
                    <p>Movement will capture pieces diagonally adjacent to it's landing spot.</p>
                    <a href="https://github.com/ng-tony/Chess-Battle" rel="noreferrer noopener" target="_blank"><p>More info</p></a>
                </div>
            </div>
        </div>
    )
}

export default AboutModal;