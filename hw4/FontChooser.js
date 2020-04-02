class FontChooser extends React.Component {
  constructor (props) {
	super(props)

	// have to bind like below to access `this` correctly.
	this.handleTextClick = this.handleTextClick.bind(this.handleTextClick)
	this.handleDecreaseButton = this.handleDecreaseButton.bind(this.handleDecreaseButton)
	this.handleIncreaseButton = this.handleIncreaseButton.bind(this.handleIncreaseButton)
	this.handleCheckBox = this.handleCheckBox.bind(this.handleCheckBox)
	
	var [minSize, maxSize, fontSize] = [this.props.min, this.props.max, this.props.size] // is there a clean way to do this?
	// ERROR HANDLING:
	minSize = minSize <= 0 ? 1 : minSize
	maxSize = maxSize < minSize ? minSize : maxSize
	
	// make sure fontSize is between min and max
	if (fontSize <= minSize) {
		fontSize = minSize
	} else if (fontSize > maxSize) {
		fontSize = maxSize
	}
	

    this.state = {
		minSize: minSize,
		maxSize: maxSize,
		hideForm: true,
		fontColor: 'black',
		fontStyle: 'normal',
		fontSize: fontSize,
		boldFont: this.props.bold ? 'bold' : 'normal' 
	 }
  }

  // use the fxn form of setState() to make sure that previous state is used...
  handleTextClick = (event) => {
    console.log(event.target)
    this.setState((state) => ({
      hideForm: !state.hideForm
    }))
  }

  handleIncreaseButton = (event) => {
	// var textSize = this.state.fontSize
	console.log(this.maxSize)
	this.setState( state => {
		if (state.fontSize < state.maxSize) {
			return {fontSize: state.fontSize+1}
		} else if (state.fontSize == state.maxSize) {
			return {
				fontColor: 'green',
				fontStyle: 'italic'
				}
		}
	})
	}

	


  handleDecreaseButton = (event) => {
	  var textSize = this.state.fontSize
	  this.setState( (state) => ({ fontSize: state.fontSize-- }) )
	  console.log(textSize)
  }

  handleCheckBox = (event) => {
	  console.log(event.target)
	  const checkBox = event.target
	  console.log(checkBox.checked)
	  this.setState( (state) => ({ boldFont: state.boldFont === 'normal'? 'bold' : 'normal'}) )

  }
  
// implement for min
  render () {
    return (
      <div>
        <input type='checkbox' id='boldCheckbox' onChange={this.handleCheckBox} hidden={this.state.hideForm} />
        <button id='decreaseButton' onClick={this.handleDecreaseButton} hidden={this.state.hideForm}>-</button>
        <span id='fontSizeSpan' hidden={this.state.hideForm}>{this.state.fontSize}</span>
        <button id='increaseButton' onClick={this.handleIncreaseButton} hidden={this.state.hideForm}>+</button>
        <span id='textSpan' style={{fontStyle: this.state.fontStyle, color: this.state.fontColor, fontSize: this.state.fontSize, fontWeight: this.state.boldFont}} onClick={this.handleTextClick}>{this.props.text}</span>
      </div>
    )
  }
}
