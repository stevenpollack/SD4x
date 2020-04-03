class FontChooser extends React.Component {
  constructor (props) {
	super(props)
	
	// bind all handlers
	this.handleTextClick = this.handleTextClick.bind(this.handleTextClick)
	this.handleDecreaseButton = this.handleDecreaseButton.bind(this.handleDecreaseButton)
	this.handleIncreaseButton = this.handleIncreaseButton.bind(this.handleIncreaseButton)
	this.handleCheckBox = this.handleCheckBox.bind(this.handleCheckBox)
	this.handleTextDoubleClick = this.handleTextDoubleClick.bind(this.handleTextDoubleClick)

	let [minSize, maxSize, fontSize] = [this.props.min, this.props.max, this.props.size] // is there a clean way to do this?
	
	let fontWeight = this.props.bold ? 'bold' : 'normal'
	
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
		timeoutID: [],
		minSize: minSize,
		maxSize: maxSize,
		hideForm: true,
		fontColor: 'black',
		fontStyle: 'normal',
		fontSize: fontSize,
		fontWeight: fontWeight
	 }
  }


  // use the fxn form of setState() to make sure that previous state is used...
  handleTextClick = (event) => {
	  console.log('handleTextClick')
	  const dblClickDelay = 200 //ms
	  var timeoutID = setTimeout( () => {
		      this.setState((state) => {
				  let tID = state.timeoutID
				  console.log('popping tID: ' + tID.pop())
				  return {timeoutID: tID, hideForm: !state.hideForm}
			  })
			}, dblClickDelay)
		console.log(timeoutID)
	  this.setState( (state) => {
		let tID = state.timeoutID
		tID.push(timeoutID)
		return {timeoutID: tID}
	  })
  }

  handleTextDoubleClick = (event) => {
	// clear the single click event timeout call
	if (this.state.timeoutID != []) {
		let tIDs = this.state.timeoutID
		tIDs.forEach(clearTimeout)
		console.log('clearing tIDs: ' + tIDs)
		this.setState({timeoutID: []})
	}
  console.log('hi')
	this.setState((state) => {
		return {
			fontStyle: 'normal',
			fontSize: this.props.size,
			boldFont: this.props.bold ? 'bold' : 'normal',
			fontColor: 'black'
		}
	})
}

  handleIncreaseButton = (event) => {

	this.setState( state => {
		if (state.fontSize == state.maxSize) {
			return {} // do nothing and break
		}

		var newSize = state.fontSize+1
		if (newSize == state.maxSize) {
			return {
				fontSize: newSize,
				fontColor: 'red',
				fontStyle: 'italic'
				}
		} else {
			return {
				fontStyle: 'normal',
				fontSize: newSize,
				fontColor: 'black'
			}
		} 
	})
	}

  handleDecreaseButton = (event) => {
	this.setState( state => {
		if (state.fontSize == state.minSize) {
			return {} // do nothing and break
		}

		var newSize = state.fontSize-1
		if (newSize == state.minSize) {
			return {
				fontSize: newSize,
				fontColor: 'red',
				fontStyle: 'italic'
				}
		} else {
			return {
				fontStyle: 'normal',
				fontSize: newSize,
				fontColor: 'black'
			}
		} 
	})
  }

  handleCheckBox = (event) => {
	  console.log(event.target)
	  const checkBox = event.target
	  console.log(checkBox.checked)
	  this.setState( (state) => ({
		   boldFont: state.boldFont === 'normal'? 'bold' : 'normal'})
		   )
  }

  render () {
    return (
      <div>
        <span id='textSpan'
		 onClick={this.handleTextClick}
		 onDoubleClick={this.handleTextDoubleClick}
		 style={{
			 fontStyle: this.state.fontStyle,
			 color: this.state.fontColor,
			 fontSize: this.state.fontSize,
			 fontWeight: this.state.fontWeight}}>
		  	{this.props.text}
		</span>
      	<br/>
		  <label hidden={this.state.hideForm}>
		  	<input type='checkbox'
			   id='boldCheckbox'
			   checked={this.state.fontWeight == 'bold' ? true : false}
			   onChange={this.handleCheckBox}/>
		  	Bold
		  </label>

		<button id='decreaseButton' onClick={this.handleDecreaseButton} hidden={this.state.hideForm}>-</button>
        <span id='fontSizeSpan' hidden={this.state.hideForm}>{this.state.fontSize}</span>
        <button id='increaseButton' onClick={this.handleIncreaseButton} hidden={this.state.hideForm}>+</button>
        </div>
    )
  }
}
