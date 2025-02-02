import { theme } from 'antd'

export default () => {
	const { token } = theme.useToken();
	return (
		<svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="58.109" x2="254.78" y1="538.224" y2="341.553" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#abdafb" className="stopColorabdafb svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor638fff svgShape"></stop></linearGradient><path fill="url(#a)" d="M270.222,142.222H42.667c-15.71,0-28.444-12.735-28.444-28.444V28.444
			C14.222,12.735,26.957,0,42.667,0h227.556c15.709,0,28.444,12.735,28.444,28.444v85.333
			C298.667,129.487,285.932,142.222,270.222,142.222z"></path><linearGradient id="b" x1="363.887" x2="489.447" y1="502.669" y2="377.109" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor98e1fd svgShape"></stop></linearGradient><path fill="url(#b)" d="M469.333,142.222H384
			c-15.709,0-28.444-12.735-28.444-28.444V28.444C355.556,12.735,368.291,0,384,0h85.333c15.709,0,28.444,12.735,28.444,28.444
			v85.333C497.778,129.487,485.043,142.222,469.333,142.222z"></path><linearGradient id="c" x1="-20.113" x2="190.78" y1="260.891" y2="49.998" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor98e1fd svgShape"></stop></linearGradient><path fill="url(#c)" d="M128,512H42.667
			c-15.71,0-28.444-12.735-28.444-28.444v-256c0-15.71,12.735-28.444,28.444-28.444H128c15.71,0,28.444,12.735,28.444,28.444v256
			C156.444,499.265,143.71,512,128,512z"></path><g fill="#000000" className="color000 svgShape"><linearGradient id="d" x1="214.553" x2="496.558" y1="296.447" y2="14.442" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#abdafb" className="stopColorabdafb svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor638fff svgShape"></stop></linearGradient><path fill="url(#d)" d="M469.333,512H241.778
			c-15.71,0-28.444-12.735-28.444-28.444v-256c0-15.71,12.735-28.444,28.444-28.444h227.556c15.709,0,28.444,12.735,28.444,28.444
			v256C497.778,499.265,485.043,512,469.333,512z"></path></g></svg >
	)
};