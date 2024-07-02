import './hover-button.css'

type props = {
  text: string
  onClick?: () => void
  size?: number
}

const HoverButton: React.FC<props> = ({ text, onClick, size }) => {
  return (
    <div
      className="Btn"
      onClick={onClick}
      style={{
        width: size || '55px',
        height: size || '55px',
      }}
    >
      <div className="sign">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="150"
          height="150"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="8.5" cy="7" r="4"></circle>
          <line x1="20" y1="8" x2="20" y2="14"></line>
          <line x1="23" y1="11" x2="17" y2="11"></line>
        </svg>
      </div>

      <div className="text">{text}</div>
    </div>
  )
}

export default HoverButton
