import React from 'react'
import { connect } from 'react-redux'
import { edit } from '../actions'

let EditBoard = ({ dispatch }) => {
  let input1, input2

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input1.value.trim() || !input2.value.trim()) {
          return
        }
        
        dispatch(edit(input1.value, input2.value))
      }}>
        <input ref={node => {
          input1 = node
        }} />
         <input ref={node => {
          input2 = node
        }} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}
EditBoard = connect()(EditBoard)

export default EditBoard