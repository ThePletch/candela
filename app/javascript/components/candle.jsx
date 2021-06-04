import React from 'react'

export default function (props) {
  if (props.lit) {
    return (
      <span className="badge badge-pill badge-warning">&nbsp;</span>
    )
  } else {
    return (
      <span className="badge badge-pill badge-dark">&nbsp;</span>
    )
  }
}
