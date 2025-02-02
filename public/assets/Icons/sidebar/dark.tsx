import { theme } from 'antd'

export default () => {
    const { token } = theme.useToken();
    return (
        <svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="0" x2="512" y1="255" y2="255" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e3e4e6" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#6a97ff" className="stopColor6a97ff svgShape"></stop></linearGradient><path fill="url(#a)" d="M355.556,341.333c-102.111,0-184.889-82.778-184.889-184.889
		c0-65.934,34.623-123.651,86.569-156.382C256.819,0.061,256.417,0,256,0C114.615,0,0,114.615,0,256c0,141.384,114.615,256,256,256
		s256-114.616,256-256c0-0.417-0.061-0.819-0.063-1.236C479.207,306.71,421.49,341.333,355.556,341.333z"></path></svg >
    )
};