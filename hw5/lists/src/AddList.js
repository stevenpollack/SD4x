import React, { Component } from 'react'

class AddList extends Component {
  constructor(props) {
    super(props)
    this.input = React.createRef()
    this.handleSubmit = this.handleSubmit.bind(this)
  }


  handleSubmit (e) {
    e.preventDefault() // this prevents the page from reloading -- do not delete this line!
    let newListName = this.input.current.value
    // App passes the callback addList() as a prop to <AddList/>,
    // it is how we bubble state back up to the parent container
    // not sure if this is good form!
    this.props.addList(newListName)
  }

  render () {
    return (
      <div id='addListDiv'>
        <form onSubmit={this.handleSubmit}>
          <div id='addList'>
            <label>What will be on your next list?&nbsp;
              <input type='text' ref={this.input} id='newID' onChange={this.handleChange}/>
            </label>
          </div><br />
          <input type='submit' value='Create List' />
        </form>
      </div>
    )
  }
}

export default AddList
