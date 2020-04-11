import React, { Component, createRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

class AddItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      newItem: {},
      value: '',
      id: this.props.idName
    }

    this.input = createRef()
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit (e) {
    e.preventDefault() // this prevents the page from reloading -- do not delete this line!
    // items are {id, value, selected} in arrays and belong to parent objects {name, id, items}

    // call addItem(listName, newItem) and hand over access to state
    this.props.onAddItem(this.props.idName,
      { id: uuidv4(), value: this.input.current.value, selected: false })
  }

  render () {
    var divName = 'add' + this.props.idName
    return (
      <div className='addItemDiv'>
        <h4>Add {this.props.idName}</h4>
        <form ref='form' onSubmit={this.handleSubmit}>
          <div id={divName} ref={divName}>
            <label>Name</label><br />
            <input type='text' ref={this.input} />
          </div>
          <br />
          <input type='submit' value='Submit' />
          <br />
        </form>
      </div>
    )
  }
}

export default AddItem
