import { theme } from 'antd'

export default () => {
    const { token } = theme.useToken();
    return (
        <svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="131.749" x2="380.251" y1="294.953" y2="46.451" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColordefcf2 svgShape"></stop><stop offset="1" stopColor="#98e1fd" className="stopColor98e1fd svgShape"></stop></linearGradient><path fill="url(#a)" d="M332.8,512H179.2V179.2c0-14.138,11.462-25.6,25.6-25.6h102.4
			c14.138,0,25.6,11.462,25.6,25.6V512z"></path><linearGradient id="b" x1="246.949" x2="572.251" y1="410.153" y2="84.851" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#abdafb" className="stopColorabdafb svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor638fff svgShape"></stop></linearGradient><path fill="url(#b)" d="M486.4,512H332.8V25.6
			c0-14.138,11.462-25.6,25.6-25.6h102.4c14.138,0,25.6,11.462,25.6,25.6V512z"></path><linearGradient id="c" x1="10.149" x2="194.651" y1="198.953" y2="14.451" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#abdafb" className="stopColorabdafb svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor638fff svgShape"></stop></linearGradient><path fill="url(#c)" d="M179.2,512H25.6V307.2
			c0-14.138,11.462-25.6,25.6-25.6h102.4c14.138,0,25.6,11.462,25.6,25.6V512z"></path></svg >
    )
};