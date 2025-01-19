import { Poppins } from "next/font/google";
// reference: https://fonts.google.com/specimen/Poppins?preview.text=ecoms.ai&query=poppin

export const poppinsFont = Poppins({
    subsets: ['latin'],
    display: 'swap',
    variable: '--poppins-font',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});