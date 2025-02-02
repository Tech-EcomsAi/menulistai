import { theme } from 'antd'

export default () => {
	const { token } = theme.useToken();
	return (
		<svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="85.53" x2="426.583" y1="407.361" y2="66.308" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#abdafb" className="stopColorabdafb svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor638fff svgShape"></stop></linearGradient><path fill="url(#a)" d="M498.526,350.316c0,29.913-23.987,53.895-53.895,53.895H67.368
			c-14.822,0-28.296-5.928-38-15.628c-9.697-9.702-15.895-23.176-15.895-38.266c0-14.821,6.197-28.294,15.895-37.995
			c9.704-9.97,23.178-15.9,38-15.9c15.085,0,26.947-12.125,26.947-26.947V161.684c0-44.732,18.053-85.153,47.428-114.257
			C171.112,18.056,211.533,0,256,0c89.461,0,161.684,72.488,161.684,161.684v107.789c0,14.822,12.125,26.947,26.947,26.947
			c14.822,0,28.296,5.929,38.263,15.9C492.599,322.021,498.526,335.495,498.526,350.316z"></path><linearGradient id="b" x1="248.173" x2="361.548" y1="441.24" y2="327.865" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor98e1fd svgShape"></stop></linearGradient><path fill="url(#b)" d="M336.928,202.169
			c-7.447,0-13.474-6.026-13.474-13.474v-26.947c0-37.145-30.224-67.368-67.368-67.368c-7.447,0-13.474-6.026-13.474-13.474
			s6.026-13.474,13.474-13.474c52,0,94.316,42.316,94.316,94.316v26.947C350.401,196.143,344.375,202.169,336.928,202.169z"></path><linearGradient id="c" x1="200.48" x2="311.57" y1="132.111" y2="21.021" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor98e1fd svgShape"></stop></linearGradient><path fill="url(#c)" d="M336.842,404.211v26.947
			C336.842,475.891,300.73,512,256,512c-44.467,0-80.842-36.109-80.842-80.842v-26.947H336.842z"></path></svg >
	)
};