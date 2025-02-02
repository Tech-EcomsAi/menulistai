import { theme } from 'antd'

export default () => {
	const { token } = theme.useToken();
	return (
		<svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="145.604" x2="449.156" y1="448.09" y2="144.538" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor98e1fd svgShape"></stop></linearGradient><path fill="url(#a)" d="M512,214.686c0,118.578-96.044,214.619-214.619,214.619
				c-39.71,0-76.998-10.998-108.921-29.778c-31.392-18.242-57.408-44.533-75.923-75.653
				c-19.046-31.924-29.775-69.213-29.775-109.187C82.763,96.109,178.8,0.067,297.381,0.067C415.956,0.067,512,96.109,512,214.686z"></path><linearGradient id="b" x1="45.138" x2="121.058" y1="119.991" y2="44.071" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#98e1fd" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor638fff svgShape"></stop></linearGradient><path fill="url(#b)" d="M188.461,399.526l-96.849,96.846
				c-10.46,10.463-24.142,15.56-38.093,15.56c-13.682,0-27.364-5.097-37.824-15.56c-20.926-20.924-20.926-54.727,0-75.92
				l96.843-96.579C131.053,354.994,157.069,381.284,188.461,399.526z"></path><g fill="#defcf2" className="color000 svgShape"><linearGradient id="c" x1="261.155" x2="333.778" y1="332.562" y2="259.939" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor638fff svgShape"></stop></linearGradient><path fill="url(#c)" d="M190.157,281.818
			c-3.432,0-6.864-1.31-9.484-3.93c-5.24-5.24-5.24-13.728,0-18.968l80.482-80.482c5.24-5.24,13.728-5.24,18.968,0l44.171,44.171
			l70.998-70.998c5.24-5.24,13.728-5.24,18.968,0c5.24,5.24,5.24,13.728,0,18.968l-80.482,80.482c-5.24,5.24-13.728,5.24-18.968,0
			l-44.171-44.171l-70.998,70.998C197.021,280.508,193.589,281.818,190.157,281.818z"></path></g></svg >
	)
};