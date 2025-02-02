import { theme } from 'antd'

export default () => {
	const { token } = theme.useToken();
	return (
		<svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="0" x2="512" y1="255" y2="255" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#98e1fd" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#6b98fe" className="stopColor6b98fe svgShape"></stop></linearGradient><circle cx="256" cy="256" r="256" fill="url(#a)"></circle><linearGradient id="b" x1="156.444" x2="355.465" y1="297.658" y2="297.658" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#c9f7f5" className="stopColorc9f7f5 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor47ebda svgShape"></stop></linearGradient><path fill="url(#b)" d="M256,341.333
			c-15.722,0-28.444-12.736-28.444-28.444v-13.424c0-33.021,18.194-62.781,46.333-75.82c15.611-7.236,29.555-26.146,23.25-50.58
			c-3.611-13.927-15.389-25.705-29.305-29.306c-13.667-3.531-27.194-0.945-37.917,7.365c-10.528,8.16-16.583,20.469-16.583,33.764
			c0,15.708-12.722,28.444-28.444,28.444s-28.444-12.736-28.444-28.444c0-31.024,14.083-59.722,38.639-78.736
			c24.583-19.042,56.278-25.389,86.972-17.472c33.861,8.75,61.389,36.281,70.139,70.146c12.222,47.222-10.667,96.191-54.417,116.441
			c-7.972,3.694-13.333,13.42-13.333,24.198v13.424C284.444,328.597,271.722,341.333,256,341.333z"></path><linearGradient id="c" x1="227.556" x2="284.445" y1="112.778" y2="112.778" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#98e1fd" className="stopColorc9f7f5 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor47ebda svgShape"></stop></linearGradient><circle cx="256" cy="398.222" r="28.444" fill="url(#c)"></circle></svg >
	)
};