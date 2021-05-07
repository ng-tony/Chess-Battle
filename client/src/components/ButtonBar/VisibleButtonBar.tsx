import { connect } from "react-redux"
import ButtonBar from "."
import { toggleAbout } from "../../actions"

const mapStateToProps = (state: {
    gameInfo: {about:boolean}
}) => {
    return {
        aboutShow: state.gameInfo.about
    }
}

const mapDispatchToProps = (dispatch: (action: any) => void) => ({
    toggleAbout: () => dispatch(toggleAbout())
})

export default connect(mapStateToProps, mapDispatchToProps)(ButtonBar)
