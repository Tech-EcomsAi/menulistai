import { theme } from 'antd'

export default () => {
	const { token } = theme.useToken();
	return (
		<svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="14.222" x2="298.667" y1="255" y2="255" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#c9f7f5" className="stopColorc9f7f5 svgShape"></stop><stop offset="1" stopColor="#47ebda" className="stopColor47ebda svgShape"></stop></linearGradient><path fill="url(#a)" d="M42.666,512c-7.278,0-14.556-2.778-20.111-8.33c-11.111-11.111-11.111-29.118,0-40.229
			L230,255.999L22.555,48.558c-11.111-11.111-11.111-29.118,0-40.229c11.111-11.104,29.111-11.104,40.222,0l227.556,227.556
			c11.111,11.111,11.111,29.118,0,40.229L62.777,503.67C57.222,509.222,49.944,512,42.666,512z"></path><linearGradient id="b" x1="213.333" x2="497.779" y1="255" y2="255" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e3e4e6" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#7f8eb8" className="stopColor7f8eb8 svgShape"></stop></linearGradient><path fill="url(#b)" d="M241.778,512
			c-7.278,0-14.556-2.778-20.111-8.33c-11.111-11.111-11.111-29.118,0-40.229l207.445-207.442L221.667,48.558
			c-11.111-11.111-11.111-29.118,0-40.229c11.111-11.104,29.111-11.104,40.222,0l227.556,227.556
			c11.111,11.111,11.111,29.118,0,40.229L261.889,503.67C256.333,509.222,249.056,512,241.778,512z"></path></svg >
	)
};