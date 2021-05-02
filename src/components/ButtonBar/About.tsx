
type AboutProps = {
    toggle: () => void,
}

const About:React.FC<AboutProps> = ({toggle}) => {
    return (
        <button className="about btn" onClick={toggle}>
            <div className="btn-img"></div>
        </button>
        )
}

export default About;