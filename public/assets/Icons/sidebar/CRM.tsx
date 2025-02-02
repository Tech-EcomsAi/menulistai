import { theme } from 'antd'

export default () => {
    const { token } = theme.useToken();
    return (
        <svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="217.6" x2="448" y1="357.4" y2="357.4" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#638fff" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor7f8eb8 svgShape"></stop></linearGradient><circle cx="332.8" cy="153.6" r="115.2" fill="url(#a)"></circle><linearGradient id="b" x1="153.6" x2="512" y1="114.2" y2="114.2" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#defcf2" className="stopColorc9f7f5 svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor47ebda svgShape"></stop></linearGradient><path fill="url(#b)" d="M460.8,473.6h-256
			c-28.277,0-51.2-22.923-51.2-51.2v0c0-56.554,45.846-102.4,102.4-102.4h153.6c56.554,0,102.4,45.846,102.4,102.4v0
			C512,450.677,489.077,473.6,460.8,473.6z"></path><linearGradient id="c" x1="64" x2="294.4" y1="357.4" y2="357.4" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e3e4e6" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#c9f7f5" className="stopColor7f8eb8 svgShape"></stop></linearGradient><circle cx="179.2" cy="153.6" r="115.2" fill="url(#c)"></circle><g fill="#000000" className="color000 svgShape"><linearGradient id="d" x1="0" x2="358.4" y1="114.2" y2="114.2" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#e3e4e6" className="stopColore3e4e6 svgShape"></stop><stop offset="1" stopColor="#c9f7f5" className="stopColor7f8eb8 svgShape"></stop></linearGradient><path fill="url(#d)" d="M307.2,473.6h-256
			C22.923,473.6,0,450.677,0,422.4v0C0,365.846,45.846,320,102.4,320H256c56.554,0,102.4,45.846,102.4,102.4v0
			C358.4,450.677,335.477,473.6,307.2,473.6z"></path></g></svg >
    )
};