const ToastMessage = ({ msg, color }) => {
  return (
    <div className="toast" style={{ backgroundColor: color }}>
      <p>{msg}</p>
    </div>
  )
}

export { ToastMessage }