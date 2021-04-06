import './styles.css';

function Piece(numId:Number, color:String, type:String  , state:String, row:Number, col:Number, canCapture: Boolean) {
    this.numId = numId;
    this.color = color;
    this.type = type;
    this.state = state;
    this.row = row;
    this.col = col;
    this.canCapture = canCapture;
}

export default Piece;
