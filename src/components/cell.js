import './styles.css';

function Cell ({position, image}) {
    let imageId = `cell-${position}`;
    if ((position[0] + position[1])%2 === 0){
        return <span className = "cell white" id={position}> </span>
    } 
    else {
        return <span className = "cell black" id={position}> {image && <img  className = "piece" id={imageId}  src={image} alt=""></img>} </span>
    }
 }

export default Cell;