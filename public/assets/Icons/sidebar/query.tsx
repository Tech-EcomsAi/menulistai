import { theme } from 'antd'

export default () => {
    const { token } = theme.useToken();
    return (
        <svg style={{ color: token.colorPrimary }} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" width="256" height="256" ><linearGradient id="a" x1="1.183" x2="510.817" y1="255" y2="255" gradientTransform="matrix(1 0 0 -1 0 511)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#98e1fd" className="stopColorc9f7f5 svgShape"></stop><stop offset="1" stopColor="#638fff" className="stopColor47ebda svgShape"></stop></linearGradient><path fill="url(#a)" d="M221.308,2.979C119.892,18.361,36.665,97.465,15.67,197.869
		c-11.794,56.405-3.894,109.928,17.213,156.165L2.039,477.416c-5.092,20.369,13.359,38.82,33.728,33.728l125.058-31.263
		c35.009,15.223,74.11,22.803,115.282,20.27c129.086-7.94,233.375-117.896,234.697-247.219
		C512.359,100.595,377.823-20.761,221.308,2.979z"></path></svg >
    )
};