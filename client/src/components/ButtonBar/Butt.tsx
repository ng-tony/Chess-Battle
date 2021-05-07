
type ButtProps = {
    btnClass: string,
    onClick: () => void,
}

const Butt:React.FC<ButtProps> = ({btnClass, onClick}) => {
    return (
        <button className={btnClass + " btn"} onClick={onClick}>
            <div className="btn-img"></div>
        </button>
        )
}

export default Butt;