import { theme } from 'antd'

export default () => {
	const { token } = theme.useToken();
	return (
		<svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="28.444" x2="369.778" y1="169.667" y2="169.667" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#c9f7f5" className="stopColorc9f7f5 svgShape"></stop><stop offset="1" stopColor="#47ebda" className="stopColor47ebda svgShape"></stop></linearGradient><path fill="url(#a)" d="M321.016,414.476H77.206c-26.93,0-48.762-21.831-48.762-48.762v0
			c0-53.861,43.663-97.524,97.524-97.524h146.286c53.861,0,97.524,43.663,97.524,97.524v0
			C369.778,392.645,347.946,414.476,321.016,414.476z"></path><linearGradient id="b" x1="89.397" x2="308.825" y1="401.286" y2="401.286" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e3e4e6" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#7f8eb8" className="stopColor7f8eb8 svgShape"></stop></linearGradient><circle cx="199.111" cy="109.714" r="109.714" fill="url(#b)"></circle><linearGradient id="c" x1="296.635" x2="442.921" y1="218.429" y2="218.429" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e3e4e6" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#7f8eb8" className="stopColor7f8eb8 svgShape"></stop></linearGradient><path fill="url(#c)" d="M418.54,365.714
			c-13.476,0-24.381-10.917-24.381-24.381v-48.762c0-13.443-10.929-24.381-24.381-24.381c-13.452,0-24.381,10.938-24.381,24.381
			v48.762c0,13.464-10.905,24.381-24.381,24.381s-24.381-10.917-24.381-24.381v-48.762c0-40.33,32.81-73.143,73.143-73.143
			s73.143,32.812,73.143,73.143v48.762C442.921,354.798,432.016,365.714,418.54,365.714z"></path><g fill="#000000" className="color000 svgShape"><linearGradient id="d" x1="256" x2="483.556" y1="84.333" y2="84.333" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e3e4e6" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#7f8eb8" className="stopColor7f8eb8 svgShape"></stop></linearGradient><path fill="url(#d)" d="M455.111,512H284.444
			C268.735,512,256,499.265,256,483.556V369.778c0-15.709,12.735-28.444,28.445-28.444h170.667
			c15.709,0,28.444,12.735,28.444,28.444v113.778C483.555,499.265,470.82,512,455.111,512z"></path></g></svg >
	)
};