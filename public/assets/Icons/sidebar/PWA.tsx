import { theme } from 'antd'

export default () => {
    const { token } = theme.useToken();
    return (
        <svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="12.491" x2="499.509" y1="255" y2="255" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#c9f7f5" className="stopColorc9f7f5 svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor47ebda svgShape"></stop></linearGradient><path fill="url(#a)" d="M239.868,4.627L26.797,137.796c-8.9,5.562-14.306,15.317-14.306,25.812v287.515
		c0,33.621,27.256,60.877,60.877,60.877h121.754V359.807H256h60.877V512h121.754c33.621,0,60.877-27.256,60.877-60.877V163.607
		c0-10.495-5.406-20.249-14.306-25.812L272.132,4.627C262.262-1.542,249.738-1.542,239.868,4.627z"></path></svg >
    )
};